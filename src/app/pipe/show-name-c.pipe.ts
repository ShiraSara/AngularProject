import { Pipe, PipeTransform } from '@angular/core';
import { colors } from '../Model/colors';
import { ColorService } from '../service/color.service';

@Pipe({
  name: 'showNameC'
})
export class ShowNameCPipe implements PipeTransform {
  constructor(private colorService:ColorService){}

  colors:colors[];
  transform(value: number, ...args: unknown[]): unknown {
    this.colors=this.colorService.colors;
for(let i=0; i<this.colors.length;i++)
{
  debugger
  if(this.colors[i].codeColor==value)
  return this.colors[i].nameColor;
}
    return null;
  }

}
