import { HttpClient, HttpEventType } from '@angular/common/http';
import { EventEmitter, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { orders } from '../Model/orders';
import { UplodeService } from '../service/uplode.service';

@Component({
  selector: 'app-read-excel',
  templateUrl: './read-excel.component.html',
  styleUrls: ['./read-excel.component.scss']
})
export class ReadExcelComponent implements OnInit {

  public progress: number;
  flag3:boolean=true;
  public message: string="";
  @Output() public onUploadFinished = new EventEmitter();
  constructor(private http:HttpClient,private uplodeService:UplodeService) { }

  ngOnInit(): void {
  }
  orderList:orders[];
  file:File;
  arrayBuffer:any;
  filelist:any;
  selectFile:File=null;
  addfile(event)     
  {    
  this.file= event.target.files[0];
  this.selectFile=event.target.files[0]     
  let fileReader = new FileReader();    
  fileReader.readAsArrayBuffer(this.file);     
  fileReader.onload = (e) => {    
      this.arrayBuffer = fileReader.result;    
      var data = new Uint8Array(this.arrayBuffer);    
      var arr = new Array();    
      for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);    
      var bstr = arr.join("");    
      var workbook = XLSX.read(bstr, {type:"binary"});    
      var first_sheet_name = workbook.SheetNames[0];    
      var worksheet = workbook.Sheets[first_sheet_name];    
      console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));    
        var arraylist = XLSX.utils.sheet_to_json(worksheet,{raw:true});      
            this.orderList=(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
            for(let i=0; i<this.orderList.length-1;i++)
            {
              var str = "2013/1/16";
              var strToDate = new Date(str);
              console.log(strToDate)
            var a=new Date(this.orderList[i].dateOrder).getTime();
            var b=new Date(this.orderList[i].executionDate).getTime();
            this.orderList[i].dateOrder=new Date(this.orderList[i].dateOrder);
            this.orderList[i].executionDate=new Date(this.orderList[i].executionDate);
            if(i==0 || i==1)
            {
            this.orderList[i].dateOrder=new Date((a - 25569)*86400*1000);
            this.orderList[i].executionDate=new Date((b - 25569)*86400*1000);
            }
            }
            console.log(this.orderList)
  }    
}    
//העלת קובץ הזמנות לשרת
public uploadFile1 = () => {
  const formData = new FormData();
  formData.append('file', this.selectFile, this.selectFile.name);
  this.http.post('https://localhost:44353/api/Uploade/UploadExcel', formData, {reportProgress: true, observe: 'events'})
    .subscribe(event => {
      if (event.type === HttpEventType.UploadProgress)
        this.progress = Math.round(100 * event.loaded / event.total);
      else if (event.type === HttpEventType.Response) {
        this.message = 'הקובץ הועלה בהצלחה';
        this.onUploadFinished.emit(event.body.toString());
      }
    });
}


}
