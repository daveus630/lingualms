const updateLeaveCount = async (
  collection,
  docId,
  leaveType,
  leaveHours,
  action
) => {
  let prevCount = 0;
  let availableLeaveCount = 0;
  try {
    let snapshot = await collection.doc(docId).get();
    let leaveAvail = snapshot.data().leave_available;
    if (action === process.env.LEAVE_ACTION_CANCEL) {
      prevCount = leaveAvail.vl;
      console.log(prevCount, "prevCount");
      availableLeaveCount = prevCount + leaveHours;
      console.log(availableLeaveCount, "availableLeaveCount");
      return collection.doc(docId).update({
        "leave_available.vl": availableLeaveCount
      });
    } else {
      if (leaveType === process.env.SICK_LEAVE) {
        prevCount = leaveAvail.sl;
        console.log(prevCount, "prevCount");
        availableLeaveCount = prevCount - leaveHours;
        console.log(availableLeaveCount, "availableLeaveCount");
        if (availableLeaveCount < 0) {
          availableLeaveCount = 0;
        }
        return collection.doc(docId).update({
          "leave_available.sl": availableLeaveCount
        });
      } else {
        prevCount = leaveAvail.vl;
        console.log(prevCount, "prevCount");
        availableLeaveCount = prevCount - leaveHours;
        console.log(availableLeaveCount, "availableLeaveCount");
        if (availableLeaveCount < 0) {
          availableLeaveCount = 0;
        }
        return collection.doc(docId).update({
          "leave_available.vl": availableLeaveCount
        });
      }
    }
  } catch (err) {
    console.log(err);
    throw new Error(process.env.LEAVE_COUNT_UPDATE_ERROR);
  }
};

module.exports = updateLeaveCount;
