import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  NgbDateStruct,
  NgbCalendar,
  NgbDate
} from '@ng-bootstrap/ng-bootstrap';

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one &&
  two &&
  two.year === one.year &&
  two.month === one.month &&
  two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two
    ? false
    : one.year === two.year
    ? one.month === two.month
      ? one.day === two.day
        ? false
        : one.day < two.day
      : one.month < two.month
    : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two
    ? false
    : one.year === two.year
    ? one.month === two.month
      ? one.day === two.day
        ? false
        : one.day > two.day
      : one.month > two.month
    : one.year > two.year;

@Component({
  selector: 'app-multi-date-picker',
  templateUrl: 'multi-date-picker.html',
  styles: [
    `
      .custom-day {
        text-align: center;
        padding: 0.185rem 0.25rem;
        display: inline-block;
        height: 2rem;
        width: 2rem;
        background-color: #fff;
      }
      .custom-day.range,
      .custom-day:hover {
        background-color: rgb(2, 117, 216);
        color: white;
      }
      .custom-day.faded {
        background-color: rgba(2, 117, 216, 0.5);
      }
      .custom-day.selected {
        background-color: #007bff;
        color: #fff;
        border-radius: 1rem;
      }
      .weekend {
        background-color: #f0ad4e;
        border-radius: 1rem;
        color: white;
      }
    `
  ]
})
export class MultiDatePickerComponent {
  hoveredDate: NgbDateStruct;
  today = this.calendar.getToday();
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  _datesSelected: NgbDateStruct[] = [];

  @Input()
  set datesSelected(value: NgbDateStruct[]) {
    this._datesSelected = value;
  }
  get datesSelected(): NgbDateStruct[] {
    return this._datesSelected ? this._datesSelected : [];
  }

  @Output() datesSelectedChange = new EventEmitter<NgbDateStruct[]>();

  constructor(private calendar: NgbCalendar) {}

  onDateSelection(event: any, date: NgbDateStruct) {
    event.target.parentElement.blur(); // make that not appear the outline
    if (!this.fromDate && !this.toDate) {
      if (event.ctrlKey === true) {
        // If is CrtlKey pressed
        this.fromDate = date;
      } else {
        this.addDate(date);
      }
      this.datesSelectedChange.emit(this.datesSelected);
    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
      this.toDate = date;
      this.addRangeDate(this.fromDate, this.toDate);
      this.fromDate = null;
      this.toDate = null;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  addDate(date: NgbDateStruct) {
    const index = this.datesSelected.findIndex(
      f => f.day === date.day && f.month === date.month && f.year === date.year
    );
    if (index >= 0) {
      // If exist, remove the date
      this.datesSelected.splice(index, 1);
      // a simple push
    } else {
      this.datesSelected.push(date);
    }
  }

  addRangeDate(fromDate: NgbDateStruct, toDate: NgbDateStruct) {
    // We get the getTime() of the dates from and to
    const from = new Date(
      fromDate.year + '-' + fromDate.month + '-' + fromDate.day
    ).getTime();
    const to = new Date(
      toDate.year + '-' + toDate.month + '-' + toDate.day
    ).getTime();
    for (
      let time = from;
      time <= to;
      time += 24 * 60 * 60 * 1000 // add one day
    ) {
      const date = new Date(time);
      // javascript getMonth give 0 to January, 1, to February...
      this.addDate({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      });
    }
    this.datesSelectedChange.emit(this.datesSelected);
  }
  // return true if is selected
  isDateSelected(date: NgbDateStruct) {
    return (
      this.datesSelected.findIndex(
        f =>
          f.day === date.day && f.month === date.month && f.year === date.year
      ) >= 0
    );
  }

  isHovered = date =>
    this.fromDate &&
    !this.toDate &&
    this.hoveredDate &&
    after(date, this.fromDate) &&
    before(date, this.hoveredDate)
  isInside = date => after(date, this.fromDate) && before(date, this.toDate);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);

  isWeekend = (date: NgbDate) => this.calendar.getWeekday(date) >= 6;
}
