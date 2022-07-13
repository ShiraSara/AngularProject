import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { colors } from '../Model/colors';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  baseUrl="https://localhost:44353/";
  colors:colors[];
  colorUrl="api/Colors/"
  constructor(private http:HttpClient) { }

  //מחיקת צבע
  DeleteColor(code:number):Observable<colors[]>
  {
    return this.http.delete<colors[]>(this.baseUrl+this.colorUrl+"DeleteColor/"+code);
  }
  //עדכון צבע
  UpdateColor(code:number,c:colors):Observable<colors[]>
  {
    return this.http.put<colors[]>(this.baseUrl+this.colorUrl+"UpdateColor/"+code,c);
  }
  //הוספת צבע
  AddColor(c:colors):Observable<colors[]>
  {
    debugger;
    return this.http.post<colors[]>(this.baseUrl+this.colorUrl+"AddColor",c);
  }
  //כל הצבעים
  GetColors():Observable<colors[]>
  {
    return this.http.get<colors[]>(this.baseUrl+this.colorUrl+"GetColors");
  }

}
