import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from 'src/app/auth/auth.service';
import { RequestService } from '../requests.service';
import { AlertService } from '../../_services/alert.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-shift-change-request',
  templateUrl: 'shift-change.component.html',
  styleUrls: ['shift-change.component.css']
})
export class ShiftChangeComponent implements OnInit {
  shiftRequestForm: FormGroup;
  savedForm = false;
  today = this.calendar.getToday();
  displayMonths = '2';
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  isLoading = false;

  constructor(
    private calendar: NgbCalendar,
    public requestService: RequestService,
    private fb: FormBuilder,
    public authService: AuthService,
    public alertService: AlertService
  ) { }

  // convenience getter for easy access to form fields
  get f() {
    return this.shiftRequestForm.controls;
  }

  ngOnInit() {
    this.shiftRequestForm = this.fb.group({
      empName: [this.authService.name, Validators.required],
      empEmail: [this.authService.email, Validators.required],
      shiftStartDate: ['', Validators.required],
      shiftEndDate: ['', Validators.required],
      remarks: ['', Validators.required]
    });
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.shiftRequestForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.requestService.submitShiftChangeRequest(this.shiftRequestForm.value).pipe(first())
      .subscribe(
        data => {
          this.isLoading = false;
          this.alertService.success(data['message'], true);
        },
        error => {
          this.isLoading = false;
          if (error.status === 404) {
            this.alertService.error('Requested API not found');
          } else {
            this.alertService.error(error.error['message']);
          }
        }
      );
    this.onReset();
  }

  onReset() {
    this.shiftRequestForm.reset({
      empName: this.authService.name,
      empEmail: this.authService.email
    });
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }
}
