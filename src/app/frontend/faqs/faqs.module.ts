
import { SortDataPipe } from './../../sort-data.pipe';
import { AllcarrieradsComponent } from './../allcarrierads/allcarrierads.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AgmCoreModule } from '@agm/core';
// import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { MatDialogModule } from '@angular/material/dialog';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgSelectModule } from '@ng-select/ng-select';
import { LyThemeModule } from '@alyle/ui';
import { LyResizingCroppingImageModule } from '@alyle/ui/resizing-cropping-images';
import { LySliderModule } from '@alyle/ui/slider';
import { LyIconModule } from '@alyle/ui/icon';
import { LyButtonModule } from '@alyle/ui/button';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { NgxStarsModule } from 'ngx-stars';
import { NgSelectizeModule } from 'ng-selectize';
import { SharedModule } from 'src/app/shared/shared.module';
import { FAQSRoutingModule } from './faqs-routing.module';
import { FaqsComponent } from './faqs.component';

@NgModule({
  declarations: [
    FaqsComponent,
    // SortDataPipe,
    // LoaderComponent,
    // SpinnerComponent,
    // ScrollToBottomDirective,

  ],
  imports: [
    CommonModule,
      SharedModule,
      FAQSRoutingModule,
     NgxShimmerLoadingModule,
     ShareButtonsModule.withConfig({
       debug: true
     }),
     NgxDropzoneModule,
     NgxSpinnerModule,

     CarouselModule,
     AngularFireDatabaseModule,
     Ng2SearchPipeModule,
     HttpClientModule,
     CommonModule,
     FormsModule,
     ImageCropperModule,
     ReactiveFormsModule,
     NgxDropzoneModule,
     NgxSpinnerModule,
     AgmCoreModule.forRoot({
       apiKey: 'AIzaSyDPif6UymMRu1GAQEWeoQHhEH0faONi6yI',
       libraries: ["places", "geometry"]

     }),
     InfiniteScrollModule,
     MatDialogModule,
     NgZorroAntdModule,
     NgSelectModule,
     LyThemeModule.setTheme('minima-light'),
     LyResizingCroppingImageModule,
     LySliderModule,
     LyButtonModule,
     LyIconModule,
     LyToolbarModule,
     FormsModule,
     AngularFireDatabaseModule,

     NgxStarsModule,
     NgSelectModule,
     NgSelectizeModule,
  ]
})
export class FAQSModule {

}
