import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import * as moment from 'moment';
import * as _ from 'lodash';

export interface CalendarDate {
  mDate: moment.Moment;
  today?: boolean;
  selected?: boolean;
}
@Component({
  selector: 'app-calendar',
  templateUrl: 'calendar.component.html',
  styleUrls: ['calendar.component.css']
})

export class CalendarComponent implements OnInit {
  dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  currentDate = moment();
  weeks: CalendarDate[][] = [];
  dateArr = [];
  selectedDates: CalendarDate[] = [];

  @Output() selectedDateArray = new EventEmitter<any[]>();

  constructor() {}

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar(): void {
    const dates = this.fillDates(this.currentDate);
    const weeks: CalendarDate[][] = [];
    while (dates.length > 0) {
      weeks.push(dates.splice(0, 7));
    }
    this.weeks = weeks;
  }

  fillDates(currentMoment: moment.Moment): CalendarDate[] {
    const firstOfMonth = moment(currentMoment)
      .startOf('month')
      .day();
    const firstDayOfGrid = moment(currentMoment)
      .startOf('month')
      .subtract(firstOfMonth, 'days');
    const start = firstDayOfGrid.date();
    return _.range(start, start + 42).map(
      (date: number): CalendarDate => {
        const d = moment(firstDayOfGrid).date(date);
        return {
          today: this.isToday(d),
          selected: this.isSelected(d),
          mDate: d
        };
      }
    );
  }

  selectDate(date: CalendarDate): void {
    date.selected = !date.selected;
    // To find the index of selected date
    const index = _.findIndex(this.selectedDates, selectedDate => {
      return moment(date.mDate).isSame(selectedDate.mDate, 'day');
    });
    // To format the selected date in string format
    const dateInString = date.mDate.format('MM-DD-YYYY').toString();

    if (date.selected === false) {
      this.dateArr.splice(this.dateArr.indexOf(dateInString), 1);
      this.selectedDates.splice(index, 1);
      this.selectedDateArray.emit(this.dateArr);
      console.log(this.dateArr);
    }

    if (date.selected === true) {
      this.dateArr.push(dateInString);
      this.selectedDates.push(date);
      this.selectedDateArray.emit(this.dateArr);
      console.log(this.dateArr);
    }
  }

  // Date Checker functions
  isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  isSelectedMonth(date: moment.Moment): boolean {
    return moment(date).isSame(this.currentDate, 'month');
  }

  isSelected(date: moment.Moment): boolean {
    return (
      _.findIndex(this.selectedDates, selectedDate => {
        return moment(date).isSame(selectedDate.mDate, 'day');
      }) > -1
    );
  }

  // actions from calendar
  prevMonth(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'months');
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = moment(this.currentDate).add(1, 'months');
    this.generateCalendar();
  }

  firstMonth(): void {
    this.currentDate = moment(this.currentDate).startOf('year');
    this.generateCalendar();
  }

  lastMonth(): void {
    this.currentDate = moment(this.currentDate).endOf('year');
    this.generateCalendar();
  }

  prevYear(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'year');
    this.generateCalendar();
  }

  nextYear(): void {
    this.currentDate = moment(this.currentDate).add(1, 'year');
    this.generateCalendar();
  }
}
