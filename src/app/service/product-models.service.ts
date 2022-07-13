import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { productModels } from '../Model/productModels';

@Injectable({
  providedIn: 'root'
})
export class ProductModelsService {

  productModels:productModels[]=[];
  baseUrl="https://localhost:44353/";
  ProductModelsUrl="api/ProductModels/";
  constructor(private http:HttpClient) { }

  //כל דגמי המוצרים
  GetProductModel():Observable<productModels[]>
  {
    return this.http.get<productModels[]>(this.baseUrl+this.ProductModelsUrl+"GetProductModels");
  }
  //החזרת דגמים ע"פ קוד מוצר
  GetProductModelsByCodeProduct(codeP:number):Observable<productModels[]>
  {
    return this.http.get<productModels[]>(this.baseUrl+this.ProductModelsUrl+"GetProductModelsByCodeProduct/"+codeP)
  }
  //מחיקה
  DeleteProductModel(code:number):Observable<productModels[]>
  {
    return this.http.delete<productModels[]>(this.baseUrl+this.ProductModelsUrl+"DeleteProductModels/"+code);
  }
  //עדכון
  UpdateProductModel(code:number,p:productModels):Observable<productModels[]>
  {
    return this.http.put<productModels[]>(this.baseUrl+this.ProductModelsUrl+"UpdateProductModels/"+code,p);
  }
  //הוספה
  AddProductModel(p:productModels):Observable<productModels[]>
  {
    return this.http.post<productModels[]>(this.baseUrl+this.ProductModelsUrl+"AddProductModels",p);
  }
  //שם מוצר
  GetNameProduct(code:number):Observable<string[]>
  {
    return this.http.get<string[]>(this.baseUrl+this.ProductModelsUrl+"GetNameProduct/"+code);
  }
}
