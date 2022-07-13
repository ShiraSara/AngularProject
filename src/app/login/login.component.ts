import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { collector } from '../Model/collector';
import { CollectorsService } from '../service/collectors.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username:string;
  password:string;
  flag:boolean=false;
  newCollector:collector=new collector();
  constructor(private r:Router) { }

  ngOnInit(): void {
  }

 mangar()
 {
this.r.navigate(['/loginMangar']);
 }
 collector()
 {
  this.r.navigate(['/collectors']);
 }
  
}