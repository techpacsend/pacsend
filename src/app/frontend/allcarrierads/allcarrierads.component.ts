import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-allcarrierads',
  templateUrl: './allcarrierads.component.html',
  styleUrls: ['./allcarrierads.component.css']
})
export class AllcarrieradsComponent implements OnInit {

  products = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {

    this.dataService.sendGetRequest().subscribe((data: any[])=>{
      this.products = data['data'];
    })
  }

}
