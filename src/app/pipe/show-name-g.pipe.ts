import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { productGroups } from '../Model/productGroups';
import { ProductGroupService } from '../service/product-group.service';

@Pipe({
  name: 'showNameG'
})
export class ShowNameGPipe implements PipeTransform {
constructor(private groupService:ProductGroupService){}
groups:productGroups[];
  transform(value: number, ...args: unknown[]):unknown {
    this.groups=this.groupService.groups;
for(let i=0; i<this.groups.length;i++)
{
  if(this.groups[i].codeGroups==value)
  return this.groups[i].naneGroups;
}
return null;
  }


  

}
