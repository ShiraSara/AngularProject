import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { productModels } from '../Model/productModels';
import { ColorService } from '../service/color.service';
import { ProductModelsService } from '../service/product-models.service';
import { ProductsService } from '../service/products.service';

@Component({
  selector: 'app-product-modle',
  templateUrl: './product-modle.component.html',
  styleUrls: ['./product-modle.component.scss']
})
export class ProductModleComponent implements OnInit {

  flag:boolean=false;
  flag2:boolean=true;
  el:productModels=new productModels();
  flag1:boolean=false;
  element:productModels[];
  flagIf:boolean=true;
  s:number;
  flag33:boolean=false;
  flag44:boolean=false;
  params:number;
  constructor(private productModel:ProductModelsService,private colorService:ColorService,private productS:ProductsService) { 
    this.colorService.GetColors().subscribe(data=>{this.colorService.colors=data;this.flag33=true},err=>console.log(err))
   this.productS.GetAllProduct().subscribe(data=>{this.productS.products=data;this.flag44=true},err=>console.log(err))
  }

  ngOnInit(): void {
    this.productModel.GetProductModel().subscribe(data=>this.element=data,err=>console.log(err))
  }
  editField: string;
  

  awaitingPersonList: Array<any>= [];

  //מחיקת דגם
  remove(code:number) {
  this.productModel.DeleteProductModel(code).subscribe(data=>this.productModel.GetProductModelsByCodeProduct(10).subscribe(data=>this.element=data,err=>console.log(err)),err=>alert(err));
  }
  //הוספת דגם
  AddProductModel()
  {
  console.log(this.el)
   this.productModel.AddProductModel(this.el).subscribe(data=>{this.element=data},err=>{alert("sorry...")});
   this.flag=false;
   this.flag2=true;
  }
 //הוספת שורה
  add() {
    this.flag2=false;
   this.flag=true;
  }
//עדכון דגם
update()
{
this.productModel.UpdateProductModel(this.s,this.el).subscribe(data=>this.element=data,err=>console.log(err));
this.flag1=false;
this.flagIf=true;
}
update1(code:number,co:productModels)
{
this.s=code;
this.el=co;
this.flag1=true;
this.flagIf=false;
}
}
