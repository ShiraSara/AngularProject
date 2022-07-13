import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { BehaviorSubject, observable, Subscription } from 'rxjs';

import { User } from 'src/app/models/user';
import Swal from 'sweetalert2';
import { FleetControlMobileDetailsComponent } from '../fleet-control-mobile-details/fleet-control-mobile-details.component';

import { tap } from 'rxjs/operators';
import { TripState } from 'src/app/models/tripState';
import { TripStatus } from 'src/app/models/enums';
import { SelectorMatcher } from '@angular/compiler';
import { FleetControlService } from '../../fleet-control.service';
import { FctrlTripPlate } from 'src/app/models/tripplate';
import { Trip } from 'src/app/models/trip';
import { CaptureComponent } from 'src/app/capture/capture.component';
import { LoginSmsComponent } from 'src/app/login-sms/login-sms.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-fleet-ctrl-mobile',
  templateUrl: './fleet-ctrl-mobile.component.html',
  styleUrls: ['./fleet-ctrl-mobile.component.scss'],
  providers: [FleetCtrlMobileComponent],
})
export class FleetCtrlMobileComponent implements OnInit {

  public trips: Trip[];
  public mokdim = []
  public tripsd: string[];
  private subscriptions: Subscription[] = [];
  public searchString: string
  public view1: number = 100
  public currentpage: number = 1
  public currentpage1: number = 1
  public maxpage: number = 1


  public load: boolean;
  public showAll: boolean;
  public user: User;
  public expanded: boolean
  public startDate: Date = moment().startOf('d').subtract(1, 'day').toDate();
  public endDate: Date = moment().startOf('d').subtract(1, 'day').toDate();
  //public barcode: string
  public plateserach: string
  public statusmoked: string
  public statustalpan: string
  public qrcode: string
  private route:string
  constructor(private service: FleetControlService, private modalService: NgbModal,private router: Router) { }

  ngOnInit() {
this.route=this.router.url
    this.user = this.service.auth.User();
    this.service.getLocation();

    this.getTripsMobile(true);

    // this.scrollToCurrRow();
    setInterval(() => { this.service.getCurrStates(); }, 30000);
    setInterval(() => { if (this.service.auth.User()) this.getTripsMobile(); }, 300000);
    //setInterval(() => { if (this.showTodayTrips) this.getCurrStates(); }, 30000);
    this.subscriptions.push(this.service.notify.subscribe(() => {

      this.filterTable()
    }));

  }

  getTripsMobile = (first: boolean = false) => {
    this.load = true;
    let reqObserve = this.service.getTodayTrips();
    reqObserve.subscribe((data) => {
      if (data) {
        if (data[0]) {

          this.filterTable()
          if (first) {
            this.service.getCurrStates();
            this.mokdim = data.map(r => r.Route).distinct();
            this.mokdim.sortBy(0);
            this.tripsd = this.mokdim.map(r => r);
            this.tripsd.sortBy(0);
          }
        }
        else {
          this.load = false;
          this.trips = null;


        }
      }

      this.load = false;
    }, (err) => {
      this.load = false;
      Swal.fire('', 'טעינת נסיעות נכשלה', 'error');

      this.trips = null;
    });

  }

  logout() {
    this.service.LogOut();


  }
  IsMoked() {
    var s = this.service.GetUserRole

    return s == "הכל" || s == "מוקד"
  }
  IsSayyar() {
    var s = this.service.GetUserRole

    return s == "סייר" 
  }
  getStatus() {
    var s = this.GetUserRoute
    var c = this.GetUserRole
    var list = []
    list.push("הכל")

    if (c == "הכל" || c == "סייר" || c == "מוקד") {
      if (s == "הכל" || s == "מירון" || s == "טרמינל" || s == "חניון 10") {
        list.pushArray(["הגיע לחניון", "יצא מחניון", "הגיע לטרמינל", "יצא מטרמינל"])
      }
      if (!(s == "מירון" || s == "טרמינל" || s == "חניון 10")) {
        list.pushArray(["הגיע לתחנה", "יצא מתחנה"])
      }
      list.push("סיים")

    }
    return list;
  }
  showPage(s) {
    if (s == 0)
      this.currentpage++;
    else if (s == -1)
      this.currentpage--;
    else
      this.currentpage = s
    this.filterTable()
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

  whenCheckStatus(s) {
    if (s.target.value == "הכל")
      this.statusmoked = ""
    else
      this.statusmoked = s.target.value
    this.filterTable()

  }

  whenCheckStatustalpan(s) {
    if (s.target.value == "הכל")
      this.statustalpan = ""
    else
      this.statustalpan = s.target.value
    this.filterTable()

  }
  get GetUserRole() {
    return this.service.GetUserRole
  }
  get GetUserRoute() {
    return this.service.GetUserRoute
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
    this.filterTable();
  }
 get GetDanger( ) {
     
      return this.service.danger
  }
  IsCheced(str: string) {
    if (this.tripsd)
      return this.tripsd.includes(str);
  }
  isUser() {
    return this.service.isUser
  }
  gettime(line) {
    if (line)
      return line.format('DD/MM/YY HH:mm')
    else
      return ''
  }
  // getCurrStates() {
  //   if (this.service.lastStates) {
  //     let locs: TripState[] = this.service.lastStates
  //     locs.forEach(s => {
  //       const localTrip = this.trips.find(x => x.LineCode == s.LineCode);
  //       if (localTrip)
  //         localTrip.state = s;
  //     })
  //   }
  //   //this.service.getCurrStates();
  // }

  isSuperAdmin() {
    return this.service.isSuperAdmin;
  }
  openusers() {
    window.open('users', '_blank');
  }
  opendangers() {
    window.open('dangers', '_blank');
  }
  
  gettrip(line: Trip) {



    const modalRef = this.modalService.open(FleetControlMobileDetailsComponent, { size: 'lg' });
    modalRef.componentInstance.trip = line;


  }
  GetCapture() {

    const modalRef = this.modalService.open(CaptureComponent, { size: 'lg' });
    modalRef.componentInstance.barcode.subscribe((carr) => {
      //this.barcode = carr;
      if (carr) {
        const localTrip = this.service.trips.find(x => x.state && "Easybus-Miron21-" + x.state.QRCode == carr);
        if (localTrip) {
          this.plateserach = localTrip.CarNumber
          this.filterTable();
        }
      }
      modalRef.close();
      //this.updatetripQR(carr)
    })

  }
  // updatetripQR(trip: string) {
  //   const localTrip = this.trips.find(x => x.state && "Easybus-Miron21-" + x.state.QRCode == trip);
  //   if (localTrip) {

  //   }
  //   else {
  //     const modalRef = this.modalService.open(LoginSmsComponent, { size: 'lg' });
  //     modalRef.componentInstance.smscode.subscribe((carr) => {
  //       const localTrip = this.trips.find(x => x.CarNumber && x.CarNumber == carr);
  //       if (localTrip) {
  //         this.service.SendQRCode(carr, trip)
  //           .subscribe((data) => {
  //             if (data.Success) {



  //             }
  //             else {
  //               Swal.fire('לא נשמר', data.Message, 'error');
  //             }
  //           }, ((eee) => {
  //             Swal.fire('', 'לא נשלח', 'error');
  //           })


  //           )
  //       }
  //       else {
  //         Swal.fire('שגיאה', 'רכב לא נמצא פנה למנהל מוקד', 'error');
  //       }

  //     })
  //   }
  // }
  // sendStausCar(plate:number)
  // {

  // }
  // updatetripQRTest() {
  //   const localTrip = this.trips.find(x => x.state && x.state.QRCode == this.qrcode);
  //   if (localTrip) {

  //   }
  //   else {
  //     const modalRef = this.modalService.open(LoginSmsComponent, { size: 'sm' });
  //     modalRef.componentInstance.smscode.subscribe((carr) => {
  //       const localTrip = this.trips.find(x => x.CarNumber && x.CarNumber == carr);
  //       if (localTrip) {
  //         this.service.SendQRCode(carr, this.qrcode)
  //           .subscribe((data) => {
  //             if (data.Success) {



  //             }
  //             else {
  //               Swal.fire('לא נשמר', data.Message, 'error');
  //             }
  //           }, ((eee) => {
  //             Swal.fire('', 'לא נשלח', 'error');
  //           })


  //           )
  //       }
  //       else {
  //         Swal.fire('שגיאה', 'רכב לא נמצא פנה למנהל מוקד', 'error');
  //       }

  //     })
  //   }
  // }

  platelen() {
    return this.plateserach && this.plateserach.length > 6 && this.plateserach.length < 9
  }
  Codelen() {
    return this.qrcode && this.qrcode.length < 4
  }
  updatetrip() {
    if (this.qrcode) {
      var s = this.service.trips.find(x => x.state.QRCode == (this.qrcode).trim());
      if (s)

        this.plateserach = s.CarNumber


    }
    if (this.plateserach) {
      this.filterTable();

    }
    else {
      this.trips = null
    }

    this.qrcode = ""
  }
  // updatetrips() {

  //   const localTrip = this.trips.find(x => x.state.QRCode == (this.qrcode).trim());
  //   if (localTrip) {

  //   }
  //   else {
  //     Swal.fire('', 'רכב לא מזוהה', 'error');
  //   }
  //   this.plateserach = ""
  //   this.qrcode = ""
  // }
  // logout() {
  //   this.service.LogOut();


  // }
  // statusColor(sta) {
  //   if (!sta || !sta.state) return '';
  //   if (sta.state.SenderStatus == 'יגיע בזמן') return 'lightgreen';
  //   else if (sta.state.SenderStatus == 'לא יגיע') return 'red';
  //   else if (sta.state.SenderStatus == 'לא עונה') return 'purple';
  //   else if (sta.state.SenderStatus == 'מאחר') return 'orange';
  //   return ''
  // }

  // scrollToCurrRow = () => {
  //   if (!this.trips) return;
  //   const now = moment().subtract(5, 'm');
  //   let trip = this.trips.find((x: Trip) => moment(x.OrderStartTime).isAfter(now));
  //   if (!trip) return;
  //   var row = $('#' + trip.LineCode);



  //   $('#tripsTable tbody').animate({

  //     scrollTop: row.offset().top - 130
  //   }, 400);
  // }

  filterTable() {
    var tri1 = this.service.trips;
    if (!tri1 || !tri1[0]) {
      this.maxpage = 0
      return
    }

    if (this.plateserach)
      tri1 = tri1.filter(r => r.CarNumber == this.plateserach)
    if (this.searchString)
      tri1 = tri1.filter(r => (r.state.QRCode + r.Remark + r.Route + r.CarNumber + r.DriverCell + r.DriverName + r.Kablan + r.OrderStartTime.toLocaleString() + r.CurrentPlace + r.state.SenderStatus).includes(this.searchString))
    if (this.tripsd)
      tri1 = tri1.filter(r => this.tripsd.includes(r.Route))
    var s = this.service.GetUserRole
    if (s == "טלפן") {
      var s = this.service.GetUserRoute
      tri1 = tri1.filter(r => r.Route == s && moment().diff(r.OrderStartTime, 'm') < 60 && (!r.state || (r.state && r.state.Place < 1)))
    }
    else if (s == "סייר") {
      var s = this.service.GetUserRoute
      if (s == "טרמינל")
        tri1 = tri1.filter(r => r.Route == "מירון" && (!r.state || (r.state && r.state.Place == 3)))
      else if (s == "חניון 10")
        tri1 = tri1.filter(r => r.Route == "מירון" && (!r.state || (r.state && r.state.Place == 1)))
      else if (s == "מירון")
        tri1 = tri1.filter(r => r.Route == "מירון" && (!r.state || (r.state && (r.state.Place == 1 || r.state.Place == 3))))
    }
    else if (s == "מוקד" || s == "הכל") {
      var s = this.service.GetUserRoute
      if (s == "ירושלים")
        tri1 = tri1.filter(r => r.Route != "מירון")
      else if (s == "מירון")
        tri1 = tri1.filter(r => r.Route == "מירון")
      else if (s != "הכל")
        tri1 = tri1.filter(r => r.Route == s)
    }

    if (this.statustalpan) {
      {
        tri1 = tri1.filter(r => r.state && r.state.SenderStatus == this.statustalpan)
      }
    }
    if (this.statusmoked) {
      if (this.statusmoked == "ריק") {
        tri1 = tri1.filter(r => r.CurrentPlace == "")
      }
      else {
        tri1 = tri1.filter(r => r.CurrentPlace == this.statusmoked)
      }
    }
    if(this.route=='/dangers')
    tri1 = tri1.filter(r => r.state&& r.state.ToChange)
    if (tri1 && tri1.length) {
      tri1.sortBy('Route')
      tri1.sortBy('OrderStartTime')
    //  tri1.sortBy('IsLate')
      if (this.view1 && tri1.length > this.view1) {
        this.maxpage = Math.ceil(tri1.length / this.view1)
        tri1 = tri1.slice((this.currentpage - 1) * this.view1, (this.currentpage - 1) * this.view1 + this.view1);
      }
      else {
        this.maxpage = 0
      }

      this.trips = tri1
    }
    else {
      this.trips = null
      this.maxpage = 0
    }
  }
  getFirstPage() {
    this.currentpage1 = this.currentpage < 3 ? 0 : this.currentpage - 3
    if (this.currentpage > this.maxpage - 3)
      this.currentpage1 = this.maxpage - 5
    if (this.maxpage < 6) this.currentpage1 = 0
    return Array(this.maxpage > 5 ? 5 : this.maxpage).map((x, i) => i)
  }
  get IsRoute() {
    var s = this.service.GetUserRoute
    return (s == "מירון" || "ירושלים" || "הכל")
  }
}
