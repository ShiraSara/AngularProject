import { ViewChild } from '@angular/core';
import { HostListener } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbTableDirective, MdbTablePaginationComponent, ModalDirective } from 'angular-bootstrap-md';
import { collector } from '../Model/collector';
import { orders } from '../Model/orders';
import { CollectorsService } from '../service/collectors.service';
import { OrdersService } from '../service/orders.service';



@Component({
  selector: 'app-collectors',
  templateUrl: './collectors.component.html',
  styleUrls: ['./collectors.component.css']
})
export class CollectorsComponent implements OnInit {

  flag:boolean=false;
  newCollector:collector=new collector();
  validatingForm: FormGroup;
  selectFile:File=null;
  flag11:boolean=true;
  flag2:boolean=false;
  Order:orders=new orders();
  flaggg:boolean=true;
  ordersList:Array<orders>=new Array<orders>();
  constructor(private collectorService:CollectorsService,private r:Router) { }

  ngOnInit(){
    this.validatingForm = new FormGroup({
      modalFormElegantUserName: new FormControl('', Validators.required),
      modalFormElegantPassword: new FormControl('', Validators.required)
    });

  
  }
  login()
  {
  this.collectorService.Login(this.validatingForm.value.modalFormElegantUserName,this.validatingForm.value.modalFormElegantPassword).subscribe(data=>{this.newCollector=data,this.checkUser();},err=>console.log(err))
  this.flaggg=false;
  }
  checkUser()
  {
    if(this.newCollector!=null)
    {
      alert("ברוך הבא"+" "+this.newCollector.nameCollector+"הנך מועבר לדף הליקוט");
      this.flag=true;
      sessionStorage.setItem("collector",this.newCollector.nameCollector);
       this.collectorService.thisCollector1();
       this.collectorService.thisC();
       this.collectorService.isShow=false;
      this.flag11=false;
     this.collectorService.ChooseOrder(this.newCollector.codeCollector).subscribe(data=>{this.Order=data;console.log(this.Order);this.show()},err=>console.log(err))

    }
    else {
      alert("שם או סיסמא אינם נכונים, אנא נסה שנית");
      this.validatingForm.value.modalFormElegantPassword="";
      this.validatingForm.value.modalFormElegantUserName="";
    }
  }

    show()
    {
  this.r.navigate(['/showProductInOrder',this.Order.codeOrder]);
    }
  
}
