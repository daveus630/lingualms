const db = require("../database/firestore");
const agentsCollection = db.collection("agents");
const _ = require("lodash");
//this function serves all the agents
exports.getAllAgents = (req, res, next) => {
  let allAgents = [];
  agentsCollection
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        allAgents.push(doc.data());
      });
      res.status(200).json({
        message: allAgents.length + " " + process.env.RECORD_FOUND,
        data: allAgents
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: process.env.AGENT_DATA_FETCH_ERROR });
    });
};

// this function serves agent by Id
exports.getAgentById = (req, res, next) => {
  let agentId = req.params.id;
  agentsCollection
    .doc(agentId)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res
          .status(404)
          .json({ message: process.env.AGENT_ID_NOT_EXIST });
      }
      res.status(200).json({
        message: process.env.AGENT_ID_EXIST,
        userData: doc.data()
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: process.env.SERVER_ERROR });
    });
};

exports.getAgentUsedDates = (req, res, next) => {
  let usedDates = [];
  let docId = req.params.id;
  agentsCollection
    .doc(docId)
    .collection("used-dates")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        usedDates.push(doc.data());
      });
      usedDates.sort();
      res.status(200).json({
        message: usedDates.length + " " + process.env.RECORD_FOUND,
        used_dates: usedDates
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: process.env.SERVER_ERROR });
    });
};

exports.getAgentsCalendar = (req, res, next) => {
  let usedDatesArr = [];
  let agentCalendar = [];
  let leaveDataObj = {};
  agentsCollection
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        // console.log(doc.id, "doc");
        // Pushing all agent Id
        usedDatesArr.push(doc.id);
        agentsCollection
          .doc(doc.id)
          .collection("used-dates")
          .get()
          .then(usedDate => {
            // console.log(usedDate, "usedDate");
            leaveDataObj = {
              id: doc.id,
              name: doc.data().name,
              project: doc.data().project,
              team: doc.data().team,
              leaveInfo: []
            };
            usedDate.forEach(usedDay => {
              // console.log(usedDay.data(), "usedDay");
              // // let arr = _.values(usedDay.data());
              // let arr = _.keys(usedDay.data());
              // console.log("arr", arr);
              leaveDataObj.leaveInfo.push(usedDay.data());
            });
            // console.log(leaveDataObj);
            return leaveDataObj;
          })
          .then(data => {
            // console.log(data, "data");
            agentCalendar.push(data);
            // console.log(agentCalendar.length === usedDatesArr.length);
            if (agentCalendar.length === usedDatesArr.length) {
              console.log("inside true function");
              res.status(200).json({
                message: agentCalendar.length + " " + process.env.RECORD_FOUND,
                used_dates: agentCalendar
              });
            }
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({ message: process.env.SERVER_ERROR });
          });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: process.env.SERVER_ERROR });
    });
};

exports.addAgent = (req, res, next) => {
  let fname = req.body.fname;
  let email = req.body.email;
  if (
    fname === null ||
    email === null ||
    fname === undefined ||
    email === undefined
  ) {
    return res.status(500).json({ message: process.env.PARAMS_MISSING });
  }
  let docId = email.split("@")[0];
  let newAgent = {
    name: req.body.fname + " " + req.body.lname,
    email: req.body.email,
    phone: req.body.phone,
    role: req.body.role,
    project: req.body.project,
    team: req.body.team,
    supervisor: req.body.supervisor,
    shift: req.body.shift,
    leave_allowed: {
      sl: req.body.allowedSl,
      vl: req.body.allowedVl
    },
    leave_available: {
      sl: req.body.availSl,
      vl: req.body.availVl
    }
  };
  agentsCollection
    .doc(String(docId))
    .set(newAgent)
    .then(() => {
      res.status(200).json({ message: process.env.AGENT_ADD });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: process.env.SERVER_ERROR });
    });
};

exports.updateAgent = (req, res, next) => {
  let agentId = req.params.id;
  let phone = req.body.phone;
  let project = req.body.project;
  let role = req.body.role;
  let supervisor = req.body.supervisor;
  let team = req.body.team;
  let shift = req.body.shift;
  db.runTransaction(trans => {
    return trans.get(agentsCollection).then(doc => {
      if (!(phone && project && role && supervisor && team && shift)) {
        return Promise.reject(process.env.PARAMS_MISSING);
      }
      trans.update(agentsCollection.doc(agentId), {
        phone: phone,
        project: project,
        role: role,
        supervisor: supervisor,
        team: team,
        shift: shift
      });
    });
  })
    .then(() => {
      res.status(200).json({
        message: process.env.AGENT_DATA_UPDATE
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ message: process.env.SERVER_ERROR });
    });
};

exports.deleteAgent = (req, res, next) => {
  let agentId = req.params.id;
  agentsCollection
    .doc(agentId)
    .delete()
    .then(() => {
      res.status(200).json({
        message: process.env.AGENT_DATA_DELETE
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ message: process.env.SERVER_ERROR });
    });
};
