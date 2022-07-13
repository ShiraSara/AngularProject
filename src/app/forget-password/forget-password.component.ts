import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CollectorsService } from '../service/collectors.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  constructor(private collectorService:CollectorsService,private r:Router){}
  validatingForm: FormGroup;
  flag:boolean=false;
  ngOnInit() {
    this.validatingForm = new FormGroup({
      modalFormAvatarPassword: new FormControl('', Validators.required)
    });
  }

  get modalFormAvatarPassword() {
    return this.validatingForm.get('modalFormAvatarPassword');
  }
  send()
  {
    this.collectorService.RestorationPassword(this.validatingForm.value.modalFormAvatarPassword).subscribe(data=>{this.flag=data,this.check()},err=>console.log(err))
  }
 
  check()
  {
    if(this.flag==true)
    {
    alert("הסיסמא נשלחה לכתובת המייל שלך בהצלחה הנך מועבר חזרה לעמוד ההתחברות");
    this.r.navigate(['/login']);
    }
    else
    alert("לא הצלחנו למצוא את שם המשתמש שלך אנא נסה שנית")
  }
}
