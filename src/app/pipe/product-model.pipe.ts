import { Pipe, PipeTransform } from '@angular/core';
import { productModels } from '../Model/productModels';
import { ProductModelsService } from '../service/product-models.service';

@Pipe({
  name: 'productModel'
})
export class ProductModelPipe implements PipeTransform {
  productModel:productModels[]=[];
  constructor(private modelService:ProductModelsService){}
  transform(value: number, ...args: unknown[]): unknown {
    this.productModel=this.modelService.productModels;
for(let i=0; i<this.productModel.length;i++)
{
  if(this.productModel[i].codeModel==value)
  return this.productModel[i].shelf;
}
    return null;
  }

}
