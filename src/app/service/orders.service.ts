import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { orders } from '../Model/orders';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  baseUrl="https://localhost:44353/";
  OrderUrl="api/Order/";
  constructor(private http:HttpClient) { }
  
  //כל ההזמנות
  GetOrders():Observable<orders[]>{
    return this.http.get<orders[]>(this.baseUrl+this.OrderUrl+"GetOrders");
  }
  //הזמנות שבוצעו
  GetOrdersPlaced():Observable<orders[]>{
    return this.http.get<orders[]>(this.baseUrl+this.OrderUrl+"GetOrdersPlaced");
  }
  //הזמנות שלא בוצעו
  GetOrdersNotPlaced():Observable<orders[]>{
    return this.http.get<orders[]>(this.baseUrl+this.OrderUrl+"GetOrdersNotPlaced");
  }
  //עדכון תחילת הזמנה ע"י מלקט
  CollecteOrder(codeCollector:number,codeOrder:number):Observable<boolean>{
    return this.http.get<boolean>(this.baseUrl+this.OrderUrl+"CollectOrder/"+codeCollector+"/"+codeOrder);
  }
      //עדכון סיום הזמנה
    finishOrder(codeOrder:number):Observable<boolean>{
      return this.http.get<boolean>(this.baseUrl+this.OrderUrl+"finishOrder/"+codeOrder);
    }



  
}
