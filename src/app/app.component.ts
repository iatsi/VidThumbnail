import { Component, AfterViewInit, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit,OnInit {
  title = 'talpro';
  filesToUpload:any;
  socket: any;
  envOb:any;
  constructor(){
    this.socket = io('http://localhost:49153');
  }
  
  SCs:any = [];

  ngOnInit(){
    this.envOb=environment.backendURL;
    console.log('envOb',this.envOb)
  }
  ngAfterViewInit(){
    this.socket.on('File generated', (msg) => {
        // console.log(msg)
        this.SCs.push(msg);
        console.log(this.SCs);
      });
  }



  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;

    console.log( fileInput.target.files);
    var str: string = environment.backendURL + 'upFile';
    this.upFile(str, [], this.filesToUpload).then((result:any) => {
      });
  }
  
  
  upFile(url: string, params: Array<string>, files: Array<File>) {
    let headers = new Headers();
    return new Promise((resolve, reject) => {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      for (var i = 0; i < files.length; i++) {
        formData.append("files", files[i], files[i].name);
        console.log('Primter',formData);
      }
      console.log('files.length',formData)

      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(xhr.response);
          } else {
            reject(xhr.response);
          }
        }
      }
      xhr.open("POST", url, true);
      xhr.send(formData);
    });
  }
}
