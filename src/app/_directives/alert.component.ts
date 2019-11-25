import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: 'alert.component.html',
  styleUrls: ['alert.component.css']
})

export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  message: any;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.subscription = this.alertService.getMessage().subscribe(message => {
      this.message = message;
    });
    this.subscription = this.alertService.getMessage()
      .pipe(debounceTime(3000))
      .subscribe(message => {
        this.message = null;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
