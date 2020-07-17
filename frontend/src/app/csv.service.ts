import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
'rxjs/add/operator/toPromise';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
//import 'rxjs/add/operator/map';
//import {Observable} from 'rxjs/Rx';

'rxjs/Rx';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Injectable()
export class CsvService {
    dataSource = ELEMENT_DATA;

    resultsLength = 0;
    isLoadingResults = false;
    isRateLimitReached = false;

    private fileNamesStore = [];
    private fileNamesSubject = new Subject();
    fileNames = this.fileNamesSubject.asObservable();

    private textStore = [];
    private textSubject = new Subject();
    text = this.textSubject.asObservable();

    private fileRowsStore = [];
    private fileRowsSubject = new Subject();
    fileRows = this.fileRowsSubject.asObservable();

    private dictRowsStore = [];
    private dictRowsSubject = new Subject();
    dictRows = this.dictRowsSubject.asObservable();

    private colNamesStore = [];
    private colNamesSubject = new Subject();
    colNames = this.colNamesSubject.asObservable();

    constructor(private http: Http) {}

    BASE_URL = 'http://localhost:8080/api';

    loading = false;

    uploadFile(fileData) {
	let formData:FormData = new FormData();
        formData.append('file', fileData, fileData.name);
        let headers = new Headers();
        //headers.append('Content-Type', 'multipart/form-data');
	//headers.append('enctype', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        let options = new RequestOptions({ headers: headers });

	console.log(formData);
        this.http.post(this.BASE_URL+'/upload', formData, options)
	.subscribe(response => {
               console.log(response);
               //this.textStore = [response.json()];
               //this.textSubject.next(this.textStore);
	       this.getFileNames();
           }, error => {
              console.log(`unable to upload file with error: ${error}`);
           });

    }

    downloadFile(downloadData) {
        this.loading = true;
        this.http.post(this.BASE_URL+'/download', downloadData)
        .subscribe(response => {
               let dict = response.json();
	       this.textStore = [dict];
               this.textSubject.next(this.textStore);

	       this.fileRowsStore = dict.fileRows;
               this.fileRowsSubject.next(this.fileRowsStore);
	       this.resultsLength = dict.fileRows.length;

	       this.colNamesStore = dict.colNames;
	       this.colNamesSubject.next(this.colNamesStore);

	       this.dictRowsStore = dict.dictRows;
               this.dictRowsSubject.next(this.dictRowsStore);

	       console.log(this.textStore);
	       this.loading = false;
     	 });
    }

    deleteFile(fileName) {
       console.log("deleting "+fileName);
    }

    getFileNames() {
        this.http.get(this.BASE_URL+'/getFileNames')
	.subscribe(response => {
	   console.log(response);
	   this.fileNamesStore = [response.json()];
           this.fileNamesSubject.next(this.fileNamesStore);
	   console.log(this.fileNamesStore);
	}, error => {
	   console.log(`unable to get file names with error: ${error}`);
	});
    }

}