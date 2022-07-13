import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { collector } from '../Model/collector';
import { orders } from '../Model/orders';

@Injectable({
  providedIn: 'root'
})
export class CollectorsService {
  thisCollector:collector=new collector()
  baseUrl="https://localhost:44353/";
  collectorUrl="api/Collector/"
  nam:string=sessionStorage.getItem("collector");
  name="";
  isShow:boolean=true;
  constructor(private http:HttpClient) { }

   //החזרת כל המלקטים
   GetAllCollector():Observable<collector[]>{
    return this.http.get<collector[]>(this.baseUrl+this.collectorUrl+"GetCollectors");
   }
   //מחיקת מלקט
   DeleteCollector(codeCollector:number):Observable<collector[]>
   {
  return this.http.delete<collector[]>(this.baseUrl+this.collectorUrl+"DeleteCollector/"+codeCollector);
   }
   //הוספת מלקט
   AddCollector(c:collector):Observable<collector[]>
   {
     debugger;
    return this.http.post<collector[]>(this.baseUrl+this.collectorUrl+"AddCollector",c);
   }
   //עדכון מלקט
   UpdateCollector(codeCollector:number,c:collector):Observable<collector[]>
   {
     return this.http.put<collector[]>(this.baseUrl+this.collectorUrl+"UpdateCollector/"+codeCollector,c);
   }
   //אימות מלקט
   Login(userName:string,password:string):Observable<collector>{
     return this.http.get<collector>(this.baseUrl+this.collectorUrl+"Login/"+userName+"/"+password);
   }
   //אינדקס הכי גבוה
   Index():Observable<number>{
     return this.http.get<number>(this.baseUrl+this.collectorUrl+"Index");
   }
  //שחזור סיסמא-למייל
  RestorationPassword(name:string):Observable<boolean>{
    debugger
    return this.http.get<boolean>(this.baseUrl+this.collectorUrl+"RestorationPassword/"+name);
  }
  //שליפת מלקט לפי שם
  GetCollectorByName(name:string):Observable<collector>
  {
    return this.http.get<collector>(this.baseUrl+this.collectorUrl+"GetCollectorByName/"+name);
  }
  //עדכון מלקט כרגע
  thisCollector1()
  {
    let name1=sessionStorage.getItem("collector");
    this.GetCollectorByName(name1).subscribe(data=>this.thisCollector=data,err=>console.log(err))
  }
  //מלקט
  thisC()
  {
    this.name="מלקט : "+sessionStorage.getItem("collector");
  }
  //מנהל
  thisA()
  {
    this.name="מנהל";
  }
  //איפוס משתמש
  CollectorSighOut()
  {
    this.thisCollector=new collector();
    sessionStorage.clear();
  }
  ReturnThisCollector()
  {
    return this.thisCollector;
  }
    //בחירת הזמנות
    ChooseOrder(codeCollector:number):Observable<orders>
    {
    return this.http.get<orders>(this.baseUrl+this.collectorUrl+"ChooseOrder/"+codeCollector);
    }
}
