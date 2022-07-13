import { Component, OnInit, Input } from '@angular/core';
import { alert } from 'src/app/models/alert';

@Component({
  selector: 'app-trip-alert',
  templateUrl: './trip-alert.component.html',
  styleUrls: ['./trip-alert.component.scss']
})
export class TripAlertComponent implements OnInit {

  constructor() { }
  @Input() alert: alert;
  ngOnInit() {
  }

}
