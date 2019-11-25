const dateUtil = require("./dateutil");
const blockDates = async (collection, docId, reqId, leaveDates, leaveType) => {
  try {
    let usedDatesColRef = collection.doc(docId).collection("used-dates");
    let usedDateArr = [];
    let blockDatesObj = {};
    blockDatesObj.type = leaveType;
    blockDatesObj.used = usedDateArr;
    if (leaveType === process.env.HALF_DAY_LEAVE) {
      blockDatesObj.type = "hfd";
    } else if (leaveType === process.env.SICK_LEAVE) {
      blockDatesObj.type = "sl";
    } else {
      blockDatesObj.type = "vl";
    }
    for (let i = 0; i < leaveDates.length; i++) {
      let d = new Date(leaveDates[i]);
      let dd =
        months_arr[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
      usedDateArr.push(dd);
    }
    console.log(blockDatesObj);
    return usedDatesColRef.doc(reqId).set(blockDatesObj);
  } catch (err) {
    console.log(err);
    throw new Error(process.env.BLOCK_LEAVE_DATES_ERROR);
  }
};

module.exports = blockDates;
