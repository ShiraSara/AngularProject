import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
import { GroupedObservable } from 'rxjs';
import { productGroups } from '../Model/productGroups';
import { products } from '../Model/products';
import { productWithNames } from '../Model/productWithNames';
import { ShowNameGPipe } from '../pipe/show-name-g.pipe';
import { ProductGroupService } from '../service/product-group.service';
import { ProductsService } from '../service/products.service';
import { StorageService } from '../service/storage.service';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss']
})
export class ProductTableComponent implements OnInit {

  nameG:string="";
  flag:boolean=false;
  flag2:boolean=true;
  el:products=new products();
  flag1:boolean=false;
  group:productGroups[];
  element:products[]=[];
  productWithName:productWithNames[]=[];
  s:number;
  params:number;
  flag33:boolean=false;
  flag44:boolean=false;
  constructor(private productService:ProductsService,private serviceStorage:StorageService,private groupS:ProductGroupService) { }

  ngOnInit(): void {
    this.productService.GetAllProduct().subscribe(data=>{this.element=data;},err=>console.log(err));
   this.groupS.GetAllGroup().subscribe(data=>{this.groupS.groups=data;this.flag33=true},err=>console.log(err))
   this.serviceStorage.GetAllStorage().subscribe(data=>{this.serviceStorage.storages=data;this.flag44=true},err=>console.log(err))
  }
  editField: string;

  awaitingPersonList: Array<any>= [];

  //מחיקת דגם
  remove(code:number) {
  this.productService.DeleteProduct(code).subscribe(data=>this.element=data,err=>alert(err));
  }
  //הוספת דגם
  AddCollector()
  {
   this.el.codeProduct=undefined;
   this.productService.AddProduct(this.el).subscribe(data=>{this.element=data},err=>{alert("sorry...")});
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
this.productService.UpdateProduct(this.s,this.el).subscribe(data=>console.log(data),err=>console.log(err));
this.flag1=false;
this.flag2=true;
}
update1(code:number,co:products)
{
this.s=code;
this.el=co;
this.flag1=true;
this.flag2=false;
this.flag=false;
}
p1:productWithNames=new productWithNames();
//אחכ
name1:string;
name2:string;
async after()
{
  debugger
  for(let i=0; i<this.element.length;i++)
  {
    this.p1.codeProduct=this.element[i].codeProduct
    this.serviceStorage.NameStorage(this.element[i].codeStorage).subscribe(data=>{this.name1=data[0],this.check(data)},err=>console.log(err));
    this.p1.nameProduct=await this.element[i].nameProduct;
    this.p1.nameStorage=await this.name1;
    this.groupS.GetGroupByCode(this.element[i].codeGroup).subscribe(data=>{this.name2=data[0],this.check1(data)},err=>console.log(err))
    this.p1.nameGroup=await this.name2;
    this.productWithName[i]=new productWithNames(this.p1.codeProduct,this.p1.nameProduct,this.p1.nameGroup,this.p1.nameStorage);
  }
}
check(data)
{
this.name1=data[0];
}
check1(data)
{
this.name2=data[0];
}
}
