import { Component, OnInit } from '@angular/core';

import { WebService } from '../_services/web.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: 'my-profile.component.html',
  styleUrls: ['my-profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileData: any = [];
  leftVL: number;
  leftSL: number;
  totalVL: number;
  totalSL: number;
  leftVLpercent: number;
  leftSLpercent: number;
  agentId: string;
  isLoadingResults = false;

  constructor(public webService: WebService, public authService: AuthService) {}

  ngOnInit() {
    this.agentId = this.authService.email
      ? this.authService.email.split('@')[0]
      : null;
    this.isLoadingResults = true;
    this.webService.getAgentProfile(this.agentId).subscribe(data => {
      this.profileData = data['userData'];
      this.leftSL = this.profileData.leave_available['sl'];
      this.leftVL = this.profileData.leave_available['vl'];
      this.totalSL = this.profileData.leave_allowed['sl'];
      this.totalVL = this.profileData.leave_allowed['vl'];
      this.leftVLpercent = Math.round((this.leftVL / this.totalVL) * 100);
      this.leftSLpercent = Math.round((this.leftSL / this.totalSL) * 100);
      this.isLoadingResults = false;
    });
  }
}
