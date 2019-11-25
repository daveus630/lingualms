import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: 'employee.component.html',
  styleUrls: ['employee.component.css']
})
export class EmployeeComponent implements OnInit {
  loading = false;
  constructor() {}

  ngOnInit() {}

  getLoadingValue(isLoading: boolean) {
    this.loading = isLoading;
  }
}
