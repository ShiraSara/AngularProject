import { HttpClient, HttpEventType } from '@angular/common/http';
import { Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { storage } from '../Model/storage';
import { StorageService } from '../service/storage.service';
import { EventEmitter } from 'events';

import { MangerSrviceService } from '../service/manger-srvice.service';

@Component({
  selector: 'app-uplode-map',
  templateUrl: './uplode-map.component.html',
  styleUrls: ['./uplode-map.component.scss']
})
export class UplodeMapComponent implements OnInit {

  public progress: number;
  selectFile:File=null;
  x:number;
  y:number;
  public myForm:FormGroup;
  url?: string="";
  s:storage;
  isShow:boolean=false
  validatingForm: FormGroup;
  c:number=3;
  showModal:boolean=false;
  validatingForm1:FormGroup;
  constructor(private storageService:StorageService,private r:Router,private http:HttpClient,private mangarService:MangerSrviceService) { }
 
  
  ngOnInit(){
  this.validatingForm = new FormGroup({
    nameStorage: new FormControl('', Validators.required)
  });
  }
  get input() { return this.validatingForm.get('max'); }
  public message: string="";
  @Output() public onUploadFinished = new EventEmitter();

//שמירת התמונה בשרת
public uploadFile = () => {
  const formData = new FormData();
  formData.append('file', this.selectFile, this.selectFile.name);
  this.http.post('https://localhost:44353/api/Uploade', formData, {reportProgress: true, observe: 'events'})
    .subscribe(event => {
      if (event.type === HttpEventType.UploadProgress)
        this.progress = Math.round(100 * event.loaded / event.total);
      else if (event.type === HttpEventType.Response) {
        this.message = 'ההעלאה הצליחה.';
        this.onUploadFinished.emit(event.body.toString());
      }
    });
}
//החזרת איקס ו וואי של מפה
getPercentage(elem:any)
{
this.x = elem.offsetX;
this.y= elem.offsetY;
document.getElementById("x").innerText+=this.x;
document.getElementById("y").innerText+=this.y;
}

//הצגת התמונה ברגע שהיא נבחרת
onSelectFile(event:any) { // called each time file input changes
  if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();
this.selectFile=event.target.files[0];
    reader.readAsDataURL(event.target.files[0]); // read file as data url

    reader.onload = (event) => { // called once readAsDataURL is completed
      this.url = event.target?.result?.toString();
    }
   this.selectFile=event.target.files[0];
  }

}

//הוספת מחסן לשרת
AddStorage()
{
  this.s=new storage(undefined,this.validatingForm.value.nameStorage,this.x,this.y);
  console.log(this.s);
  this.storageService.AddStorage(this.s).subscribe(data=>alert("המחסן הוסף בהצלחה לרשימת המחסנים"),err=>alert("בעייה בחיבור לשרת, המחסן לא הוסף"))
}
//העלאת קובץ מחסנים
public uploadFile1 = () => {
  const formData = new FormData();
  formData.append('file', this.selectFile, this.selectFile.name);
  this.http.post('https://localhost:44353/api/Uploade/UploadDataStorage', formData, {reportProgress: true, observe: 'events'})
    .subscribe(event => {
      if (event.type === HttpEventType.UploadProgress)
        this.progress = Math.round(100 * event.loaded / event.total);
      else if (event.type === HttpEventType.Response) {
        this.message = 'ההעלאה הצליחה.';
        alert("מחסןניםם")
        this.onUploadFinished.emit(event.body.toString());
      }
    });
}
//העלאת קובץ מעברים
public uploadFile2 = () => {
  const formData = new FormData();
  formData.append('file', this.selectFile, this.selectFile.name);
  this.http.post('https://localhost:44353/api/Uploade/UploadDataIntersection', formData, {reportProgress: true, observe: 'events'})
    .subscribe(event => {
      if (event.type === HttpEventType.UploadProgress)
        this.progress = Math.round(100 * event.loaded / event.total);
      else if (event.type === HttpEventType.Response) {
        this.message = 'ההעלאה הצליחה.';
        alert("מעברים")
        this.onUploadFinished.emit(event.body.toString());
      }
    });
}
}
