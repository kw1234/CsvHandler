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

    private textStore = [];

    private textSubject = new Subject();

    text = this.textSubject.asObservable();

    constructor(private http: Http) {}

    BASE_URL = 'http://localhost:8080/api';

    uploadFile(fileData) {
        //console.log(fileData);
	//const formData: FormData = new FormData();
        //formData.append('fileKey', fileData, fileData.name);
	//console.log(formData);



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
           }, error => {
              console.log(`unable to upload file with error: ${error}`);
           });

    }

}