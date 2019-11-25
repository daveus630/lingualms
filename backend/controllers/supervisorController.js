const db = require("../database/firestore");
const supervisorCollectionRef = db.collection("supervisor");
const agentsCollection = db.collection("agents");

const sendMail = require("../routes/email");
const dateFormat = require("dateformat");
const updateLeaveCount = require("../utils/helper");
const blockDates = require("../utils/blockDate");

exports.getAllSupervisor = async (req, res, next) => {
  let supervisorLists = [];
  try {
    let snapshot = await supervisorCollectionRef.orderBy("name").get();
    for (const supervisor of snapshot.docs) {
      supervisorLists.push(supervisor.data());
    }
    res.status(200).json({
      message: supervisorLists.length + " " + process.env.RECORD_FOUND,
      supervisors: supervisorLists
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: process.env.SERVER_ERROR });
  }
};

exports.getSupervisorRequestById = (req, res, next) => {
  const sId = req.params.id;
  const reqList = [];
  if (!sId) {
    return res.status(500).json({ message: process.env.PARAMS_MISSING });
  }
  supervisorCollectionRef
    .doc(sId)
    .collection("reqlist")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        reqList.push(doc.data());
      });
      res.status(200).json({
        message: reqList.length + " " + process.env.RECORD_FOUND,
        reqList: reqList
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: process.env.SERVER_ERROR });
    });
};

exports.addSupervisor = (req, res, next) => {
  if (req.body.name === null || req.body.ldap === null) {
    return res.status(500).json({ message: process.env.PARAMS_MISSING });
  }
  const docId = req.body.ldap;
  let supervisorObj = {
    ldap: docId,
    name: req.body.name
  };
  supervisorCollectionRef
    .doc(docId)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(200).json({
          message: process.env.AGENT_ID_EXIST
        });
      }
      supervisorCollectionRef.doc(String(docId)).set(supervisorObj);
      res.status(200).json({
        message: process.env.AGENT_ADD
      });
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({ message: process.env.SERVER_ERROR });
    });
};

exports.deleteSupervisor = async (req, res, next) => {
  const supervisorId = req.params.id;
  try {
    let deleteSupervisorDoc = await supervisorCollectionRef
      .doc(supervisorId)
      .delete();
    console.log("Result:", deleteSupervisorDoc);
    res.status(200).json({
      message: process.env.AGENT_DATA_DELETE
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: process.env.SERVER_ERROR });
  }
};

exports.acknowledgeRequest = (req, res, next) => {
  const docId = req.query.agent;
  const refId = req.query.ref;
  const action = req.query.action;
  const sId = req.query.supervisor;
  if (!(docId || refId || action)) {
    return res.status(500).json({ message: process.env.PARAMS_MISSING });
  }
  if (action === "approved") {
    approve(docId, sId, refId, res);
  } else {
    reject(docId, sId, refId, res);
  }
};

const approve = async (id, sId, reqId, res) => {
  try {
    let agentReqColRef = agentsCollection.doc(id).collection("requests");
    let reqDoc = await agentReqColRef.doc(reqId).get();
    console.log(reqDoc);
    if (!reqDoc.exists) {
      throw new Error(process.env.NO_RECORD_FOUND);
    } else {
      if (reqDoc.data().status === process.env.LEAVE_STATUS_APPROVED) {
        throw new Error(process.env.LEAVE_REQUEST_ALREADY_APPROVED);
      }
      const vacationType = reqDoc.data().type;
      const leaveDates = reqDoc.data().leaveDates;
      const leaveHours = reqDoc.data().leave_hours_count;
      let leaveCount = updateLeaveCount(
        agentsCollection,
        id,
        vacationType,
        leaveHours,
        process.env.LEAVE_ACTION_APPLY
      );
      let blockDate = blockDates(
        agentsCollection,
        id,
        reqId,
        leaveDates,
        vacationType
      );
      let updateRequestDoc = agentReqColRef.doc(reqId).update({
        status: process.env.LEAVE_STATUS_APPROVED,
        approved_by: sId,
        actioned_on: dateFormat(new Date(), "mmmm dd, yyyy")
      });
      let deleteSupReqObj = supervisorCollectionRef
        .doc(sId)
        .collection("reqlist")
        .doc(reqId)
        .delete();
      let sendEmail = sendMail(
        id + "@google.com",
        process.env.SUBJECT_LEAVE_APPROVED,
        id,
        process.env.LEAVE_REQUEST_APPROVED_EMAIL_FIRST,
        process.env.LEAVE_REQUEST_APPROVED_EMAIL_SECOND,
        reqId
      );
      let response = await Promise.all([
        leaveCount,
        blockDate,
        updateRequestDoc,
        deleteSupReqObj,
        sendEmail
      ]);
      console.log(response);
      res.status(200).json({
        message: process.env.SUBJECT_LEAVE_APPROVED
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const reject = async (id, sId, reqId, res) => {
  try {
    let agentReqColRef = agentsCollection.doc(id).collection("requests");
    let reqDoc = await agentReqColRef.doc(reqId).get();
    console.log(reqDoc);
    if (!reqDoc.exists) {
      throw new Error(process.env.NO_RECORD_FOUND);
    } else {
      if (reqDoc.data().status === process.env.LEAVE_STATUS_REJECTED) {
        throw new Error(process.env.LEAVE_REQUEST_ALREADY_REJECTED);
      }
      let updateRequestDoc = agentReqColRef.doc(reqId).update({
        status: process.env.LEAVE_STATUS_REJECTED,
        approved_by: sId,
        actioned_on: dateFormat(new Date(), "mmmm dd, yyyy")
      });
      let deleteSupReqObj = supervisorCollectionRef
        .doc(sId)
        .collection("reqlist")
        .doc(reqId)
        .delete();
      let sendEmail = sendMail(
        id + "@google.com",
        process.env.SUBJECT_LEAVE_REJECTED,
        id,
        process.env.LEAVE_REQUEST_REJECTED_EMAIL_FIRST,
        process.env.LEAVE_REQUEST_REJECTED_EMAIL_SECOND,
        reqId
      );
      let response = await Promise.all([
        updateRequestDoc,
        deleteSupReqObj,
        sendEmail
      ]);
      console.log(response);
      res.status(200).json({
        message: process.env.SUBJECT_LEAVE_REJECTED
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};
