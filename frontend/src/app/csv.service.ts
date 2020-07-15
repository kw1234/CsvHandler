import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
'rxjs/add/operator/toPromise';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
//import 'rxjs/add/operator/map';
//import {Observable} from 'rxjs/Rx';

'rxjs/Rx';

@Injectable()
export class CsvService {

    private fileNamesStore = [];

    private fileNamesSubject = new Subject();

    fileNames = this.fileNamesSubject.asObservable();

    private textStore = [];

    private textSubject = new Subject();

    text = this.textSubject.asObservable();

    constructor(private http: Http) {}

    BASE_URL = 'http://localhost:8080/api';

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
        this.http.post(this.BASE_URL+'/download', downloadData)
        .subscribe(response => {
               console.log(response.json());
     	 });
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