import { Component } from '@angular/core';
import {CsvService} from './csv.service';

@Component({
  selector: 'upload',
  templateUrl: './upload.component.html'
})

export class UploadComponent {

       constructor(public csvServ: CsvService) {}

       downloadData = {
           path: ''
       }

       fileToUpload: File = null;

       wordData = {
           word: ''
       }

       fileInput() {
	  console.log(this.fileToUpload);
	  this.csvServ.uploadFile(this.fileToUpload);
       }

       handleFileInput(files: FileList) {
          //console.log(files);
	  this.fileToUpload = files.item(0);
       }

       downloadFile() {
          console.log(this.downloadData);
          this.csvServ.downloadFile(this.downloadData);
       }
}
