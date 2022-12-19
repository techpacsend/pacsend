import { Component, OnInit } from '@angular/core';
import { ALlSenderAdService } from './allsenderads.service';

@Component({
  selector: 'app-allsenderads',
  templateUrl: './allsenderads.component.html',
  styleUrls: ['./allsenderads.component.css']
})
export class AllsenderadsComponent implements OnInit {

  products = [];

  constructor(private dataService: ALlSenderAdService) { }

  ngOnInit() {

    this.dataService.sendGetRequest().subscribe((data: any[])=>{
      this.products = data['data'];
    })
  }

}
