import { Component, OnInit } from '@angular/core';
import { CollectorsService } from '../service/collectors.service';
import { MangerSrviceService } from '../service/manger-srvice.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  
  constructor(public collectorService:CollectorsService) { }

  ngOnInit(){

  }



}
