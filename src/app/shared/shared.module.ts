import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ByPassSecurityScriptPipe } from '../Directives/ByPassSecurityScript.pipe';
import { ByPassSecurityUrlPipe } from '../Directives/ByPassSecurityUrl.pipe';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormatdatesPipe } from '../pipe/formatdates.pipe';
@NgModule({
  declarations: [
    ByPassSecurityUrlPipe,
    ByPassSecurityScriptPipe,
    FormatdatesPipe
  ],
  imports: [
    CommonModule,
  ],
exports: [
  NgxShimmerLoadingModule,
  ReactiveFormsModule,
  HttpClientModule,
  FormsModule,
  NgxShimmerLoadingModule,
  ByPassSecurityScriptPipe,
  ByPassSecurityUrlPipe,
  Ng2TelInputModule,
  GooglePlaceModule,
  NgxUiLoaderModule,
  FormatdatesPipe
]
})
export class SharedModule {

  constructor(){

  }
}
