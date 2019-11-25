import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { RequestService } from '../requests.service';

@Component({
  selector: 'app-requests',
  templateUrl: 'request.component.html',
  styleUrls: ['request.component.css']
})
export class RequestComponent implements OnInit {
  requestForm: FormGroup;
  requestTypes = ['Shift Change', 'Leave Request'];
  leaveRequest = false;
  shiftRequest = false;

  constructor(private fb: FormBuilder, public requestService: RequestService) { }

  ngOnInit() {
    this.requestForm = this.fb.group({
      requestType: 'selectRequest'
    });
  }

  onChangeRequest(selectedRequest: string) {
    if (selectedRequest === 'Leave Request') {
      this.leaveRequest = true;
    } else {
      this.leaveRequest = false;
    }
    if (selectedRequest === 'Shift Change') {
      this.shiftRequest = true;
    } else {
      this.shiftRequest = false;
    }
  }
}
