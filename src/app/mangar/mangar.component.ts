
import { Component,OnInit } from '@angular/core'; 
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { storage } from '../Model/storage';
import { StorageService } from '../service/storage.service';





@Component({
  selector: 'app-mangar',
  templateUrl: './mangar.component.html',
  styleUrls: ['./mangar.component.css']
})
export class MangarComponent implements OnInit {

  public myForm:FormGroup;
  flag:boolean=false;
  url?: string="";
  flag1:boolean=true;
  s:storage;
  isShow:boolean=false
  validatingForm: FormGroup;
  showFiller = false;
  c:number=3;

  flag3:boolean=false;
  showModal:boolean=false;
  flag2:boolean=false;
  formFlag:boolean=true;
  validatingForm1:FormGroup;
  constructor(private storageService:StorageService,private r:Router) { }
 
  
  ngOnInit(){
  this.validatingForm = new FormGroup({
    nameStorage: new FormControl('', Validators.required)
  });
  }
  get input() { return this.validatingForm.get('max'); }


openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

 closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}
}
