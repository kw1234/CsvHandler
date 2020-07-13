import { Component } from '@angular/core';
import {CsvService} from './csv.service';

@Component({
  selector: 'upload',
  templateUrl: './upload.component.html'
})

export class UploadComponent {

       constructor(public csvServ: CsvService) {}

       fileData = {
           path: ''
       }

       fileToUpload: File = null;

       wordData = {
           word: ''
       }

       fileInput() {
          //this.csvServ.uploadFile(this.fileData);
	  console.log(this.fileToUpload);
	  this.csvServ.uploadFile(this.fileToUpload);
       }

       handleFileInput(files: FileList) {
          //console.log(files);
	  this.fileToUpload = files.item(0);
          //this.fileData.path = data.target.value;
       }
}
