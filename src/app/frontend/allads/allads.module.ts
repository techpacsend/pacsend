
import { SortDataPipe } from './../../sort-data.pipe';
import { ChatComponent } from './../chat/chat.component';
import { AlladsComponent } from './allads.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlladsRoutingModule } from './allads-routing.module';
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
import { ViewAdCarryComponent } from './view-ad-carry/view-ad-carry.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { JwPaginationComponent } from 'src/app/JwPagination.Component';
import { LoaderComponent } from '../loader/loader.component';
import { ViewsenderadsComponent } from '../myads/viewsenderads/viewsenderads.component';
import { ViewcarrieradsComponent } from '../myads/viewcarrierads/viewcarrierads.component';
import { SpinnerComponent } from '../myads/spinner/spinner.component';
import { StarsComponent } from '../stars/stars.component';
import { ScrollToBottomDirective } from 'src/app/scroll-to-bottom.directive';
import { ChangepasswordComponent } from '../changepassword/changepassword.component';
import { TripinfoComponent } from '../tripinfo/tripinfo.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
@NgModule({
  declarations: [
    AlladsComponent,
    ViewAdCarryComponent,
    ChatComponent,
    SortDataPipe,
    JwPaginationComponent,
    LoaderComponent,
    ViewsenderadsComponent,
    ViewcarrieradsComponent,
    SpinnerComponent,
    StarsComponent,
    ScrollToBottomDirective,
    ChangepasswordComponent,
    TripinfoComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AlladsRoutingModule,
     // AlladsModule,
     NgxShimmerLoadingModule,
     // ShareButtonsModule,
     ShareButtonsModule.withConfig({
       debug: true
     }),
     NgxDropzoneModule,
     NgxSpinnerModule,
    //  Ng2TelInputModule,
     CarouselModule,
    //  SocialLoginModule,
     AngularFireDatabaseModule,
     // ShareIconsModule,
     Ng2SearchPipeModule,
     HttpClientModule,
    //  NgbModule,
     CommonModule,
    //  BrowserModule,
    //  BrowserAnimationsModule,
     FormsModule,
     ImageCropperModule,
     ReactiveFormsModule,
     NgxDropzoneModule, 
     NgxSpinnerModule,
    //  Ng2TelInputModule,
    //  NgbModule,
    //  GoogleMapsModule,
     AgmCoreModule.forRoot({
       apiKey: 'AIzaSyDPif6UymMRu1GAQEWeoQHhEH0faONi6yI',
       libraries: ["places", "geometry"]

     }),
    //  GooglePlaceModule,
     InfiniteScrollModule,
     MatDialogModule,
     NgZorroAntdModule,
    //  BarRatingModule,
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
    NgMultiSelectDropDownModule,
  ]
})
export class AlladsModule {
constructor(){
  // abc
}

}
