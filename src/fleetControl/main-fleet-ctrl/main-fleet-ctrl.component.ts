import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FleetControlService } from '../fleet-control.service';

import { BehaviorSubject, fromEvent, merge, Subject, concat, Subscription, empty } from 'rxjs';
import { Trip } from 'src/app/models/trip';
import * as moment from 'moment';
import { FleetControlTableComponent } from '../fleet-control-table/fleet-control-table.component';
import { NgbCheckBox, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { take, debounceTime, throttleTime } from 'rxjs/operators';
import { alert } from 'src/app/models/alert';
import Swal from 'sweetalert2';
//import { debug } from 'util';
import { format } from 'url';
import { alertType } from 'src/app/models/enums';
import { ApiReponse } from 'src/app/models/apiResponse';
import { browser } from 'protractor';



import { User } from 'src/app/models/user';



@Component({
  selector: 'app-main-fleet-ctrl',
  templateUrl: './main-fleet-ctrl.component.html',
  styleUrls: ['./main-fleet-ctrl.component.scss'],
  providers: [MainFleetCtrlComponent],

})


export class MainFleetCtrlComponent implements OnInit {

  title = 'ituranClient'
  @ViewChild('alertCont', { static: true }) alertsElm: ElementRef;
  @ViewChild(FleetControlTableComponent, { static: false }) tableComp: FleetControlTableComponent;


  private subscriptions: Subscription[] = [];

  public user: User

  public trips: Trip[];
  public trips$ = new BehaviorSubject<Trip[]>(undefined);
  public mokdim = []
  public tripsd: string[];


  public load: boolean;
  public load1: boolean;
  public load2: boolean;

  public alerts$ = new BehaviorSubject<{ lates: alert[], schs: alert[], prob: alert[], currAlert: alert[], changes: alert[] }>({ lates: [], schs: [], prob: [], currAlert: [], changes: [] });
  public alertsOpen: boolean = false;
  private alertsOpenSubject = new Subject();
  public isfirstline: boolean = false;
  public danger: string = "בסיכון";
  private getLocInterval: any;
  public CurrHour: string = "הכל";
  public expanded: boolean
  public expanded1: boolean
  private stopTrackTime: number
  public lastupdate: number;
  private mousedown: boolean
  constructor(private service: FleetControlService, private modalService: NgbModal) { }
  public searchString: string
  ngOnInit() {

    this.getTrips(false, true);

    this.user = this.service.auth.User();
    this.service.getAlerts();
    setInterval(() => { if (this.service.auth.User()) this.getTrips(); }, 300000);
    setInterval(() => { if (this.lastupdate < Date.now() - 60000) this.service.getCurrStates(); }, 30000);

    //this.subscriptions.push(this.service.currLocs.subscribe(locs => { this.proccessLocations(locs) }, err => console.log));
    this.subscriptions.push(this.service.notify.subscribe(() => {
      // this.lastupdate=Date.now();
      this.trips = this.service.trips;
      if (this.trips)
        this.filterTable()

    }));

    this.subscriptions.push(this.service.alert$.subscribe((alerts) => {
      let currLen = this.alerts$.getValue().lates.length + this.alerts$.getValue().schs.length + this.alerts$.getValue().prob.length;
      let newAlerts = {
        lates: alerts.filter(x => x.type == alertType.late),
        schs: alerts.filter(x => x.type == alertType.scheduleProblem),
        prob: alerts.filter(x => x.type == alertType.problem),
        changes: alerts.filter(x => x.type == alertType.change),
        currAlert: alerts.filter(x => x.type == alertType.problem)
      };
      newAlerts.lates.sortBy('priority', true);
      newAlerts.schs.sortBy('priority', true);
      newAlerts.prob.sortBy('priority', true);
      newAlerts.currAlert.sortBy('priority', true);
      this.alerts$.next(newAlerts);
      $('.badge').removeClass('badge-primary')
      $('.badge').addClass('badge-danger');
      $('#alert2').removeClass('badge-danger');
      $('#alert2').addClass('badge-primary');
      if (alerts.length != currLen) {
        this.alertsOpen = true;
        this.alertsOpenSubject.next();
      }

    }));
    moment.locale('he-IL');
    var div = document.getElementById('moves')
    var divx = 0
    var divy = 0
    div.style.top = window.innerHeight - 200 + 'px'
    div.style.left = 25 + 'px'
    if (div) {
      div.addEventListener('mousedown', (ev) => {
        this.mousedown = true
        // Now we calculate the difference upwards 
        divx = ev.offsetX
        divy = ev.offsetY
      }, null);
      div.addEventListener('mouseup', (ev) => {
        this.mousedown = false
        // Now we calculate the difference upwards 

      }, null)
      div.addEventListener('mouseleave', (ev) => {
        this.mousedown = false
        // Now we calculate the difference upwards 

      }, null)
      div.addEventListener('mousemove', (ev) => {
        if (this.mousedown) {
          // Now we calculate the difference upwards 
          div.style.top = ev.clientY - divy + 'px';
          div.style.left = ev.clientX - divx + 'px';
        }
      }, null)

    }
  }
  logout() {
    this.service.LogOut();


  }


  isUser() {
    return this.service.isUser;
  }
  isSuperAdmin() {
    return this.service.isSuperAdmin;
  }
  showCheckboxes() {
    var checkboxes = document.getElementById("checkboxes");
    if (!this.expanded) {
      checkboxes.style.display = "block";
      this.expanded = true;
    } else {
      checkboxes.style.display = "none";
      this.expanded = false;

    }
  }
  showHours() {
    var checkboxes = document.getElementById("checkboxeshour");
    if (!this.expanded1) {
      checkboxes.style.display = "block";
      this.expanded1 = true;
    } else {
      checkboxes.style.display = "none";
      this.expanded1 = false;
      this.CurrHour = ""

      for (let i = 0; i < checkboxes.children.length; i++) {
        let curCheckbox = checkboxes.children[i].children[0] as HTMLInputElement;
        if (curCheckbox.checked) {
          if (curCheckbox.value == "הכל") {
            this.CurrHour = "הכל"
            break;
          }
          else
            this.CurrHour += curCheckbox.value + ";"
        }

      }

      this.filterTable()
    }


  }
  ngAfterViewInit() {
    const evObserv = merge(merge(...(['scroll', 'mousemove', 'whell'].map(x => fromEvent(this.alertsElm.nativeElement, x)))), this.alertsOpenSubject.asObservable());
    this.subscriptions.push(evObserv.pipe(debounceTime(30000)).subscribe(ev => {
      this.alertsOpen = false;
    }));
  }
  get getHours() {



    if (this.trips && this.tripsd) {

      return this.trips.filter(t => this.tripsd.includes(t.Route)).map(r => r.Group.toLocaleString()).distinct();
      // else
      //return this.trips.filter(t=>col.split(";").includes( t.Route)).map(r => r.Group.toLocaleString()).distinct();
    }

    else
      return [];
  }
  openusers() {
    window.open('users', '_blank');
  }
  schsIsRead() {

    return this.alerts$.getValue().schs.filter(r => !r.isread).length;

  }
  latesIsRead() {

    return this.alerts$.getValue().lates.filter(r => !r.isread).length;

  }
  probIsRead() {

    return this.alerts$.getValue().prob.filter(r => !r.isread).length;

  }

  AllAlerts() {
    var aler = '';
    this.service.getChangeAlert().forEach(t => aler += t.msg + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0')

    return aler;
  }
  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  toggleAlerts() {
    this.alertsOpen = !this.alertsOpen;
  }


  toggleGetAlerts(type: number) {

    this.alertsOpen = true;
    $('.badge').removeClass('badge-primary')
    $('.badge').addClass('badge-danger')

    $('#alert' + type).removeClass('badge-danger');
    $('#alert' + type).addClass('badge-primary');

    if (type == 0)

      this.alerts$.getValue().currAlert = this.alerts$.getValue().lates;
    else if (type == 1)
      this.alerts$.getValue().currAlert = this.alerts$.getValue().schs;
    else if (type == 2)
      this.alerts$.getValue().currAlert = this.alerts$.getValue().prob;
    this.alertsOpenSubject.next();
  }


  debug() {
    debugger;
  }

  UpdateMokedim(str: string) {
    if (this.tripsd.includes(str)) {
      let idx = this.tripsd.findIndex(x => x == str);
      if (idx > -1) this.tripsd.splice(idx, 1);
    }
    else {

      this.tripsd.push(str);
      this.tripsd.sortBy(0);
    }

  }
  IsCheced(str: string) {
    if (this.tripsd)
      return this.tripsd.includes(str);
  }
  filterTable = () => {
    if (this.tripsd) {
      var tri1 = this.trips;
      if (this.CurrHour != "הכל")
        tri1 = tri1.filter(r => this.CurrHour.split(';').includes(r.Group.toLocaleString()))
      if (this.searchString)
        tri1 = tri1.filter(r => ((r.state ? r.state.QRCode + r.state.SenderStatus : '') + r.Remark + r.Route + r.CarNumber + r.DriverCell + r.DriverName + r.Kablan + r.OrderStartTime.toLocaleString() + r.CurrentPlace).includes(this.searchString))
      var tri = tri1.filter(r => this.tripsd.includes(r.Route))
      this.trips$.next(tri && tri.length ? [...tri] : [null])
    }


  }

  getTrips = (refresh: boolean = false, first: boolean = false) => {
    this.load = true;

    let reqObserve = this.service.getTodayTrips(refresh);
    reqObserve.subscribe((data) => {
      this.trips = this.service.trips;
      if (first) {

        this.service.getCurrStates();
        this.mokdim = this.trips.map(r => r.Route).distinct();

        this.mokdim.sortBy(0);

        this.tripsd = this.mokdim.map(r => r);
        this.tripsd.sortBy(0);

      }
      this.filterTable()
      // if(this.showTodayTrips) this.service.getCurrStates() 
      this.load = false;
    }, (err) => {
      this.load = false;
      Swal.fire('', 'טעינת נסיעות נכשלה', 'error');
      this.trips = null;

      this.trips$.next([null]);


    });

  }





}
