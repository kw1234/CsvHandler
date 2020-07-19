import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
'rxjs/add/operator/toPromise';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
//import 'rxjs/add/operator/map';
//import {Observable} from 'rxjs/Rx';
import {timeout} from 'rxjs/operators';
'rxjs/Rx';

@Injectable()
export class CsvService {

    resultsLength = 0;
    isLoadingResults = false;
    isRateLimitReached = false;

    private fileNamesStore = [];
    private fileNamesSubject = new Subject();
    fileNames = this.fileNamesSubject.asObservable();

    private dictRowsStore = [];
    private dictRowsSubject = new Subject();
    dictRows = this.dictRowsSubject.asObservable();

    private colNamesStore = [];
    private colNamesSubject = new Subject();
    colNames = this.colNamesSubject.asObservable();

    private pageDataStore = {};
    private pageDataSubject = new Subject();
    pageData = this.pageDataSubject.asObservable();

    constructor(private http: Http) {}

    BASE_URL = 'https://cvshandler.wl.r.appspot.com/api';

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
	.pipe(timeout(60000))
        .subscribe(response => {
               let dict = response.json();
	       console.log(dict);
	       this.resultsLength = dict.rowCount;

	       this.colNamesStore = dict.colNames;
	       this.colNamesSubject.next(this.colNamesStore);

	       this.dictRowsStore = dict.dictRows;
               this.dictRowsSubject.next(this.dictRowsStore);

	       this.loading = false;
     	 },  error => {
              console.log(`unable to download file with error: ${error}`);
           });
    }

    downloadFileGet(downloadData) {
        this.loading = true;
        this.http.get(this.BASE_URL+'/download', downloadData)
        .subscribe(response => {
               let dict = response.json();
               console.log(dict);
               this.resultsLength = dict.fileRows.length;

               this.colNamesStore = dict.colNames;
               this.colNamesSubject.next(this.colNamesStore);

               this.dictRowsStore = dict.dictRows;
               this.dictRowsSubject.next(this.dictRowsStore);

               this.loading = false;
         },  error => {
              console.log(`unable to download file with error: ${error}`);
           });
    }

    deleteFile(fileName) {
       console.log("deleting "+fileName);
       this.http.post(this.BASE_URL+'/delete', {"fileName": fileName})
        .subscribe(response => {
               console.log(response);
	       this.getFileNames();
           }, error => {
              console.log(`unable to delete file with error: ${error}`);
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

    getPageData(index) {
       console.log(index);
       if (index > this.dictRowsStore.length-1) {
          console.log("Error: index out of dictRowsStore bounds");
	  return [];
       }
       return this.dictRowsStore[index];
    }

    getPageReq(index) {
       console.log(index);
       this.http.post(this.BASE_URL+'/getPage', {"index": index})
        .subscribe(response => {
           console.log(response);
           this.pageDataStore = response.json();
           this.pageDataSubject.next(this.pageDataStore);
        }, error => {
           console.log(`unable to get page data with error: ${error}`);
        });
    }

}