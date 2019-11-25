export class Agent {
  constructor(
    private name: string,
    private id: string,
    public date: string,
    private udate: any,
    private holidays: any
  ) {
    this.name = name;
    this.id = id;
    this.date = date;
    this.udate = udate;
    this.holidays = holidays;
  }

  monthArr() {
    const months_arr = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    return months_arr;
  }

  getWeekDay(d: number) {
    const dd = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return dd[d];
  }

  daysInMonth(mm: number, yy: number) {
    return new Date(yy, mm, 0).getDate();
  }

  getCalendar() {
    const calendar = [];
    const nDays = this.daysInMonth(
      new Date(this.date).getMonth() + 1,
      new Date(this.date).getFullYear()
    );
    const usedLeaveArr = [];
    const leaveObj = this.udate;
    // console.log(leaveObj);
    const hol = this.holidays;

    for (let i = 0; i < leaveObj.length; i++) {
      usedLeaveArr.push(leaveObj[i]);
    }
    // console.log(usedLeaveArr);
    for (let x = 1; x <= nDays; x++) {
      const calObj: any = {};
      calObj.isWeekEnd = false;
      this.name ? (calObj.dd = 'w') : (calObj.dd = x);
      const monthDate =
        this.monthArr()[new Date(this.date).getMonth()] +
        ' ' +
        x +
        ', ' +
        new Date(this.date).getFullYear();

      calObj.dateValue = monthDate;
      calObj.daysOfWeek = this.getWeekDay(new Date(monthDate).getDay());

      for (let h = 0; h < hol.length; h++) {
        if (hol[h].date === monthDate) {
          calObj.isHoliday = true;
        }
      }

      for (let i = 0; i < usedLeaveArr.length; i++) {
        // console.log(usedLeaveArr[i].used);
        usedLeaveArr[i].used.forEach((element: string) => {
          // console.log(element);
          if (monthDate === element) {
            // console.log('inside final');
            if (usedLeaveArr[i].type === 'vl') {
              calObj.dd = 'O';
            } else if (usedLeaveArr[i].type === 'hfd') {
              calObj.dd = 'HFD';
            } else {
              calObj.dd = 'SL';
            }
          }
        });
      }

      if (calObj.daysOfWeek === 'Sa' || calObj.daysOfWeek === 'Su') {
        calObj.isWeekEnd = true;
        if (this.name) {
          calObj.dd = '0';
        }
      }

      if (calObj.isHoliday && !calObj.isWeekEnd) {
        calObj.dd = 'H';
      }
      calendar.push(calObj);
    }
    return calendar;
  }
}
