import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { now } from 'jquery';
import { CaptureComponent } from 'src/app/capture/capture.component';
import { TripStatus } from 'src/app/models/enums';
import { Trip } from 'src/app/models/trip';

import { TripState } from 'src/app/models/tripState';
import { TableModalComponent } from 'src/app/shared/table-modal/table-modal.component';
import Swal from 'sweetalert2';

import { FleetControlService } from '../../fleet-control.service';

@Component({
  selector: 'app-fleet-control-mobile-details',
  templateUrl: './fleet-control-mobile-details.component.html',
  styleUrls: ['./fleet-control-mobile-details.component.scss'],
  providers: [FleetControlMobileDetailsComponent],

})
export class FleetControlMobileDetailsComponent implements OnInit {

  public trip: Trip

  public change: boolean
  public status = ["ריק", "יגיע בזמן", "לא יגיע", "לא עונה", "מאחר"]


  constructor(public activeModal: NgbActiveModal, private service: FleetControlService, private modalService: NgbModal) { }

  ngOnInit() {

  }
  isUser() {
    return this.service.isUser
  }
  GetUserOption() {
    return this.service.isUser
  }
  gettime(line) {
    if (line)
      return new Date(line).format('DD/MM/YY HH:mm')
    else
      return ''
  }


  GetCapture() {

    const modalRef = this.modalService.open(CaptureComponent, { size: 'lg' });
    modalRef.componentInstance.barcode.subscribe((carr) => {
      if (carr) {
        this.service.SendQRCode(this.trip.CarNumber, carr)
          .subscribe((data) => {
            if (data.Success) {
              if (this.trip.state)
                this.trip.state.QRCode = data.Value;
            }
            else {
              Swal.fire('לא נשמר', data.Message, 'error');
            }
          }, ((eee) => {
            Swal.fire('', 'לא נשלח', 'error');
          })
          )

      }
      modalRef.close();
      
    })

  }
  get GetUserRole() {
    return this.service.GetUserRole
  }
  get GetUserRoute() {
    return this.service.GetUserRoute
  }
  get IsUserView() {
    var s = this.service.GetUserRole
    return (s == "הכל" || s == "טלפן" || s == "מוקד"|| s == "כניסה" || s == "יציאה" || s == "סייר"|| s == "מדביק")
  }
  get IsTalpan() {
    var s = this.service.GetUserRole
    return (s == "הכל" || s == "טלפן" || s == "מוקד")
  }
  get CanSendStaus() {
    var s = this.service.GetUserRole
    return (s == "הכל" || s == "כניסה" || s == "יציאה" ||   s == "מוקד")
  }
  get CanAction() {
    var s = this.service.GetUserRole
    return (s == "הכל" || s == "סייר" || s == "מוקד")
  }
  IsSendStaus(num: number) {
    if (this.trip.state && this.trip.state.Place == num)
      return false;
    if (num == 0)
      return true;
    var s = this.service.GetUserRole
    var r = this.service.GetUserRoute
    if (!s || !r) return false
    if (this.trip.Route == "מירון") {
      if (r == "הכל" || r == "מירון" || r == "טרמינל" || r == "חניון 10") {
        if (s == "הכל" || s == "מוקד") {
          return true
        }
        else if (r == "טרמינל" && s == "כניסה") {
          return ((num == 3))

        }
        else if (r == "טרמינל" && s == "יציאה") {
          return ((num == 4))

        }
        else if (r == "חניון 10" && s == "כניסה") {
          return ((num == 1))

        }
        else if (r == "חניון 10" && s == "יציאה") {
          return ((num == 2))

        }
      }
    }
    else {
      if (r == "מירון" || r == "טרמינל" || r == "חניון 10") {
        return false;
      }
      else if (r == "הכל") {
        return true
      }
      else if (s == "הכל" || s == "מוקד") {
        return true
      }
      else if (s == "כניסה") {
        return ((num == 1))

      }
      else if (s == "יציאה") {
        return ((num == 2))

      }

    }
    return false;
  }

  get StatusCur() {

    return this.service.GetStatusMiron(this.trip.Route, this.trip.state.Place)

  }

  get GetMironStatus() {
    var list = ["בטל", "הגיע לתחנה", "יצא מתחנה"]
    var list1 = ["בטל", "הגיע לחניון", "יצא מחניון", "הגיע לטרמינל", "יצא מטרמינל"]
    var arr = []

    if (!this.trip.Route) return arr
    if (this.trip.Route == "מירון") {

      list1.forEach((r, index) => {
        arr.push([index, r]);
      })
    }
    else {
      list.forEach((r, index) => {
        arr.push([index, r]);
      })


    }

    return arr;
  }
  showseder()
  {
  const modalRef = this.modalService.open(TableModalComponent, { size: 'sm' });
  modalRef.componentInstance.data = this.service.trips.filter(x => x.CarNumber == this.trip.CarNumber);
  //let col=['שעת יציאה', 'נהג','מיקום', 'סטטוס'].map(x => this.dtOptions.columns.find(c => c.title == x))
  let columns = [
    {
      name: 'startTime',
      title: 'שעת יציאה',
      data: 'getOrderStartTime',
     

    }
    ,
    
     
    {
      name: 'driver',
      title: 'נהג',
      data: 'DriverName',
      
    },

    {
      name: 'statusPlace',
      title: `סטטוס`,
      data: 'CurrentPlace',
       

    },
    {
      name: 'statusCol',
      title: `מיקום`,
      data: 'GetTripStatus',
      
    },
    {
      name: 'routeid',
      title: 'מוקד',
      data: 'Route',
     

    },
    
   
  ]
 
  modalRef.componentInstance.tableOpt = {
    columns:columns,
    order: [0, 'asc']
  };
  modalRef.componentInstance.title = 'נסיעות לרכב' + ': ' +this.trip.CarNumber
}

  UpdateStatusMiron(stat: number) {

    if (stat == 0) {
      var s = this.GetUserRole
      if ((s == "כניסה" || s == "יציאה") && this.trip.state.LastUpdate && (new Date().getTime() - new Date(this.trip.state.LastUpdate).getTime()) / 60000 > 4) {
        Swal.fire('לא נשמר', "אין אפשרות לעדכן ", 'error');
        return;
      }
      if (this.trip.state.Place > 0)
        stat = this.trip.state.Place - 1
    }



    this.service.UpdateStatusMiron(this.trip.LineCode, stat).subscribe((data) => {
      if (data.Success && data.Value) {
        this.trip.state.Place = stat;
        this.trip.state.LastUpdate = new Date();
        this.activeModal.dismiss('Closs click')
      }
      else {
        Swal.fire('לא נשמר', data.Message, 'error');
        return;
      }
    }, ((eee) => {
      Swal.fire('', 'לא נשמר', 'error');
      return;
    })
    )
  }
  UpdateSenderStatus(status: string) {
    {

      this.service.UpdateSenderStatus(this.trip.LineCode, status).subscribe((data) => {
        if (data.Success && data.Value) {
          this.trip.state.SenderStatus = status;
          this.activeModal.dismiss('Closs click')

        }
        else {
          Swal.fire('לא נשמר', data.Message, 'error');
        }
      }, ((eee) => {
        Swal.fire('', 'לא נשמר', 'error');
      })
      )

    }
  }

  UpdateSenderRemark() {
    {
      var t = document.getElementById("remark") as HTMLInputElement;
      this.service.UpdateSenderRemark(this.trip.LineCode, t.value).subscribe((data) => {
        if (data.Success && data.Value) {
          this.trip.Remark = t.value;
          this.activeModal.dismiss('Closs click')

        }
        else {
          Swal.fire('לא נשמר', data.Message, 'error');
        }
      }, ((eee) => {
        Swal.fire('', 'לא נשמר', 'error');
      })
      )

    }
  }
}