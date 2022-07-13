import { Pipe, PipeTransform } from '@angular/core';
import { products } from '../Model/products';
import { ProductsService } from '../service/products.service';

@Pipe({
  name: 'showNameP'
})
export class ShowNamePPipe implements PipeTransform {
  constructor(private p:ProductsService){}

  products:products[];
  transform(value: unknown, ...args: unknown[]): unknown {
    this.products=this.p.products;
for(let i=0; i<this.products.length;i++)
{
  if(this.products[i].codeProduct==value)
  return this.products[i].nameProduct;
}
    return null;
  }

}
