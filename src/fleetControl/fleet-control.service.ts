/// <reference types="@types/googlemaps" />
import gm = google.maps;

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable, pipe, Subject, merge, Subscription, throwError, observable } from 'rxjs';
import { of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { Stop } from '../models/stop';
import { reqStatus, alertPriority, alertType } from '../models/enums';
import { Trip } from '../models/trip';
import * as moment from 'moment';
import { alert } from '../models/alert';
import { ASTWithSource } from '@angular/compiler';
import { ApiReponse } from '../models/apiResponse';
import Swal from 'sweetalert2';
import * as signalR from "@microsoft/signalr";
import { TripState } from '../models/tripState';

import { TripUser, User } from '../models/user';
import { AuthGuard } from '../models/auth';
import { FctrlTripPlate } from '../models/tripplate';


import { GoogleAddresses } from '../models/googleAddresses';
import { TripLocation } from '../models/TripLocation';

import { promise } from 'protractor';


@Injectable({
  providedIn: 'root'
})
export class FleetControlService {
  private baseUrl = environment.baseApiUrl + 'FleetControl/';

  //locations: Map<string, baseLocationRecord[]> = new Map<string, baseLocationRecord[]>();;
  requests: Subscription[] = [];
  requestsState$: Map<string, BehaviorSubject<reqStatus>> = new Map<string, BehaviorSubject<reqStatus>>();
  notify = new Subject();

  dateValueOf: number;
  public trips: Trip[];
  //public tripone: Trip;
  public curlocation: gm.LatLng;
  public markerSvg;
  public markerSvg1;
  public busStopSvg;
  public PepoleSvg;
  private LastUpdate: Date;
  private LastUpdate1: Date;
  public danger: number = 0
  //private connectionIds: string[] = [];
  alert$ = new BehaviorSubject<alert[]>([]);

  public lastStates: TripState[]

  Options: signalR.IHttpConnectionOptions
  private connection: signalR.HubConnection;
  public auth: AuthGuard
  // public currLocs: BehaviorSubject<baseLocationRecord[]> = new BehaviorSubject<baseLocationRecord[]>([]); 

  constructor(private http: HttpClient, auth: AuthGuard) {
    this.http.get('/assets/busPath.txt', { responseType: 'text' }).subscribe(((data) => {
      this.markerSvg = data;
    }));
    this.http.get('/assets/busPath1.txt', { responseType: 'text' }).subscribe(((data) => {
      this.markerSvg1 = data;
    }));
    this.http.get('/assets/busStopPath.txt', { responseType: 'text' }).subscribe(((data) => {
      this.busStopSvg = data;
    }));
    this.http.get('/assets/pepole.txt', { responseType: 'text' }).subscribe(((data) => {
      this.PepoleSvg = data;
    }));

    this.auth = auth;
    //this.getMarkerSvg();
    //this.getMarkerSvg1();
    //this.getBusStopSvg();

    this.connection = new signalR.HubConnectionBuilder()

      .withUrl(environment.baseApiUrl.replace('api', 'hub'), { accessTokenFactory: () => auth.User().token })
      .withAutomaticReconnect()

      .build();
    this.connection.on('SendStatus', (status: TripState[]) => {
      this.LastUpdate = new Date()
      if (this.trips)

        status.forEach(s => {
          if (this.lastStates) {
            let localTrip = this.lastStates.findIndex(x => x.LineCode == s.LineCode);
            if (localTrip >= 0) {
              this.lastStates.fill(s, localTrip, 1)
            }

          }
          const localTrip = this.trips.find(x => x.LineCode == s.LineCode);
          if (localTrip == undefined) {
            //  debugger;
          }
          else
            localTrip.state = s;
          if (s.LineCode == (window as any).lineCodeToLog) console.log({ time: localTrip.OrderStartTime, s: s });
          //if(s.Deviations.length) console.log({t: localTrip, s: s});
        });

      this.notify.next();
    });
    // this.connection.on('LineExecMsg', (states: TripState[]) => {
    //   this.lastStates = states;
    //   if (this.trips)
    //     states.forEach(s => {
    //       const localTrip = this.trips.find(x => x.LineCode == s.LineCode);
    //       if (localTrip == undefined) {
    //         //  debugger;
    //       }
    //       else
    //         localTrip.state = s;
    //       if (s.LineCode == (window as any).lineCodeToLog) console.log({ time: localTrip.OrderStartTime, s: s });
    //       //if(s.Deviations.length) console.log({t: localTrip, s: s});
    //     });
    //   this.notify.next();
    // });
    this.connection.on('TripPlate', (tripplate: FctrlTripPlate[]) => {
      this.LastUpdate = new Date()
      if (this.trips) {
        tripplate.forEach(s => {

          const localTrip = this.trips.find(x => x.LineCode == s.LineCode);
          if (localTrip == undefined) {
            //  debugger;
          }
          else {

            localTrip.CarNumber = s.CarNumber;
            localTrip.DriverName = s.DriverName;
            localTrip.DriverCell = s.DriverCell;
            localTrip.Kablan = s.Kablan;
            localTrip.state.SenderStatus = s.Status;
          }

          //if(s.Deviations.length) console.log({t: localTrip, s: s});
        });
        this.notify.next();
      }

    });
    this.connection.on('Alerts', (alerts: alert[]) => {
      let alert = this.alert$.getValue();
      alert.forEach(x => {
        let idx = alerts.findIndex(y => y.type == x.type && y.lineCode == x.lineCode);
        if (idx == -1) {
          alert.splice(idx, 1);
          this.alert$.next([...alert]);

        }

      });
      alerts.forEach(x => {

        this.pushAlert(x);
      });
    });
    /* this.connection.on('CurrLocs', (locs: baseLocationRecord[]) => {
         locs.forEach(x => { if (!this.getLocsArr(x.Plate).find(r => r.Date == x.Date)) this.getLocsArr(x.Plate).push(x); });
     this.currLocs.next(locs);
   });*/

    this.connection.start()



  }

  get isUser() {
    return (this.auth.isUser)
  }

  get isSuperAdmin() {

    return (this.auth.isSuperAdmin)
  }
  get GetUserRole() {

    return this.auth.GetUserRole
  }
  get GetUserRoute() {

    return this.auth.GetUserRoute
  }
  get IsUserView() {
    var s = this.GetUserRole
    return (s == "הכל" || s == "טלפן" || s == "מוקד" || s == "כניסה" || s == "יציאה" || s == "סייר" || s == "מדביק")
  }

  public getLocation() {
    this.currLocation().then((res: any) => {

      if (res == -1) {

      }
      else {

        this.curlocation = new gm.LatLng(res.coords.latitude, res.coords.longitude);
      }
    })
  }
  currLocation() {
    return new Promise((resolve, reject) => {

      try {
        navigator.geolocation.getCurrentPosition((res) => {
          resolve(res)
        }, (fai) => {
          resolve(-1)
        },
          {
            maximumAge: 600000,
            timeout: 3000,
          })

      } catch (e) {

        resolve(-1);
      }
    })
  }


  private checkConnection() {
    if (this.connection.state == 'Disconnected') {
      this.connection.start();

    }

  }

  public LogOut() {
    this.auth.logedOut();
    if (this.connection.state != 'Disconnected') {
      this.connection.stop();
    }

    this.alert$.next([]);
  }
  pushAlert(alert: alert) {
    let alerts = this.alert$.getValue();
    let idx = alerts.findIndex(x => x.type == alert.type && x.lineCode == alert.lineCode);
    if (idx > -1 && alerts[idx].msg != alert.msg) {
      alerts.splice(idx, 1, alert);
      this.alert$.next([...alerts]);
    }
    else if (idx < 0) {
      alerts.push(alert);
      this.alert$.next([...alerts]);
    }
  }

  deleteAlert(lineCode, type) {
    let alerts = this.alert$.getValue();
    let idx = alerts.findIndex(x => x.type == type && x.lineCode == lineCode);
    if (idx > -1) alerts.splice(idx, 1);
    this.alert$.next([...alerts]);
  }
  getChangeAlert() {
    let alerts = this.alert$.getValue();
    return alerts.filter(x => x.type == alertType.change);


  }

  private getReqSubject(plate) {
    if (!this.requestsState$.has(plate)) this.requestsState$.set(plate, new BehaviorSubject<reqStatus>(undefined));
    return this.requestsState$.get(plate);
  }
  /*private getLocsArr(plate){
    if (!this.locations.has(plate)) this.locations.set(plate, []);
    return this.locations.get(plate);
  }*/

  private clearReqs() {
    this.requests.forEach(x => x.unsubscribe());
    this.requests.length = 0;
    this.requestsState$.clear();
    //this.locations.clear();
  }

  private getCurrReletiveDate() {
    let date = new Date();
    if (date.getHours() < 4) date.setDate(date.getDate() - 1);
    date.setHours(0, 0, 0, 0);
    return date.valueOf();
  }

  public reqLocations(plate: string, refresh: boolean = false) {
    const dateVal = this.getCurrReletiveDate();

    /* if( this._showTodayTrips && this.dateValueOf !=  dateVal) {
       this.clearReqs();
       this.dateValueOf = dateVal;
     }*/
    let reqSubject = this.getReqSubject(plate);
    if (refresh || !reqSubject.getValue()) {
      reqSubject.next(reqStatus.start);
      this.notify.next();
      let url = this.baseUrl + 'GetTodayLocations?plate=' + plate + (refresh ? '&refresh=true' : '') + '&token=' + this.auth.User().token
      //this.baseUrl + `GetLocations?plate=${plate}&start=${this.startDate.toISOString()}&end=${this.endDate.toISOString()}`;
      this.requests.push(this.http.get(url).subscribe((res: ApiReponse<TripState[]>) => {
        if (!res.Success) {
          console.log('req loc failed: inner exception');
          this.requestsState$.get(plate).next(reqStatus.fail);
        } else {
          res.Value.forEach(s => {
            const localTrip = this.trips.find(x => x.LineCode == s.LineCode);
            localTrip.state = s;
          })

          // this.getLocsArr(plate).pushArray(res.Value);
          this.requestsState$.get(plate).next(reqStatus.complete);
        }
        this.notify.next();
      }, (err) => {
        this.requestsState$.get(plate).next(reqStatus.fail);
        this.notify.next();
      }, () => {
        let sub = this.requestsState$.get(plate);
        if (sub.getValue() == reqStatus.start) sub.next(reqStatus.fail);
        this.notify.next();
      }));
    }
    return reqSubject;
  }

  public reqPending() {
    let res = false;
    for (let r of this.requestsState$.values()) {
      if (r.getValue() == reqStatus.start) {
        res = true;
        break;
      }
    }
    return res;
  }

  public retryLocs(all?: boolean) {
    if (all) {
      this.http.get(this.baseUrl + 'RetryServerLocations').subscribe();
      this.requestsState$.forEach(x => x.next(undefined));
      this.clearReqs();
      this.notify.next();
    } else {
      for (const reqSub of this.requestsState$.entries()) {
        if (reqSub[1].getValue() == reqStatus.fail) this.reqLocations(reqSub[0], true);
      }
    }
  }

  public getCurrStates() {
    if ((this.LastUpdate && (new Date().getTime() - this.LastUpdate.getTime()) < 300000) && (this.LastUpdate1 && (new Date().getTime() - this.LastUpdate1.getTime()) < 300000)) {
      this.CheckStatusLates()
      return;
    }
    //this.http.get(this.baseUrl + 'GetCurrLocations').subscribe();
    this.http.get(this.baseUrl + 'getCurrStates?token=' + this.auth.User().token).subscribe((res: ApiReponse<TripState[]>) => {
      if (res.Success) {
        this.LastUpdate1 = new Date()
        this.lastStates = res.Value;
        if (this.trips) {
          let locs: TripState[] = res.Value;
          locs.forEach(s => {
            const localTrip = this.trips.find(x => x.LineCode == s.LineCode);
            if (localTrip)
              localTrip.state = s;
          })
        }
        // locs.forEach(x => { if (!this.lastStates(x.Plate).find(r => r.Date == x.Date)) this.getLocsArr(x.Plate).push(x); });
        //return locs;
      }// else {
      //return [];
      //}
      this.CheckStatusLates()
      this.notify.next();
    }, catchError((err) => {

      return throwError(err)
    }));

  }



  public getTodayTrips(refresh: boolean = false) {


    //this.alert$.next([]);

    return this.http.get(this.baseUrl + 'GetAllTrips?' + (refresh ? 'refresh=true' : '') + `&token=${this.auth.User().token}`).pipe(map(this.proccessTrips, this), catchError((err) => { this.trips = null; return throwError(err) }));
  }


  public UpdateStatusMiron(linecode: number, status: number): Observable<ApiReponse<boolean>> {


    return this.http.get<ApiReponse<boolean>>(this.baseUrl + `UpdateStatusMiron?token=${this.auth.User().token}&linecode=${linecode}&status=${status}`);
  }

  public UpdateSenderRemark(linecode: number, remark: string): Observable<ApiReponse<boolean>> {


    return this.http.get<ApiReponse<boolean>>(this.baseUrl + `UpdateSenderRemark?token=${this.auth.User().token}&linecode=${linecode}&remark=${remark}`);
  }
  public UpdateSenderStatus(linecode: number, senderstatus: string): Observable<ApiReponse<boolean>> {


    return this.http.get<ApiReponse<boolean>>(this.baseUrl + `UpdateSenderStatus?token=${this.auth.User().token}&linecode=${linecode}&senderstatus=${senderstatus}`);
  }

  public SendQRCode(plate: string, qrcode: string): Observable<ApiReponse<string>> {


    return this.http.get<ApiReponse<string>>(this.baseUrl + `UpdateQRCode?token=${this.auth.User().token}&plate=${plate}&qrcode=${qrcode}`);
  }


  public GetTripStatus(l: number) {

    switch (l) {
      case 0:
        return '';
      case 1:
        return "לא הגיע לתחנת המוצא";
      case 2:
        return "נמצא בתחנת המוצא";
      case 3:
        return "יצא בזמן";
      case 4:
        return "יצא באיחור";
      case 5:
        return 'הקדים';
      case 6:
        return 'סיים';
      case 7:
        return 'חסר מקט';
      case 8:
        return 'לא בוצע';
      case 9:
        return 'חסר מספר רכב';
      case 10:
        return 'חסר איתורן';
      case 11:
        return 'חסר מידע';
      default:
        return '';
    }
  }

  public GetStatusMiron(route: string, place: number) {
    var list = ["", "הגיע לתחנה", "יצא מתחנה", "סיים"]
    var list1 = ["", "הגיע לחניון", "יצא מחניון", "הגיע לטרמינל", "יצא מטרמינל", "סיים"]

    if (route == "מירון") {
      if (place < 6)
        return (list1[place]);
    }
    else {
      if (place < 4)
        return (list[place]);
    }
    return ""
  }

  public getAlerts() {

    this.http.get(this.baseUrl + `GetAlerts?token=${this.auth.User().token}`).subscribe((res: ApiReponse<alert[]>) => {
      if (res.Success) {

        let locs: alert[] = res.Value;
        locs.forEach(x => {

          this.pushAlert(x);
        });
      }

    }, catchError((err) => {

      return throwError(err)
    }));


  }
  public GetTripLocation(line: number): Observable<ApiReponse<TripLocation>> {
    return this.http.get<ApiReponse<TripLocation>>(this.baseUrl + `GetTripLocation/${line}?token=${this.auth.User().token}`);
  }

  public GetAllCarsApi(): Observable<ApiReponse<string[]>> {
    return this.http.get<ApiReponse<string[]>>(this.baseUrl + `GetAllCarsApi?token=${this.auth.User().token}`);
  }

  public GetTripUsers(): Observable<ApiReponse<TripUser[]>> {
    return this.http.get<ApiReponse<TripUser[]>>(this.baseUrl + `GetUsers?token=${this.auth.User().token}`);
  }

  public UpdateTripUser(tripuser: TripUser): Observable<ApiReponse<TripUser>> {


    return this.http.post<ApiReponse<TripUser>>(this.baseUrl + `UpdateUser?token=${this.auth.User().token}`, tripuser);
  }

  /*public getLocationByPlate(plate: string, startDate: moment.Moment, endDate: moment.Moment) {
    return this.http.get(this.baseUrl + `GetLocationsByPlate?Plate=${plate}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&token=${this.auth.User().token}`);
  }*/
  public GetTripByLine(lincode: number): Observable<ApiReponse<Trip>> {
    return this.http.get<ApiReponse<Trip>>(this.baseUrl + `GetTripByLine?linecode=${lincode}&token=${this.auth.User().token}`);
  }
  public GetTripsFirst() {
    return this.http.get(this.baseUrl + `GetTripsFirst?token=${this.auth.User().token}`);
  }


  /*public getTotayShapes(){
    return this.http.get(this.baseUrl + `GetAllTodayShapes?token=${this.auth.User().token}`)
  }*/

  /*private getConnectionIds(plates:string[]){
    this.http.post(this.baseUrl + "GetAllConnections", plates).subscribe((res:ApiReponse<string[]>) => {
      if(res.Success){
        this.connectionIds = res.Value;
      } else {
        Swal.fire({title: 'שגיאה', text: 'לא נמצאו פרטי חיבור לשירותי מיקום' + res.Message, icon: 'error'});
      }
    });
  }*/

  private proccessTrips(res: ApiReponse<any>) {
    this.checkConnection();
    if (res.Success) {
      let data = res.Value;
      if (!this.IsUserView) {
        if (this.GetUserRole == "מינצברג")
          this.trips = data.filter(r => r.Kablan == 'מינצברג' || r.Kablan == 'מינצברג מאיר');
        ///לזכור להוציא מהערה
        else
          this.trips = data.filter(r => r.Kablan == this.GetUserRole);
      }
      else {
        this.trips = data;
      }
      this.trips = this.trips.map((x: Trip): Trip => { return new Trip(this, x); });
      if (this.lastStates) this.lastStates.forEach(s => {
        const localTrip = this.trips.find(x => x.LineCode == s.LineCode);
        if (localTrip) localTrip.state = s;
        if (s.LineCode == (window as any).lineCodeToLog) console.log({ time: localTrip.OrderStartTime, s: s });
        //if(s.Deviations.length) console.log({t: localTrip, s: s});
      });
      this.CheckStatusLates()
      //if(this._showTodayTrips) this.checkSchedules();
      return this.trips;
    }
  }

  private CheckStatusLates() {
    const tr = this.trips.filter(r => r.state && r.state.ToChange)
    tr.forEach(r => {

      r.state.ToChange = false;

    })
    const trip = this.trips.filter(r => r.CarNumber && r.Route == "מירון" && r.NextOrderTime && moment().diff(r.NextOrderTime, 'm') > - 270 && (!r.state || (r.state && r.state.Place < 4)))
    if (trip) {
      var rr = 0
      trip.forEach(r => {

        var fin = this.trips.filter(s => s.CarNumber == r.CarNumber);
        const tri = fin.find(s => r.NextOrderTime.toLocaleString() == s.OrderStartTime.toLocaleString() && (!s.state || (s.state && s.state.Place == 0)))

        if (tri) {
          rr++
          r.state.ToChange = true;
          tri.state.ToChange = true;
        }
      })
      this.danger = rr
    }
    else
      this.danger = 0;
  }

  // private getTripName(t: Trip) {
  //   return t.Route +t.Description.split(" ").slice(0, 5).join(" ") + '..';
  // }

  /*public getMarkerSvg(){
    if(this.markerSvg) return of(this.markerSvg);

     
    return this.http.get('/assets/busPath.txt', { responseType: 'text' }).subscribe(((data)=>{
      this.markerSvg = data;
    }));
  }
  public getMarkerSvg1(){
    if(this.markerSvg1) return of(this.markerSvg1);
    return this.http.get('/assets/busPath1.txt').subscribe(((data:string)=>{
      this.markerSvg1 = data;
    }));
  }
  
  public getBusStopSvg(){
    if(this.busStopSvg) return of(this.busStopSvg);
    return this.http.get('/assets/busStopPath.txt', { responseType: 'text' }).subscribe(((data)=>{
      this.busStopSvg = data;
    }));
  }
 */



}
