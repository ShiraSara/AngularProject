import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { collector } from '../Model/collector';
import { CollectorsService } from '../service/collectors.service';

@Component({
  selector: 'app-collector-table',
  templateUrl: './collector-table.component.html',
  styleUrls: ['./collector-table.component.scss']
})
export class CollectorTableComponent implements OnInit {

  collector1:collector=new collector();
  public myForm:FormGroup;
  flag:boolean=false;
  flag2:boolean=true;
  c:collector=new collector();
  s:number;
  flag1:boolean=false;
  flag3:boolean=true;
  collectors:collector[];
  constructor(private serverCollector:CollectorsService) { }

  ngOnInit(){
    this.myForm=new FormGroup({
      codeCollector:new FormControl('',[Validators.required]),
      nameCollector:new FormControl('',[Validators.required]),
      userName:new FormControl('',[Validators.required]),
      email:new FormControl('',[Validators.required]),
      password:new FormControl('',[Validators.required])
    });
    this.serverCollector.GetAllCollector().subscribe(data=>this.collectors=data,err=>console.log(err))
  }
  editField: string;

    awaitingPersonList: Array<any> = [
   
    ];

    //מחיקת מלקט
    remove(codeCollector:number) {
    this.serverCollector.DeleteCollector(codeCollector).subscribe(data=>this.collectors=data,err=>alert(err));
    }
    //הוספת מלקט
    AddCollector()
    {
     this.serverCollector.AddCollector(this.c).subscribe(data=>{this.collectors=data},err=>{console.log(err)});
     this.flag=false;
     this.flag2=true;
     this.flag3=true;
    }
   //הוספת שורה
    add() {
      this.serverCollector.Index().subscribe(data=>this.c.codeCollector=data,err=>console.log(err))
      this.flag2=false;
     this.flag=true;
     this.flag3=false;
    }
//עדכון מלקט
update()
{
this.c.codeCollector=this.s;
this.serverCollector.UpdateCollector(this.s,this.c).subscribe(data=>this.collectors=data,err=>console.log(err));
this.flag1=false;
this.flag3=true;
}
update1(code:number,co:collector)
{
this.c=co;
this.flag1=true;
this.s=code;
this.flag3=false;
}
}
