import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FaqsService } from './faqs.service';
@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FaqsComponent implements OnInit {
   @ViewChild('scrollMe', { static: false }) private myScrollContainer: ElementRef;

  products: any;
  
  constructor(private dataServiceFaq: FaqsService) { }

  ngOnInit() {

    if (!this.products) {
      this.dataServiceFaq.sendGetRequest().subscribe((res: any) => {

        this.products = res['data'];
        localStorage.setItem('Faqproducts', JSON.stringify(this.products));
      });
    }
    else { 
      this.products = JSON.parse(localStorage.getItem('Faqproducts' || "[]"));
    }
  }


}
