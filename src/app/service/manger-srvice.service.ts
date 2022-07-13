import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { observable, Observable } from 'rxjs';
import { collector } from '../Model/collector';
import { mangar } from '../Model/mangar';

@Injectable({
  providedIn: 'root'
})
export class MangerSrviceService {

  
  baseUrl="https://localhost:44353/";
  StoragUrl="api/Storage/";
  constructor(private http:HttpClient) { }

  flagEnter:boolean=true;
  mangarN:mangar=new mangar();

  //קריאת אקסל
  readData():Observable<boolean>
  {
    return this.http.get<boolean>(this.baseUrl+this.StoragUrl+"Excel");
  }

}
