import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { SupervisorService } from '../../supervisors/supervisor.service';
import { ProjectService } from '../../projects/project.service';
import { EmployeeService } from '../employee.service';
import { AlertService } from '../../../_services/alert.service';

import { Project } from '../../projects/project';
import { Supervisor } from '../../supervisors/supervisor';

import * as _ from 'lodash';

declare var $: any;

@Component({
  selector: 'app-add-employee',
  templateUrl: 'add-employee.component.html',
  styleUrls: ['add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  addEmployeeForm: FormGroup;
  savedForm = false;
  roles = ['User', 'Admin'];
  shiftSchedules = ['APAC', 'EMEA', 'MTV'];
  supervisors: Supervisor[];
  projectLists: Project[];
  teamLists: Project[];

  @Output() isLoading = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    public supervisorService: SupervisorService,
    public projectService: ProjectService,
    public employeeService: EmployeeService,
    public alertService: AlertService
  ) {}

  // convenience getter for easy access to form fields
  get f() {
    return this.addEmployeeForm.controls;
  }

  ngOnInit() {
    this.getProjects();
    this.getSupervisors();
    this.addEmployeeForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      role: ['User', Validators.required],
      project: ['selectProject', Validators.required],
      team: ['selectTeam', Validators.required],
      shift: ['selectShift', Validators.required],
      supervisor: ['selectOptions', Validators.required],
      allowedSl: [117, Validators.required],
      allowedVl: [135, Validators.required],
      availSl: ['', Validators.required],
      availVl: ['', Validators.required]
    });
  }

  getProjects() {
    this.projectService.getProjects().subscribe(data => {
      const projectData = data['projects'];
      const projectNameList = _.map(projectData, 'name');
      this.projectLists = _.uniqBy(projectNameList);
      this.teamLists = _.map(projectData, 'team');
    });
  }

  getSupervisors() {
    this.supervisorService.getSupervisors().subscribe(data => {
      this.supervisors = data['supervisors'];
    });
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.addEmployeeForm.invalid) {
      return;
    }
    this.isLoading.emit(true);
    this.employeeService
      .addEmployee(this.addEmployeeForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.isLoading.emit(false);
          this.alertService.success(data['message'], true);
        },
        error => {
          this.isLoading.emit(false);
          if (error.status === 404) {
            this.alertService.error('Requested API not found');
          } else {
            this.alertService.error(error.error['message']);
          }
        }
      );
    this.reset();
    $('#addEmployeeModal').modal('hide');
  }

  reset() {
    this.addEmployeeForm.reset({
      role: 'User',
      project: 'selectProject',
      team: 'selectTeam',
      shift: 'selectShift',
      supervisor: 'selectOptions',
      allowedSl: '117',
      allowedVl: '135'
    });
  }
}
