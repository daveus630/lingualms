import { Component, OnInit, AfterContentChecked } from '@angular/core';

import { WebService } from '../_services/web.service';
import { ProjectService } from '../admin/projects/project.service';

import { Agent } from '../_models/employee-calendar';
import { EmployeeLeaveData } from './employee-leave.model';

import * as _ from 'lodash';

@Component({
  selector: 'app-my-teams',
  templateUrl: 'my-team.component.html',
  styleUrls: ['my-team.component.css']
})
export class MyTeamComponent implements OnInit {
  constructor(
    private webService: WebService,
    public projectService: ProjectService
  ) {}
  isLoadingResults = true;
  monthArr = [
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
  yearsArr = ['2019', '2020', '2021'];

  currentMonth = this.monthArr[new Date().getMonth()];
  currentYear = new Date().getFullYear();
  displayDate = this.currentMonth + ' 1, ' + this.currentYear;
  agentLeaveData = new Agent('', '', this.displayDate, [], {});
  actualData = this.agentLeaveData.getCalendar();
  noOfDays = this.agentLeaveData.daysInMonth(
    new Date(this.agentLeaveData.date).getMonth() + 1,
    new Date(this.agentLeaveData.date).getFullYear()
  );
  employeeLeaveData: EmployeeLeaveData[] = [];
  projectLists: any[] = [];
  holidays: any = [];
  wCount: any[] = [];
  ngOnInit() {
    this.projectService.getProjects().subscribe(data => {
      const projectData = data['projects'];
      this.projectLists = _.uniqBy(projectData, 'name');
    });

    this.webService
      .getAllAgentsLeaveData()
      .subscribe((data: EmployeeLeaveData[]) => {
        this.employeeLeaveData = data['used_dates'];
        this.isLoadingResults = false;
      });

    this.webService
      .getAllHolidays(this.currentYear.toString())
      .subscribe((data: any) => {
        this.holidays = data['Holidays'];
      });
  }

  onSelect(value: any) {
    this.displayDate = this.currentMonth + ' 1, ' + this.currentYear;
    this.agentLeaveData = new Agent('', '', this.displayDate, [], {});
    this.actualData = this.agentLeaveData.getCalendar();
    this.noOfDays = this.agentLeaveData.daysInMonth(
      new Date(this.agentLeaveData.date).getMonth() + 1,
      new Date(this.agentLeaveData.date).getFullYear()
    );
    this.getEmpData(name);
  }

  getEmpData(projectName: string) {
    const leaveData = [];
    const tempEmpLeaveData = _.filter(this.employeeLeaveData, [
      'project',
      projectName
    ]);
    for (let i = 0; i < tempEmpLeaveData.length; i++) {
      const leaveObj = new Agent(
        tempEmpLeaveData[i].name,
        tempEmpLeaveData[i].id,
        this.displayDate,
        tempEmpLeaveData[i].leaveInfo,
        this.holidays
      );
      leaveData.push(leaveObj);
    }
    return leaveData.sort((a, b) => (a.name > b.name ? 1 : -1));
  }

  dayBgColor(dw) {
    let backgroundColor: string;
    let fontColor: string;
    if (dw === 'Sa' || dw === 'Su') {
      backgroundColor = '#343a40';
      fontColor = '#ffffff';
    } else {
      backgroundColor = '#d1d1d1';
      fontColor = '#000000';
    }
    return {
      'background-color': backgroundColor,
      color: fontColor,
      'text-align': 'center'
    };
  }

  getBgColor(dw, dd) {
    let backgroundColor: string;
    let fontColor: string;

    if (dw === 'Sa' || dw === 'Su') {
      backgroundColor = '#343a40';
      fontColor = '#343a40';
    } else if (dd === 'O') {
      backgroundColor = '#fd7e14';
      fontColor = '#fff';
    } else if (dd === 'SL') {
      backgroundColor = 'rgba(123, 18, 18, 0.6)';
      fontColor = '#fff';
    } else if (dd === 'H') {
      backgroundColor = '#dc3545';
      fontColor = '#fff';
    } else if (dd === 'HFD') {
      backgroundColor = '#e83e8c';
      fontColor = '#fff';
    } else {
      backgroundColor = '#cfe2f3';
      fontColor = '#000';
    }
    return {
      'background-color': backgroundColor,
      color: fontColor,
      'text-align': 'center'
    };
  }
}
