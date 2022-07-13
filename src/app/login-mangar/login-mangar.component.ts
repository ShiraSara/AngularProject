import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CollectorsService } from '../service/collectors.service';
import { MangerSrviceService } from '../service/manger-srvice.service';

@Component({
  selector: 'app-login-mangar',
  templateUrl: './login-mangar.component.html',
  styleUrls: ['./login-mangar.component.scss']
})
export class LoginMangarComponent implements OnInit {

  public myForm:FormGroup;
  public validatingForm:FormGroup;
  constructor(private mangarService:MangerSrviceService,private r:Router,private collServ:CollectorsService) { }

  ngOnInit(): void {
    this.myForm=new FormGroup({
      userName:new FormControl('',[Validators.required,Validators.pattern(/A-Za-z/)]),
      password:new FormControl('',[Validators.required])
    });
    this.validatingForm = new FormGroup({
      modalFormSubscriptionName: new FormControl('', Validators.required),
      modalFormSubscriptionEmail: new FormControl('', Validators.email)
    });
  }

onSubmit(form:FormGroup)
{
this.mangarService.mangarN.name=form.value.userName;
this.mangarService.mangarN.password=form.value.password;
if(this.mangarService.mangarN.name=="admin" && this.mangarService.mangarN.password=="admin")
{
alert("ברוך הבא")
document.getElementById("title").innerHTML="מנהל"
this.mangarService.flagEnter=false;
this.r.navigate(['/mangar'])
sessionStorage.setItem("admin","מנהל");
this.collServ.thisA()
this.collServ.isShow=false;
this.collServ.thisCollector.username="admin";
this.collServ.thisCollector.password="admin";
}
else
alert("שם משתמש או סיסמא אינם נכונים");
}


}
