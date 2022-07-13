import { Pipe, PipeTransform } from '@angular/core';
import { productModels } from '../Model/productModels';
import { ProductModelsService } from '../service/product-models.service';

@Pipe({
  name: 'showPosion'
})
export class ShowPosionPipe implements PipeTransform {
  productModel:productModels[]=[];
  constructor(private modelService:ProductModelsService){}
  transform(value: unknown, ...args: unknown[]): unknown {
    this.productModel=this.modelService.productModels;
    for(let i=0; i<this.productModel.length;i++)
    {
      if(this.productModel[i].codeModel==value)
      return this.productModel[i].position;
    }
    return null;
  }

}
