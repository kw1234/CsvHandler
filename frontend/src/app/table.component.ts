import { Component } from '@angular/core';
import {CsvService} from './csv.service';

@Component({
  selector: 'fileTable',
  templateUrl: './table.component.html'
})

export class TableComponent {

       constructor(public csvServ: CsvService) {}

}      