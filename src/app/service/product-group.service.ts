import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { productGroups } from '../Model/productGroups';

@Injectable({
  providedIn: 'root'
})
export class ProductGroupService {

  groups:productGroups[];
  baseUrl="https://localhost:44353/";
  productGroupUrl="api/ProductGroups/";
  constructor(private http:HttpClient) {}
  //החזרת כל הקבוצות
  GetAllGroup():Observable<productGroups[]>
  {
    return this.http.get<productGroups[]>(this.baseUrl+this.productGroupUrl+"GetProductGroups");
  }
  //הוספת קבוצה
  AddGroup(p:productGroups):Observable<productGroups[]>
  {
    return this.http.post<productGroups[]>(this.baseUrl+this.productGroupUrl+"AddProductGroups",p);
  }
  //עריכת קבוצה
  UpdateGroup(productGroupsDTO:productGroups,code:number):Observable<productGroups[]>
  {
    return this.http.put<productGroups[]>(this.baseUrl+this.productGroupUrl+"UpdateProductGroups/"+code,productGroupsDTO);
  }
  //מחיקת קבוצה
  DeleteGroup(code:number):Observable<productGroups[]>
  {
    return this.http.delete<productGroups[]>(this.baseUrl+this.productGroupUrl+"DeleteProductGroups/"+code);
  }
  //החזרת שם קבוצה על פי קוד
  GetGroupByCode(code:number):Observable<string[]>
  {
    return this.http.get<string[]>(this.baseUrl+this.productGroupUrl+"GetProductGroupsByCodeGroup/"+code);
  }

}
