import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { orders } from '../Model/orders';
import { products } from '../Model/products';
import { productsOnOrder } from '../Model/productsOnOrder';
import { CollectorsService } from '../service/collectors.service';
import { GrafhService } from '../service/grafh.service';
import { OrdersService } from '../service/orders.service';
import { ProductModelsService } from '../service/product-models.service';
import { ProductOnOrderService } from '../service/product-on-order.service';
import { ProductsService } from '../service/products.service';

@Component({
  selector: 'app-show-product-in-order',
  templateUrl: './show-product-in-order.component.html',
  styleUrls: ['./show-product-in-order.component.scss']
})
export class ShowProductInOrderComponent implements OnInit {
  url:string="https://localhost:44353/wwwroot/routes/";
  ur1Image:string=""
  nameUrl:string=""
  string1:string="";
  constructor(private productOnOrderService:ProductOnOrderService,private _Activatedroute:ActivatedRoute,private grafhService:GrafhService,private collectorService:CollectorsService,private orderService:OrdersService,private pService:ProductModelsService,private productSrevice:ProductsService) { }
  code:string;
  Order:orders=new orders();
  flagImage:boolean=false;
  codeOrder:number;
  elements:productsOnOrder[] = [];
  flag44=false;
  flag33=false;
  flag1:boolean=false;
  headElements = ['קוד מוצר בהזמנה', 'קוד הזמנה', 'שם דגם', 'מדף','טור','עמודה','כמות','סטטוס','עדכון'];
  ngOnInit() {
    this._Activatedroute.paramMap.subscribe(params => { 
      this.code = params.get('id'); 
      this.Order.codeOrder=parseInt(this.code);
      console.log(this.codeOrder)
      //עדכון תחילת ביצוע הזמנה
      this.orderService.CollecteOrder(this.collectorService.thisCollector.codeCollector,this.Order.codeOrder).subscribe(data=>console.log(data),err=>console.log(err))
      this.productOnOrderService.GetProductsOnOrdersByCodeOrder(this.Order.codeOrder).subscribe(data=>this.elements=data,err=>console.log(err))
    this.productSrevice.GetAllProduct().subscribe(data=>{this.productSrevice.products=data;},err=>console.log(err));
    this.pService.GetProductModel().subscribe(data=>{this.pService.productModels=data;this.flag33=true},err=>console.log(err))
  });
    }
    //עדכון סטטוס איסוף מוצר
    updateStatus(code:number)
    {
      this.productOnOrderService.UpdateProductsOnOrder(code).subscribe(data=>{this.elements=data,this.goo()},err=>console.log(err))
    }
    //עדכון איסוף כל המוצרים
    updateAllStatus()
    {
     this.productOnOrderService.UpdateproductsOnOrdersByCodeOrder(this.Order.codeOrder).subscribe(data=>{document.getElementById("btn1").innerText="עדכון כל המוצרים בוצע",this.elements=data},err=>console.log(err))
    }
    //הצגת מסלול
    showRoute()
    {
     this.grafhService.GetNameMap(this.Order.codeOrder).subscribe(data=>{this.flagImage=true;this.nameUrl=data[0];this.string1=data[1];this.showRoute1()},err=>console.log(err))
    }
    showRoute1()
    {
      this.ur1Image=this.url+this.nameUrl;
      console.log(this.ur1Image)
      console.log(this.string1)
    }
    goo()
    {
      this.productOnOrderService.GetProductsOnOrdersByCodeOrder(this.Order.codeOrder).subscribe(data=>this.elements=data,err=>console.log(err))
    }
    flag:boolean=false;
    //הזמנה חדשה
    takeNewOrder()
    {
   
      this.orderService.finishOrder(this.Order.codeOrder).subscribe(data=>{this.flag=true,alert("סיום הזמנה בוצע בהצלחה");this.elements=[];this.newOrder()},err=>console.log(err))
    }
    //התחלת הזמנה חדשה
    newOrder()
    {
         //עדכון סיום הזמנה
         this.flagImage=false;
         this.nameUrl=""
         this.string1=""
    if(this.flag==true)
     {
      this.collectorService.ChooseOrder(this.collectorService.thisCollector.codeCollector).subscribe(data=>{this.Order=data;this.flag1=true;this.lett()},err=>console.log(err))
     }
   
    }
    lett()
    {
      if(this.flag1==true)
      {
        debugger
      this.productOnOrderService.GetProductsOnOrdersByCodeOrder(this.Order.codeOrder).subscribe(data=>this.elements=data,err=>console.log(err))
      }
    }
  }
