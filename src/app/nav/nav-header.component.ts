import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { WebService } from '../_services/web.service';
import { AuthService } from '../auth/auth.service';

declare var $: any;

@Component({
  selector: 'app-header-content',
  templateUrl: 'nav-header.component.html',
  styleUrls: ['nav-header.component.css']
})
export class NavHeaderComponent implements OnInit, AfterViewInit {
  private isRole: string;
  private agentId: string;
  private profileData: any = [];
  private utilLink =
    'https://script.google.com/a/google.com/macros/s/AKfycbyoDMFcoKkIGgLuLBvelDXLyZ7JmUgQpdsuxWgJkq0MPjH-sKhQ/exec?pli=1';

  constructor(
    public authService: AuthService,
    public webService: WebService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.agentId = this.authService.email
      ? this.authService.email.split('@')[0]
      : null;
    this.authService.getAgentRole(this.agentId).subscribe(data => {
      this.profileData = data['userData'];
      this.isRole = this.profileData['role'];
    });
  }
  ngAfterViewInit() {
    // You can access the DOM in ngAfterViewInit using nativeElement
    // In below case it find all elements with attribute data-toggle=tooltip and initializes a tooltip
    $(this.elementRef.nativeElement)
      .find('[data-toggle="tooltip"]')
      .tooltip();
  }
  get isRoleAdmin() {
    if (this.isRole === 'Admin') {
      return true;
    }
  }

  onUtilLink() {
    window.open(this.utilLink, '_blank');
  }
}
