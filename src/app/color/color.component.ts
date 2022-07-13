import { Component, OnInit } from '@angular/core';
import { colors } from '../Model/colors';
import { ColorService } from '../service/color.service';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent implements OnInit {

  flag:boolean=false;
  flag2:boolean=true;
  el:colors=new colors();
  flag1:boolean=false;
  element:colors[];
  s:number;
  params:number;
  constructor(private colorService:ColorService) { }

  ngOnInit(): void {
    this.colorService.GetColors().subscribe(data=>this.element=data,err=>console.log(err))
  }
  editField: string;

  awaitingPersonList: Array<any>= [];

  //מחיקת צבע
  remove(code:number) {
  this.colorService.DeleteColor(code).subscribe(data=>this.element=data,err=>console.log(err))
  }
  //הוספת צבע
  AddColor()
  {
    console.log(this.el)
   this.colorService.AddColor(this.el).subscribe(data=>{this.element=data},err=>{console.log(err)});
   this.flag=false;
   this.flag2=true;
  }
 //הוספת שורה
  add() {
    this.flag2=false;
   this.flag=true;
  }
//עדכון צבע
update()
{
this.colorService.UpdateColor(this.s,this.el).subscribe(data=>console.log(data),err=>console.log(err));
this.flag1=false;
}
update1(code:number,co:colors)
{
this.s=code;
this.el=co;
this.flag1=true;
}


}
