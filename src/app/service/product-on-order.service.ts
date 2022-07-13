import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { productsOnOrder } from '../Model/productsOnOrder';

@Injectable({
  providedIn: 'root'
})
export class ProductOnOrderService {

  baseUrl="https://localhost:44353/";
  ProducOnOrderUrl="api/ProductsOnOrder/";
  constructor(private http:HttpClient) { }

  //החזרת רשימת מוצרים בהזמנה לפי קוד הזמנה
  GetProductsOnOrdersByCodeOrder(codeOrder:number):Observable<productsOnOrder[]>
  {
    return this.http.get<productsOnOrder[]>(this.baseUrl+this.ProducOnOrderUrl+"GetProductsOnOrdersByCodeOrder/"+codeOrder)
  }

  //עדכון סטטוס מוצר בהזמנה
  UpdateProductsOnOrder(codeProductOnOrder:number):Observable<productsOnOrder[]>
  {
    return this.http.get<productsOnOrder[]>(this.baseUrl+this.ProducOnOrderUrl+"UpdateProductsOnOrder/"+codeProductOnOrder)
  }

  //עדכון כל המוצרים לסטטוס בוצע לפי קוד הזמנה
  UpdateproductsOnOrdersByCodeOrder(codeOrder:number):Observable<productsOnOrder[]>
  {
    return this.http.get<productsOnOrder[]>(this.baseUrl+this.ProducOnOrderUrl+"UpdateproductsOnOrdersByCodeOrder/"+codeOrder)
  }

}
