global.months_arr = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

module.exports = {
  countLeaveDays: (start, end) => {
    let days = 0;
    let s = new Date(start);
    let e = new Date(end);
    if (s.getMonth() === e.getMonth() && s.getDay() === e.getDay()) {
      days = 1;
    } else {
      let diff = Math.abs(e.getTime() - s.getTime());
      days = Math.ceil(diff / (1000 * 3600 * 24)) + 1;
    }
    return days;
  },
  dayOfWeekIs: d => {
    let daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    return daysOfWeek[d.getDay()];
  },
  convertUnixTime: uTime => {
    let date = new Date(uTime * 1000);
    let year = date.getFullYear();
    let month = months_arr[date.getMonth()];
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();
    let convdataTime =
      month +
      " " +
      day +
      ", " +
      year +
      " " +
      hours +
      ":" +
      minutes.substr(-2) +
      ":" +
      seconds.substr(-2);
    return convdataTime;
  }
};
