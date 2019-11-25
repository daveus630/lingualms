const db = require("../database/firestore");
const holidayCollection = db.collection("holidays");

exports.addHolidays = (req, res, next) => {
  let holidayName = req.body.name;
  let hub = req.body.hub;
  let date = req.body.date;
  let displayDate = dateFormat(date, "mmmm d, yyyy");
  let year = new Date(dDate).getFullYear();
  let hId = (+new Date(dDate) / 1000).toFixed(0);
  if (hub === null || date === null || holidayName === null) {
    return res.status(500).json({ message: process.env.PARAMS_MISSING });
  }
  let data = {
    date: displayDate,
    name: holidayName
  };
  holidayCollection
    .doc("h" + year)
    .collection(hub)
    .doc(hId)
    .set(data)
    .then(() => {
      res.status(200).json({
        message: process.env.HOLIDAY_ADD
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: process.env.SERVER_ERROR });
    });
};

exports.getAllHolidays = (req, res, next) => {
  let holidays = [];
  let hub = req.query.hub;
  let year = req.query.year;
  if (hub === null || year === null) {
    return res.status(500).json({ message: process.env.PARAMS_MISSING });
  }
  holidayCollection
    .doc("h" + year)
    .collection(hub)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        holidays.push(doc.data());
      });
      res.status(200).json({
        message: holidays.length + " " + process.env.RECORD_FOUND,
        Holidays: holidays
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: process.env.SERVER_ERROR });
    });
};
