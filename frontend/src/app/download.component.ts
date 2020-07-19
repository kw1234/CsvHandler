import { Component } from '@angular/core';
import {CsvService} from './csv.service';
import {TableComponent} from './table.component';

// import Wijmo components
import { CollectionView } from 'wijmo/wijmo';

@Component({
  selector: 'download',
  templateUrl: './download.component.html'
})

export class DownloadComponent {

       constructor(public csvServ: CsvService) {}

       ngOnInit() { this.getFileNames(); }

       downloadData = {
           path: ''
       }

       fileToUpload: File = null;

       wordData = {
           word: ''
       }
       
       getFileNames() {
          this.csvServ.getFileNames();
       }

       downloadFile() {
         console.log(this.downloadData);
          this.csvServ.downloadFile(this.downloadData);
       }

       downloadFileParam(fileName) {
          console.log(fileName);
          this.csvServ.downloadFile({path: fileName});
       }
       
       deleteFile(fileName) {
          this.csvServ.deleteFile(fileName);
       }
}      