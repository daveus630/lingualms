const db = require("../database/firestore");
const projectCollectionRef = db.collection("project");

exports.getAllProjects = async (req, res, next) => {
  let projectLists = [];
  try {
    let snapshot = await projectCollectionRef.orderBy("name").get();
    for (const project of snapshot.docs) {
      projectLists.push(project.data());
    }
    res.status(200).json({
      message: projectLists.length + " " + process.env.RECORD_FOUND,
      projects: projectLists
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: process.env.SERVER_ERROR });
  }
};

exports.addProject = (req, res, next) => {
  if (req.body.name === null || req.body.team === null) {
    return res.status(500).json({ message: process.env.PARAMS_MISSING });
  }
  const docId = req.body.name.toLowerCase() + "_" + req.body.team.toLowerCase();
  let projectObj = {
    name: req.body.name,
    team: req.body.team
  };
  projectCollectionRef
    .doc(docId)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(500).json({
          message: process.env.PROJECT_NAME_EXIST
        });
      }
      projectCollectionRef.doc(String(docId)).set(projectObj);
      res.status(200).json({
        message: process.env.PROJECT_ADD
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: process.env.SERVER_ERROR });
    });
};

exports.deleteProject = (req, res, next) => {
  const docId =
    req.query.project.toLowerCase() + "_" + req.query.team.toLowerCase();
  console.log(docId);
  projectCollectionRef
    .doc(docId)
    .delete()
    .then(() => {
      res.status(200).json({
        message: process.env.PROJECT_DATA_DELETE
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: process.env.SERVER_ERROR });
    });
};
