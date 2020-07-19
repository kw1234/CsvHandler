import { Component, ViewChild, AfterViewInit } from '@angular/core';
import {CsvService} from './csv.service';
import {MatPaginator} from '@angular/material/paginator';

import {HttpClient} from '@angular/common/http';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'fileTable',
  templateUrl: './table.component.html'
})

export class TableComponent implements AfterViewInit {

       dataSource = []

       canView = this.dataSource.length > 0;

       @ViewChild(MatPaginator) paginator: MatPaginator;
       constructor(public csvServ: CsvService) {
          this.csvServ.getPageReq(0);
       }

       ngOnInit() {
	  this.csvServ.getPageReq(0);
       }

       ngAfterViewInit() {
          // If the user changes the sort order, reset back to the first page.

       }

       onPageFired(event){
	  this.csvServ.getPageReq(event.pageIndex);
       }
}    