import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../auth/auth.service';
import { RequestService } from '../requests.service';
import { AlertService } from '../../_services/alert.service';

@Component({
  selector: 'app-leave-request',
  templateUrl: 'leave-request.component.html',
  styleUrls: ['leave-request.component.css']
})
export class LeaveRequestComponent implements OnInit {
  leaveRequestForm: FormGroup;
  savedForm = false;
  typeOfLeaves: any = [];
  statusOfCalendar = false;
  showCalendar = false;
  isLoading = false;
  isHalfDay = false;
  datesSelected: NgbDateStruct[] = [];

  constructor(
    public requestService: RequestService,
    private fb: FormBuilder,
    public authService: AuthService,
    private alertService: AlertService
  ) {}

  // convenience getter for easy access to form fields
  get f() {
    // console.log(this.leaveRequestForm.controls);
    return this.leaveRequestForm.controls;
  }

  ngOnInit() {
    this.getLeavesType();
    this.leaveRequestForm = this.fb.group({
      leaveTitle: ['', Validators.required],
      empName: [this.authService.name, Validators.required],
      empEmail: [this.authService.email, Validators.required],
      leaveDate: ['', Validators.required],
      leaveType: ['', Validators.required],
      leaveHours: ['', Validators.required],
      remarks: ['', Validators.required]
    });
  }

  change(value: NgbDateStruct[]) {
    const finalSelectedDates = [];
    this.datesSelected = value;
    this.datesSelected.forEach(element => {
      const dateSel =
        element['month'] + '-' + element['day'] + '-' + element['year'];
      finalSelectedDates.push(dateSel);
    });
    this.leaveRequestForm.patchValue({ leaveDate: finalSelectedDates });
  }

  getLeavesType() {
    this.requestService.getLeaveTypes().subscribe(data => {
      this.typeOfLeaves = data['leave_type'];
    });
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.leaveRequestForm.invalid) {
      return;
    }
    this.isLoading = true;
    // console.log(this.leaveRequestForm.value);
    this.requestService
      .submitLeaveRequest(this.leaveRequestForm.value)
      .pipe(first())
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

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
    if (this.showCalendar) {
      this.statusOfCalendar = true;
    } else {
      this.statusOfCalendar = false;
    }
  }

  onReset() {
    this.leaveRequestForm.reset({
      empName: this.authService.name,
      empEmail: this.authService.email
    });
  }

  // onSelect(dateArr: any = []) {
  //   this.leaveRequestForm.patchValue({ leaveDate: dateArr });
  // }

  onChangeRequest(selectedRequest: string) {
    if (selectedRequest === 'Half Day Leave') {
      this.isHalfDay = true;
    } else {
      this.isHalfDay = false;
      const leaveRequestInHours = this.f.leaveDate.value.length * 9;
      this.f.leaveHours.setValue(leaveRequestInHours);
    }
  }
}
