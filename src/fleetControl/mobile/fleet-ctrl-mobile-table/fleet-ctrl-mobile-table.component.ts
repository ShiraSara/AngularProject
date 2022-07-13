import { Component, Input, OnInit, ViewChild } from '@angular/core';
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


@Component({
  selector: 'app-fleet-ctrl-mobile-table',
  templateUrl: './fleet-ctrl-mobile-table.component.html',
  styleUrls: ['./fleet-ctrl-mobile-table.component.scss'],
  
})
export class FleetCtrlMobileTableComponent implements OnInit {
   
  @Input('trips') set trips(trips: Trip[]) { 
    this.trips$.next(trips && trips.length ? [...trips] : [null])

   

  }
  @Input('route') route:string
    
 
   

  public trips$ = new BehaviorSubject<Trip[]>(undefined);
  public load: boolean;
 
  public user: User;
 
   

  constructor(private service: FleetControlService, private modalService: NgbModal) { }

  ngOnInit() {
   
    setInterval(() => {  this.scrollToCurrRow}, 300000);
  }
   
  isUser() {
    return this.service.isUser
  }
  isMoked() {
    var s= this.service.GetUserRole
    return s=="כניסה"||s=="יציאה"
  }
  get GetDanger( ) {
     
    return this.route=='/dangers'
}
  isSayyar() {
    var s= this.service.GetUserRole
    return s=="סייר" 
  }
  ViewNext() {
    var s= this.service.GetUserRole
    var c= this.service.GetUserRoute
    return s=="סייר" ||s=="הכל" ||(s=="מוקד" &&c=="מירון")
  }
   ViewLate() {
    var s= this.service.GetUserRole
    return s=="סייר" ||s=="הכל" ||s=="מוקד" 
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
  gettrip(line: Trip) {

if(this.isMoked())
   return
   

        const modalRef = this.modalService.open(FleetControlMobileDetailsComponent, { size: 'lg' });
        modalRef.componentInstance.trip = line;
  }
  // GetCapture() {

  //   const modalRef = this.modalService.open(CaptureComponent, { size: 'lg' });
  //   modalRef.componentInstance.barcode.subscribe((carr) => {
  //     this.barcode = carr;
  //     this.updatetripQR(carr)
  //   })

  // }
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
  
  // updatetrip() {

  //   const localTrip = this.trips.find(x => x.CarNumber == (this.plateserach).trim());
  //   if (localTrip) {

  //   }
  //   else {
  //     Swal.fire('', 'רכב לא מזוהה', 'error');
  //   }
  //   this.plateserach = ""
  //   this.qrcode = ""
  // }
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
  logout() {
    this.service.LogOut();


  }
  statusColor(sta) {
    if (!sta || !sta.state) return '';
    if (sta.state.SenderStatus == 'יגיע בזמן') return 'lightgreen';
    else if (sta.state.SenderStatus == 'לא יגיע') return 'red';
    else if (sta.state.SenderStatus == 'לא עונה') return 'purple';
    else if (sta.state.SenderStatus == 'מאחר') return 'orange';
    return ''
  }

  scrollToCurrRow = () => {
    if (!this.trips) return;
    const now = moment().subtract(5, 'm');
    let trip = this.trips.find((x: Trip) => moment(x.OrderStartTime).isAfter(now));
    if (!trip) return;
    var row = $('#' + trip.LineCode);



    $('#tripsTable tbody').animate({

      scrollTop: row.offset().top - 130
    }, 400);
  }
  
 
}
