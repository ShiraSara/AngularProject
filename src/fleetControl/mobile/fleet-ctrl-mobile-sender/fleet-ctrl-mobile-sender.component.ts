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


@Component({
  selector: 'app-fleet-ctrl-mobile-sender',
  templateUrl: './fleet-ctrl-mobile-sender.component.html',
  styleUrls: ['./fleet-ctrl-mobile-sender.component.scss'],
  providers: [FleetCtrlMobileSenderComponent],
})
export class FleetCtrlMobileSenderComponent implements OnInit {


  //private subscriptions: Subscription[] = [];
  public trip: Trip
  public user: User;

  public isempty: boolean
  //public barcode: string
  public plateserach: string
  public qrcode: string
  public trips$ = new BehaviorSubject<Trip[]>(undefined);
  constructor(private service: FleetControlService, private modalService: NgbModal) { }

  ngOnInit() {

    this.user = this.service.auth.User();
    this.service.getLocation();
    this.service.getCurrStates();
    this.getTripsMobile(true);

    setInterval(() => { this.service.getCurrStates(); }, 30000);
    setInterval(() => { if (this.service.auth.User()) this.getTripsMobile(); }, 300000);
    //setInterval(() => { if (this.showTodayTrips) this.getCurrStates(); }, 30000);
    // this.subscriptions.push(this.service.notify.subscribe(() => {

    //   // this.filterTable()
    // }));

  }

  getTripsMobile = (first: boolean = false) => {

    let reqObserve = this.service.getTodayTrips();
    reqObserve.subscribe((data) => {
      if (data) {
        if (data[0]) {


        }
        else {

        }
      }


    }, (err) => {

      Swal.fire('', 'טעינת נסיעות נכשלה', 'error');


    });

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


  GetCaptureBarCode() {
    this.Clear()
    const modalRef = this.modalService.open(CaptureComponent, { size: 'lg' });
    modalRef.componentInstance.barcode.subscribe((carr) => {
      //this.barcode = carr;
      modalRef.close();
      if (carr) {
        const s = this.service.trips.find(x => x.state && "Easybus-Miron21-" + x.state.QRCode == carr);
        if (!s) {
          this.barCodeSendQRCode(carr)
          return
        }
        else {
          Swal.fire({
            title: 'ברקוד משויך כבר לרכב האם להמשיך'
            ,showConfirmButton:true,
            showCancelButton:true
            ,confirmButtonText:"המשך"
  ,cancelButtonText:"ביטול"
          ,icon:'question'
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
             
              this.barCodeSendQRCode(carr)
            }  
          })
        }
        
      }

    })

  }


  GetCapture() {
    this.Clear()
    const modalRef = this.modalService.open(CaptureComponent, { size: 'lg' });
    modalRef.componentInstance.barcode.subscribe((carr) => {
      //this.barcode = carr;
      modalRef.close();
      if (carr) {
        const localTrip = this.service.trips.find(x => x.state && "Easybus-Miron21-" + x.state.QRCode == carr);
        if (localTrip) {
          this.sendStausCar(localTrip.CarNumber)
        }
        else {
          this.SendQRCode(carr)
        }
      }

    })

  }
  Clear() {
    this.plateserach = ""
    this.qrcode = ""
    this.trip = null;
    this.trips$.next([null])

  }
  GetCaptureSidur() {
    this.Clear()
    const modalRef = this.modalService.open(CaptureComponent, { size: 'lg' });
    modalRef.componentInstance.barcode.subscribe((carr) => {
      //this.barcode = carr;
      modalRef.close();
      if (carr) {
        const localTrip = this.service.trips.find(x => x.state && "Easybus-Miron21-" + x.state.QRCode == carr);
        if (localTrip) {
          this.qrcode = localTrip.state.QRCode
          this.showTrip();

        }
        else {
          this.isempty = true

        }
      }
    })

  }
   
  barCodeToPlate() {
    if (this.qrcode) {
      var s = this.service.trips.find(x => x.state && x.state.QRCode == this.qrcode.trim());
      if (!s) {
        this.barCodeSendQRCode("Easybus-Miron21-" + this.qrcode)
        return
      }
      else {
        Swal.fire({
          title: 'ברקוד משויך כבר לרכב האם להמשיך'
          ,showConfirmButton:true,
          showCancelButton:true
          ,confirmButtonText:"המשך"
,cancelButtonText:"ביטול"
,icon:'question'
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
           
            this.barCodeSendQRCode("Easybus-Miron21-" + this.qrcode)
          }  
        })
      }
    }
   
  }
  barCodeSendQRCode(qr: string) {

    const modalRef = this.modalService.open(LoginSmsComponent, { size: 'sm' });
    modalRef.componentInstance.smscode.subscribe((carr) => {

      this.service.SendQRCode(carr, qr)
        .subscribe((data) => {
          if (data.Success) {
            
            Swal.fire('עודכן', '', 'success')
            
            
          }
          else {
            Swal.fire('שגיאה', data.Message, 'error');
          }
        }, ((eee) => {
          Swal.fire('', 'לא נשלח', 'error');
        })


        )

    })

  }
  updatetrip() {
    if (this.qrcode) {
      var s = this.service.trips.find(x => x.state && x.state.QRCode == this.qrcode.trim());
      if (!s) {
        this.SendQRCode("Easybus-Miron21-" + this.qrcode)
        return
      }
      else {
        this.plateserach = s.CarNumber
      }
    }
    const localTrip = this.service.trips.find(x => x.CarNumber == (this.plateserach).trim());
    if (localTrip) {
      this.sendStausCar(localTrip.CarNumber)
    }
    else {
      Swal.fire('שגיאה', 'רכב לא נמצא פנה למנהל מוקד', 'error');
    }
    this.plateserach = ""
    this.qrcode = ""
    this.trip = null;
    this.trips$.next([null])
  }
  updatetrips() {

    const localTrip = this.service.trips.find(x => x.state && x.state.QRCode == this.qrcode.trim());
    if (localTrip) {
      this.sendStausCar(localTrip.CarNumber)
    }
    else {
      this.SendQRCode("Easybus-Miron21-" + this.qrcode)

    }
    this.plateserach = ""
    this.qrcode = ""
  }
  sendStausCar(plate: string) {
    var r = this.service.GetUserRoute;
    var s = this.service.GetUserRole;
    var st = -1

    if (r == "טרמינל" && s == "כניסה")
      st = 2
    else if (r == "טרמינל" && s == "יציאה")
      st = 3
    else if (r == "חניון 10" && s == "כניסה")
      st = 0
    else if (r == "חניון 10" && s == "יציאה")
      st = 1
    else if (s == "כניסה")
      st = 0
    else if (s == "יציאה")
      st = 1
    if (st == -1)
      Swal.fire('לא נשלח', "אין הרשאה", 'error');
    //const localTrip = this.service.trips.find(x => x.CarNumber == plate && x.state && x.state.Place==st && Math.abs(new Date().getTime() - new Date(x.OrderStartTime).getTime()) < 1000 * 60 * 60 * 2);
    const checklast = this.service.trips.find(x => x.CarNumber == plate && ((r == "טרמינל" || r == "חניון 10") ? x.Route == "מירון" : x.Route != "מירון") && x.state && x.state.Place == st + 1);
    if (checklast) {
      Swal.fire('הודעה', "רכב זה כבר עודכן", 'warning');
      return;
    }
    const localTrip = this.service.trips.find(x => x.CarNumber == plate && ((r == "טרמינל" || r == "חניון 10") ? x.Route == "מירון" : x.Route != "מירון") && x.state && x.state.Place == st);

    if (localTrip) {
      if (r != "טרמינל" && r != "חניון 10") {
        if (localTrip.Route != r) {
          Swal.fire('הודעה', "רכב זה אמור לצאת ממוקד " + localTrip.Route, 'warning');
          return;
        }
      }
      this.service.UpdateStatusMiron(localTrip.LineCode, st + 1).subscribe((data) => {
        if (data.Success && data.Value) {
          localTrip.state.Place = st + 1;
          localTrip.state.LastUpdate = new Date();
          Swal.fire('עודכן', '', 'success')
            
            this.Clear()
         

        }
        else {
          Swal.fire('לא נשלח', data.Message, 'error');
          return;
        }
      }, ((eee) => {
        Swal.fire('', 'לא נשלח', 'error');
        return;
      })
      )
    }
    else {
      Swal.fire('שגיאה', 'רכב לא נמצא פנה למנהל מוקד', 'error');
    }

  }


  get GetUserRole() {
    return this.service.GetUserRole
  }
  

  get IsMadbik() {
    return this.service.GetUserRole=="מדביק"
  }
  
  get GetUserRoute() {
    return this.service.GetUserRoute
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }



  SendQRCode(qr: string) {

    const modalRef = this.modalService.open(LoginSmsComponent, { size: 'sm' });
    modalRef.componentInstance.smscode.subscribe((carr) => {

      this.service.SendQRCode(carr, qr)
        .subscribe((data) => {
          if (data.Success) {

            Swal.fire('הודעה', "שים לב שיוך רכב לא מעדכן סטטוס", 'warning');
            this.Clear()
          }
          else {
            Swal.fire('שגיאה', data.Message, 'error');
          }
        }, ((eee) => {
          Swal.fire('', 'לא נשלח', 'error');
        })


        )

    })

  }
  platelen() {
    return this.plateserach && this.plateserach.length > 6 && this.plateserach.length < 9
  }
  Codelen() {
    return this.qrcode && this.qrcode.length < 4
  }

  logout() {
    this.service.LogOut();


  }
  showTrip() {


    if (this.qrcode)
      var s = this.service.trips.find(x => x.state && x.CarNumber && x.state.QRCode == this.qrcode);
    else
      var s = this.service.trips.find(x => x.state && x.CarNumber && x.CarNumber == this.plateserach);
    if (!s) {
      this.isempty = true
      this.trip = s;
      this.trips$.next([null])
      return
    }


    this.trip = s;
    this.isempty = false
    var tri1 = this.service.trips.filter(r => r.CarNumber == s.CarNumber && r.Route != "מירון")
    if (tri1 && tri1.length) {


      this.trips$.next(tri1 && tri1.length ? [...tri1] : [null])
      this.plateserach = ''
      this.qrcode = ''


    }

  }
}






