const moment = require("moment");
const db = require("../database/firestore");
const supervisorCollection = db.collection("supervisor");
const agentsCollection = db.collection("agents");
const leaveTypeCollectionRef = db.collection("leave_type");

const sendMail = require("../routes/email");
const dateFormat = require("dateformat");
const updateLeaveCount = require("../utils/helper");
const blockDates = require("../utils/blockDate");

exports.getAllLeaveType = async (req, res, next) => {
  let leaveTypes = [];
  try {
    let snapshot = await leaveTypeCollectionRef.get();
    for (const leaveType of snapshot.docs) {
      leaveTypes.push({ name: leaveType.data().name });
    }
    res.status(200).json({ leave_type: leaveTypes });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: process.env.SERVER_ERROR });
  }
};

exports.getRequestsByAgentId = async (req, res, next) => {
  let agentId = req.params.id;
  let allRequestByAgent = [];
  let requestObj = {};
  try {
    let document = await agentsCollection.doc(agentId).get();
    if (!document.exists) {
      return res.status(404).json({ message: process.env.NO_RECORD_FOUND });
    }
    let snapshot = await document.ref.collection("requests").get();
    for (const leaveRequest of snapshot.docs) {
      requestObj = {
        reqId: leaveRequest.data().reqId,
        title: leaveRequest.data().title,
        date_applied: leaveRequest.data().date_applied,
        type: leaveRequest.data().type,
        leave_hours: leaveRequest.data().leave_hours_count,
        remarks: leaveRequest.data().remarks,
        status: leaveRequest.data().status,
        approved_by: leaveRequest.data().approved_by,
        actioned_on: leaveRequest.data().actioned_on,
        leave_Dates: leaveRequest.data().leaveDates
      };
      allRequestByAgent.push(requestObj);
    }
    // console.log(allRequestByAgent);
    res.status(200).json({
      message: allRequestByAgent.length + " " + process.env.RECORD_FOUND,
      data: allRequestByAgent
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: process.env.SERVER_ERROR });
  }
};

exports.applyLeave = async (req, res, next) => {
  const empName = req.body.empName;
  const empEmail = req.body.empEmail;
  const leaveTitle = req.body.leaveTitle;
  const remarks = req.body.remarks;
  const leaveType = req.body.leaveType;
  const leaveDates = req.body.leaveDate;
  const docId = empEmail.split("@")[0];
  const reqId = (+new Date() / 1000).toFixed(0);
  const reqDate = dateFormat(new Date(), "mmmm dd, yyyy");
  const daysCount = leaveDates.length;
  const leaveHours = req.body.leaveHours;
  let actionedOn = "";
  let approvedBy = "";
  let supervisor = "";
  let leaveStatus = "";
  if (
    empName === null ||
    empName === undefined ||
    empEmail === null ||
    empEmail === undefined
  ) {
    return res.status(400).json({ message: process.env.PARAMS_MISSING });
  }
  try {
    let isSameDate = await checkConflictDates(docId, leaveDates);
    let agentId = await agentsCollection.doc(docId).get();
    supervisor = agentId.data().supervisor;
    console.log(isSameDate);
    console.log(agentId, "agentId");
    console.log(supervisor, "supervisor");
    if (isSameDate) {
      return res.status(400).json({ message: process.env.DATE_ALREADY_USED });
    }
    if (!agentId.exists) {
      return res.status(404).json({
        message: process.env.AGENT_ID_NOT_EXIST
      });
    }
    let requestObj = {
      reqId: reqId,
      title: leaveTitle,
      type: leaveType,
      leaveDates: leaveDates,
      days_count: daysCount,
      leave_hours_count: leaveHours,
      remarks: remarks,
      status: leaveStatus,
      date_applied: reqDate,
      approved_by: approvedBy,
      actioned_on: actionedOn
    };
    // console.log(requestObj, "requestObj");
    if (leaveType === process.env.SICK_LEAVE) {
      requestObj.status = process.env.LEAVE_STATUS_APPROVED;
      requestObj.approved_by = process.env.AUTO_APPROVED;
      requestObj.actioned_on = dateFormat(new Date(), "mmmm dd, yyyy");
      // console.log(requestObj, "125");
      let leaveCount = updateLeaveCount(
        agentsCollection,
        docId,
        leaveType,
        leaveHours,
        process.env.LEAVE_ACTION_APPLY
      );
      let blockDate = blockDates(
        agentsCollection,
        docId,
        reqId,
        leaveDates,
        leaveType
      );
      let setRequestDoc = agentsCollection
        .doc(docId)
        .collection("requests")
        .doc(reqId)
        .set(requestObj);
      let response = await Promise.all([leaveCount, blockDate, setRequestDoc]);
      console.log(response);
      res.status(200).json({
        message: process.env.LEAVE_REQUEST_SUBMITTED
      });
    } else {
      requestObj.status = process.env.LEAVE_STATUS_PENDING;
      // console.log(requestObj, "152");
      updateSupervisor(supervisor, docId, requestObj, res);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: process.env.SERVER_ERROR });
  }
};

exports.cancelLeaveRequest = async (req, res, next) => {
  const agentId = req.query.agentId;
  const refNumber = req.query.refNumber;
  try {
    if (!(agentId || refNumber)) {
      throw new Error(process.env.PARAMS_MISSING);
    }
    let agentReqColRef = agentsCollection.doc(agentId).collection("requests");
    let agentUsedDateColRef = agentsCollection
      .doc(agentId)
      .collection("used-dates");
    let reqDoc = await agentReqColRef.doc(refNumber).get();
    console.log(reqDoc);
    if (!reqDoc.exists) {
      throw new Error(process.env.NO_RECORD_FOUND);
    } else {
      const vacationType = reqDoc.data().type;
      const leaveHours = reqDoc.data().leave_hours_count;
      let leaveCount = updateLeaveCount(
        agentsCollection,
        agentId,
        vacationType,
        leaveHours,
        process.env.LEAVE_ACTION_CANCEL
      );
      let deleteReqDoc = agentReqColRef.doc(refNumber).delete();
      let deleteUsedDateDoc = agentUsedDateColRef.doc(refNumber).delete();
      let sendEmail = sendMail(
        agentId + "@google.com",
        process.env.SUBJECT_LEAVE_CANCELLED,
        agentId,
        process.env.LEAVE_REQUEST_CANCELLED_EMAIL_FIRST,
        process.env.LEAVE_REQUEST_CANCELLED_EMAIL_SECOND,
        refNumber
      );
      let response = await Promise.all([
        leaveCount,
        deleteReqDoc,
        deleteUsedDateDoc,
        sendEmail
      ]);
      console.log(response);
      res.status(200).json({ message: process.env.LEAVE_REQUEST_CANCELLED });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const checkConflictDates = async (docId, leaveDates) => {
  let usedDates = [];
  let counter = 0;
  try {
    const snapshot = await agentsCollection
      .doc(docId)
      .collection("used-dates")
      .get();
    snapshot.forEach(doc => {
      usedDates.push(doc.data().used);
    });
    leaveDates.forEach(leaveDateElement => {
      const leaveDate = moment(leaveDateElement, "MM-DD-YYYY");
      usedDates.forEach(usedDateElement => {
        const usedDate = moment(usedDateElement, "MMMM DD, YYYY");
        if (moment(usedDate).isSame(leaveDate)) {
          counter++;
        }
      });
    });
    if (counter > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: process.env.CHECK_DATES_ERROR });
  }
};

const updateSupervisor = async (sId, docId, requestObj, res) => {
  const reqId = requestObj.reqId;
  const supervisorReq = {
    refId: reqId,
    requester: docId,
    type: requestObj.type,
    daysCount: requestObj.days_count,
    reqDate: dateFormat(requestObj.reqDate, "mmmm dd, yyyy"),
    status: requestObj.status,
    leaveDates: requestObj.leaveDates,
    leaveHoursCount: requestObj.leave_hours_count
  };
  try {
    let supervisorRef = supervisorCollection.doc(sId);
    let getSupervisorDoc = await supervisorRef.get();
    if (!getSupervisorDoc.exists) {
      throw new Error(process.env.AGENT_ID_NOT_EXIST);
    } else {
      let setRequestObj = agentsCollection
        .doc(docId)
        .collection("requests")
        .doc(reqId)
        .set(requestObj);
      let setSupervisorObj = supervisorCollection
        .doc(sId)
        .collection("reqlist")
        .doc(reqId)
        .set(supervisorReq);
      let sendEmail = sendMail(
        sId + "@google.com",
        process.env.SUBJECT_LEAVE_REQUEST,
        sId,
        process.env.LEAVE_REQUEST_SUBMITTED_SUPERVISOR_FIRST,
        process.env.LEAVE_REQUEST_SUBMITTED_SUPERVISOR_SECOND,
        reqId
      );
      const result = await Promise.all([
        setRequestObj,
        setSupervisorObj,
        sendEmail
      ]);
      console.log("Promise: ", result);
      res.status(200).json({
        message: process.env.LEAVE_REQUEST_SUBMITTED
      });
    }
  } catch (error) {
    console.log(err);
    return res.status(500).json({ message: process.env.SERVER_ERROR });
  }
};
