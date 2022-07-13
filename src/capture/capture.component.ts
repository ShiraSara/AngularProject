import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, ViewChild, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-capture',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.css']
})
export class CaptureComponent implements OnInit {
  @ViewChild('result', { static: false }) resultElement: ElementRef;
  @ViewChild("video", { static: false })
  public video: ElementRef;
  @ViewChild("canvas", { static: false })

  public canvas: ElementRef;
  @Output() barcode: EventEmitter<any> = new EventEmitter();
  elementType = 'url';

  private getLocInterval: any;

  public imagePath;
  value: any;
  public captures: Array<any>;
  constructor(public activeModal: NgbActiveModal, private renderer: Renderer2) { this.captures = []; }

  ngOnInit() {
  }
  ngAfterViewInit() {


    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } }).then(stream => {
        // this.video.nativeElement.src = window.URL.createObjectURL(stream);
        this.video.nativeElement.srcObject = stream;

        this.video.nativeElement.play();
        console.log("stars camera")
        this.getLocInterval = setInterval(this.capture, 700);
      }, (eeee => {
        console.log(eeee.message)

      }));
    }
  }
  public capture = () => {

    var img = this.video.nativeElement
    var canvas = this.canvas.nativeElement
    var hRatio = canvas.width / img.videoWidth;
    var vRatio = canvas.height / img.videoHeight;
    var ratio = Math.min(hRatio, vRatio);
    var context = canvas.getContext("2d").drawImage(img, 0, 0, img.videoWidth, img.videoHeight, 0, 0, img.videoWidth * ratio, img.videoHeight * ratio);
    // .drawImage(img, 0, 0, 640, 480);
    //this.captures.push(this.canvas.nativeElement.toDataURL("image/png"));

    this.value = this.canvas.nativeElement.toDataURL("image/jpeg")//reader.result;  


  }
  //   displayAsImage(file) {
  //   var imgURL = URL.createObjectURL(file),
  //       img = document.createElement('img');

  //   img.onload = function() {
  //     URL.revokeObjectURL(imgURL);
  //   };

  //   this.value= imgURL;

  // }
  public close() {
    if (this.video && this.video.nativeElement)
      if (this.video.nativeElement.srcObject)
        this.video.nativeElement.srcObject.getTracks().forEach(function (track) {
          if (track.readyState == 'live' && track.kind === 'video') {
            track.stop();
          }
        });
    this.barcode.emit('');

  }
  render(e) {
    console.log(e.result)

    this.barcode.emit(e.result);
    if (this.video && this.video.nativeElement)
    if (this.video.nativeElement.srcObject)
    this.video.nativeElement.srcObject.getTracks().forEach(function (track) {
      if (track.readyState == 'live' && track.kind === 'video') {
        track.stop();
      }
    });
  }

}
