import { Component, OnInit } from '@angular/core';
import { productGroups } from '../Model/productGroups';
import { productModels } from '../Model/productModels';
import { products } from '../Model/products';
import { storage } from '../Model/storage';
import { ColorService } from '../service/color.service';
import { ProductGroupService } from '../service/product-group.service';
import { ProductModelsService } from '../service/product-models.service';
import { ProductsService } from '../service/products.service';
import { StorageService } from '../service/storage.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  stock:boolean=false;
  elements:productModels[]=[];
  flag:boolean=false;
  Groups:productGroups[]=[];
  group:boolean=false;
  productList:products[]=[];
  n:number;
  flag33:boolean=false;
  flag44:boolean=false;
  GetProductModelsList:productModels[]=[];
  constructor(private productService:ProductsService,private ProductModelService:ProductModelsService,private gropService:ProductGroupService,private colorService:ColorService,private storageService:StorageService) {} 
    
  ngOnInit(){
this.gropService.GetAllGroup().subscribe(data=>{this.Groups=data;this.gropService.groups=data},err=>console.log(err))
this.productService.GetAllProduct().subscribe(data=>{this.productList=data;this.productService.products=data},err=>console.log(err))
this.colorService.GetColors().subscribe(data=>{this.colorService.colors=data;this.flag33=true},err=>console.log(err))
   this.storageService.GetAllStorage().subscribe(data=>{this.storageService.storages=data;this.flag44=true},err=>console.log(err))
  }
  showP(c:number)
  {
    this.elements=[];
    this.group=true;
    this.productService.GetProductByCodeGroup(c).subscribe(data=>this.productList=data,err=>console.log(err))
  }
  show(c:number)
  {
    this.n=c;
    this.flag=true;
    this.ProductModelService.GetProductModelsByCodeProduct(c).subscribe(data=>this.elements=data,err=>console.log(err))
  }
  showS()
  {
    this.stock=!this.stock;
  }

}
