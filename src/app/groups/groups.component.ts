import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { productGroups } from '../Model/productGroups';
import { ProductGroupService } from '../service/product-group.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  collector1:productGroups=new productGroups();
  public myForm:FormGroup;
  flag:boolean=false;
  flag2:boolean=true;
  g:productGroups=new productGroups();
  s:number;
  flag1:boolean=false;
  groups:productGroups[];
  flag111:boolean=false;
  constructor(private groupsService:ProductGroupService) { }

  ngOnInit(): void {
    this.myForm=new FormGroup({
      codeGroup:new FormControl('',[Validators.required]),
      nameGroup:new FormControl('',[Validators.required]),
    });
    this.groupsService.GetAllGroup().subscribe(data=>this.groups=data,err=>console.log(err))
  }
  editField: string;
  

  awaitingPersonList: Array<any>= [];

  //מחיקת מלקט
  remove(code:number) {
  this.groupsService.DeleteGroup(code).subscribe(data=>this.groups=data,err=>alert(err));
  }
  //הוספת מלקט
  AddCollector()
  {

   this.groupsService.AddGroup(this.g).subscribe(data=>{this.groups=data},err=>{alert("sorry...")});
   this.flag=false;
   this.flag2=true;
  }
 //הוספת שורה
  add() {
    this.flag2=false;
   this.flag=true;
   this.flag111=true;
  }
//עדכון מלקט
update()
{
this.groupsService.UpdateGroup(this.g,this.g.codeGroups).subscribe(data=>this.groups=data,err=>console.log(err));
this.flag1=false;
this.flag2=true;
}
update1(code:number,co:productGroups)
{
this.flag111=true;
this.g=co;
this.flag1=true;
this.flag2=false;
this.s=code;
}
}
