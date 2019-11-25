import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { MatTableDataSource, MatPaginator } from '@angular/material';

import { SupervisorService } from './supervisor.service';
import { AlertService } from '../../_services/alert.service';
import { UpdateListenerService } from '../../_services/update-listener.service';

import { Supervisor } from './supervisor';

declare var $: any;

@Component({
  templateUrl: 'supervisor.component.html',
  styleUrls: ['supervisor.component.css']
})
export class SupervisorComponent implements OnInit {
  addSupervisorForm: FormGroup;
  displayedColumns: string[] = ['supervisorName', 'supervisorLDAP', 'action'];
  dataSource = new MatTableDataSource();
  supervisorLists: Supervisor[] = [];
  rowDetail: any = [];
  savedForm = false;
  isLoadingResults = false;
  isLoadingDelete = false;
  isLoadingAdd = false;
  isNoData = true;
  currentIndex = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private fb: FormBuilder,
    public supervisorService: SupervisorService,
    private alertService: AlertService,
    public updateListenerService: UpdateListenerService
  ) {}

  // convenience getter for easy access to form fields
  get f() {
    return this.addSupervisorForm.controls;
  }

  ngOnInit() {
    this.isLoadingResults = true;
    this.addSupervisorForm = this.fb.group({
      name: ['', Validators.required],
      ldap: ['', Validators.required]
    });
    this.getSupervisorList();
  }

  getSupervisorList() {
    this.supervisorService.getSupervisors().subscribe(data => {
      this.supervisorLists = data['supervisors'];
      this.dataSource = new MatTableDataSource(this.supervisorLists);
      setTimeout(() => (this.dataSource.paginator = this.paginator));
      if (this.dataSource.data.length > 0) {
        this.isNoData = false;
      }
      this.isLoadingResults = false;
    });
  }

  deleteSupervisorDetails() {
    let supervisorId: string;
    if (this.rowDetail) {
      supervisorId = this.rowDetail.ldap;
    }
    this.isLoadingDelete = true;
    this.supervisorService.deleteSupervisor(supervisorId).subscribe(
      data => {
        this.deleteRowDataTable(this.dataSource);
        this.isLoadingDelete = false;
        this.alertService.success(data['message'], true);
      },
      error => {
        this.isLoadingDelete = false;
        if (error.status === 404) {
          this.alertService.error('Requested API not found');
        } else {
          this.alertService.error(error.error['message']);
        }
      }
    );
  }

  addSupervisor() {
    // stop here if form is invalid
    if (this.addSupervisorForm.invalid) {
      return;
    }
    this.isLoadingAdd = true;
    const supervisorObj = this.addSupervisorForm.value;
    this.supervisorService
      .addSupervisor(this.addSupervisorForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.isLoadingAdd = false;
          this.alertService.success(data['message'], true);
          this.updateListenerService.addUpdateListener(
            supervisorObj,
            this.dataSource
          );
        },
        error => {
          this.isLoadingAdd = false;
          if (error.status === 404) {
            this.alertService.error('API not found');
          } else {
            this.alertService.error(error.error['message']);
          }
        }
      );
    this.reset();
    $('#addSupervisorModal').modal('hide');
  }

  reset() {
    this.addSupervisorForm.reset({
      name: '',
      ldap: ''
    });
  }

  getRecord(value: Supervisor, index: number) {
    this.currentIndex = index;
    this.rowDetail = value;
    return this.rowDetail;
  }

  deleteRowDataTable(dataSource) {
    console.log('deleteRow', this.currentIndex);
    dataSource.data.splice(this.currentIndex, 1);
    dataSource._updateChangeSubscription();
    if (dataSource.data.length <= 0) {
      this.isNoData = true;
    }
  }
}
