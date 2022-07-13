import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { products } from '../Model/products';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  products:products[];
  baseUrl="https://localhost:44353/";
  productsUrl="api/Product/"
  constructor(private http:HttpClient) { }

  //החזרת כל המוצרים
  GetAllProduct():Observable<products[]>{
    return this.http.get<products[]>(this.baseUrl+this.productsUrl+"GetProduct");
  }
  //החזרת מוצרים לפי קוד קבוצה
  GetProductByCodeGroup(codeGroup:number):Observable<products[]>
  {
    return this.http.get<products[]>(this.baseUrl+this.productsUrl+"GetProductByCodeGroup/"+codeGroup);
  }
  //מחיקת מוצר
  DeleteProduct(code:number):Observable<products[]>
  {
    return this.http.delete<products[]>(this.baseUrl+this.productsUrl+"DeleteProduct/"+code);
  }
  //עדכון מוצר
  UpdateProduct(code:number,p:products):Observable<products[]>
  {
    return this.http.put<products[]>(this.baseUrl+this.productsUrl+"UpdateProduct/"+code,p);
  }
  //ההספת מוצר
  AddProduct(p:products):Observable<products[]>
  {
    return this.http.post<products[]>(this.baseUrl+this.productsUrl+"AddProduct",p);
  }
}
