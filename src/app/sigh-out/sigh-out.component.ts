import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { collector } from '../Model/collector';
import { CollectorsService } from '../service/collectors.service';

@Component({
  selector: 'app-sigh-out',
  templateUrl: './sigh-out.component.html',
  styleUrls: ['./sigh-out.component.css']
})
export class SighOutComponent implements OnInit {

  col:collector=new collector();
  constructor(private collectorService:CollectorsService,private router:Router) { }

  ngOnInit(): void {
    this.col=this.collectorService.ReturnThisCollector();
  }
  sighOut()
  {
    this.collectorService.CollectorSighOut();
    this.collectorService.isShow=true;
    this.collectorService.name="";
    this.ngOnInit();
    //this.router.navigate(['/enter'])
  }

}
