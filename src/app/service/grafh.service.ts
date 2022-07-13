import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrafhService {

  baseUrl="https://localhost:44353/";
  grafhUrl="api/Grafh/";
  constructor(private http:HttpClient) { }

  //ביצוע האלגוריתם המרכזי- מחזיר לי את המפה
  GetNameMap(code:number):Observable<string[]>
  {
    return this.http.get<string[]>(this.baseUrl+this.grafhUrl+"GetnameOfMap/"+code)
  }
}
