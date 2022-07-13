import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { collector } from '../Model/collector';
import { CollectorsService } from '../service/collectors.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {


  constructor(private serviceCollector:CollectorsService,private router:Router) { }
  collector:collector=new collector();

  ngOnInit(): void {

  }
  registration()
  {
    let a;
  this.serviceCollector.Index().subscribe(data=>{this.collector.codeCollector=data,this.change(data)},err=>console.log(err));
  }
  change(code:number)
  {
this.collector.codeCollector=code;
this.serviceCollector.AddCollector(this.collector).subscribe(data=>{alert("שלום"+this.collector.nameCollector+"- "+"הוספת בהצלחה למלקטים במפעל "); this.router.navigate(['/login']);},err=>alert("בעייה בהתקשרות אנא נסה שנית"))
  }
}
