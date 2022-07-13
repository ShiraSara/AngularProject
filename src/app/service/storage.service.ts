import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { storage } from '../Model/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
baseUrl="https://localhost:44353/"
storageUrl="api/Storage/"
storages:storage[];
  constructor(private http:HttpClient) { }

  //הוספת מחסן
  AddStorage(s:storage):Observable<storage[]>
  {
    return this.http.post<storage[]>(this.baseUrl+this.storageUrl+"AddStorage",s);
  }
  //החזרת שם מחסן ע"פ קוד
  NameStorage(code:number):Observable<string[]>
  {
    return this.http.get<string[]>(this.baseUrl+this.storageUrl+"NameStorage/"+code);
  }
  //כל המחסנים
  GetAllStorage():Observable<storage[]>{
    return this.http.get<storage[]>(this.baseUrl+this.storageUrl+"GetStorage")
  }
}
