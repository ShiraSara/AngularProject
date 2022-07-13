import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UplodeService {

  baseUrl="https://localhost:44353/"
  storageUrl="api/Storage/"

  constructor(private http:HttpClient) { }

  Read(fileName:string):Observable<boolean>
  {
   return this.http.get<boolean>(this.baseUrl+this.storageUrl+"Read/"+fileName);
  }
}
