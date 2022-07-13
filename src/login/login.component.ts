import { Component, OnInit, Injectable } from '@angular/core';

import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router, CanActivate } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthGuard } from '../models/auth';
import { User, UserPerm } from '../models/user';
import { FormGroup, FormControl ,ReactiveFormsModule, Validators} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginSmsComponent } from '../login-sms/login-sms.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginComponent],
  
})

export class LoginComponent    { 
  private baseUrl = environment.baseApiUrl + 'FleetControl/';
  form :FormGroup
  disa:boolean=false;
  constructor(private auth:AuthGuard,private router: Router,private modalService: NgbModal) { 
   // window.addEventListener('keydown', (this.Login), true);
   this.form =new FormGroup({
    username:new   FormControl(null, [Validators.minLength(2) , Validators.required ]),
    password:  new   FormControl(null, [Validators.minLength(2) , Validators.required])
   })
  }
 
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.form.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
}
// riggerLog(e)    { 
   

//   if(e.code === 'Enter') {
//     this.Login('')
//   }
// }
  Login()
  {
    // if(e.code != 'Enter' && e.code != 'NumpadEnter' && e!='') {
    //   return;
    // }
    this.disa=false
      this.auth.login(this.form.value.username, this.form.value.password)
      .pipe(
        tap(user => {
          if (user.Success) {

            this.auth.saveUser(user.Value)
             
            {
              var s=this.auth.GetUserRole
             if(s=="כניסה"|| s=="יציאה") 
             this.router.navigate(['sender']);
             
            else if(this.detectMob())
            this.router.navigate(['mobile']);
            else
            this.router.navigate(['home']);
            }
            // Main page
          } else {
            this.disa=true
             Swal.fire('',user.Message, 'error');
            //this.router.navigate(['login']); // Main page
          }
        } ,(err) => {
          
          Swal.fire('', 'טעינת נסיעות נכשלה', 'error');
         
      })
        
      )
    .subscribe();
  }
  detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i,
        /Mobile/i
    ];
  
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    }) 
  }
  IsComputeLogin(sms:string)
  {
  this.auth.IsComputeLogin( sms ,this.auth.User().token)
  .pipe(
    tap(user => {
      if (user.Success) {
        this.auth.saveUser(user.Value)
        if(this.detectMob())
        this.router.navigate(['mobile']);
        else
        this.router.navigate(['home']);
       
        // Main page
      } else {
        
        const modalRef = this.modalService.open(LoginSmsComponent, { size: 'sm' });
              modalRef.componentInstance.smscode.subscribe((sms) => {
                this.IsComputeLogin(sms);
                 
              })
      }
    } ,(err) => {
      
      Swal.fire('', 'טעינת נסיעות נכשלה', 'error');
     
  })
    
  )
.subscribe();
  }
}
