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

       data = this.getData();
  
       getData() {
          var countries = 'US,Germany,UK,Japan,Italy,Greece'.split(','),
          data = [];
          for (var i = 0; i < countries.length; i++) {
             data.push({
             country: countries[i],
             sales: Math.random() * 10000,
             expenses: Math.random() * 5000,
             downloads: Math.round(Math.random() * 20000),
             });
          }
   	  return new CollectionView(data);
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