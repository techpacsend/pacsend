import { AgmCoreModule } from '@agm/core';
import {
  LyThemeModule,
  LY_THEME
} from '@alyle/ui';
import { MinimaDark, MinimaLight } from '@alyle/ui/themes/minima';
import { APP_BASE_HREF,registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule
} from 'angularx-social-login';
import { en_US, NgZorroAntdModule, NZ_I18N } from 'ng-zorro-antd';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NumberOnlyDirective } from './Directives/numberOnly.directive';
import { AllModalComponent } from './frontend/all-modal/all-modal.component';
import { DefaultPageComponent } from './frontend/default-page/default-page.component';
import { ErrorComponent } from './frontend/error/error.component';
import { FooterComponent } from './frontend/footer/footer.component';
import { ForgotpassverificationComponent } from './frontend/forgotpassverification/forgotpassverification.component';
import { HeaderComponent } from './frontend/header/header.component';
import { IndexComponent } from './frontend/index/index.component';
import { SafePipe } from './frontend/index/safe.pipe';
import { LoginComponent } from './frontend/login/login.component';
import { SignupNextComponent } from './frontend/signup/signup-next.component';
import { SignupComponent } from './frontend/signup/signup.component';
import { TermsandconditionsComponent } from './frontend/termsandconditions/termsandconditions.component';
import { VerificationComponent } from './frontend/verification/verification.component';
import { SharedModule } from './shared/shared.module';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { NgSelectConfig, NgSelectModule, ɵs } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { SlugifyPipe } from './pipe/slugify.pipe';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { MyActivityComponent } from './frontend/my-activity/my-activity.component';
// import { FormatdatesPipe } from './pipe/formatdates.pipe';
export class GlobalVariables {
  testVal = '#00bcd4';
  Quepal = {
    default: `linear-gradient(135deg,#11998e 0%,#38ef7d 100%)`,
    contrast: '#fff',
    shadow: '#11998e'
  };
  SublimeLight = {
    default: `linear-gradient(135deg,#FC5C7D 0%,#6A82FB 100%)`,
    contrast: '#fff',
    shadow: '#B36FBC'
  };
  Amber = {
    default: '#ffc107',
    contrast: 'rgba(0, 0, 0, 0.87)'
  };
}

registerLocaleData(en);

const firebase = {

  apiKey: "AIzaSyBng5aMZyLDIfpoROHL8_8gIN_I61SuqrU",
  authDomain: "pacsend-316207.firebaseapp.com",
  databaseURL: "https://pacsend-316207-default-rtdb.firebaseio.com",
  projectId: "pacsend-316207",
  storageBucket: "pacsend-316207.appspot.com",
  messagingSenderId: "154897491633",
  appId: "1:154897491633:web:1cec7eae8e4eb5d874e490",
  measurementId: "G-Z6CL3Q8711"
}

@NgModule({

  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    IndexComponent,
    TermsandconditionsComponent,
    LoginComponent,
    SignupComponent,
    SignupNextComponent,
    VerificationComponent,
    ErrorComponent,
    AllModalComponent,
    ForgotpassverificationComponent,
    NumberOnlyDirective,
    SafePipe,
    DefaultPageComponent,
    SlugifyPipe,
    MyActivityComponent,
    // FormatdatesPipe,
  ],
  imports: [
    SharedModule,
    NgbModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgxDropzoneModule,
    // NgxSpinnerModule,
    GoogleMapsModule,
    AppRoutingModule,
    SocialLoginModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDPif6UymMRu1GAQEWeoQHhEH0faONi6yI',
      libraries: ["places", "geometry"]
    }),
    InfiniteScrollModule,
    NgZorroAntdModule,
    LyThemeModule.setTheme('minima-light'),
    AngularFireModule.initializeApp(firebase),
    DeviceDetectorModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  exports: [
    SlugifyPipe,
    // FormatdatesPipe
  ],
  providers: [NgSelectConfig, ɵs,
    { provide: NZ_I18N, useValue: en_US },
    { provide: APP_BASE_HREF, useValue: '' },
    { provide: LY_THEME, useClass: MinimaLight, multi: true }, // name: \`minima-light\`
    { provide: LY_THEME, useClass: MinimaDark, multi: true }, // name: \`minima-dark\`,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              // '154897491633-hbn1uvdcnbncq1g61c3uke08ih2f1ia9.apps.googleusercontent.com'
              '584208882505-0i4b5buub7rsfq14h30nddo1e9jm8ham.apps.googleusercontent.com'

            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('589055665445212')
          }
        ]
      } as SocialAuthServiceConfig,
    },
    // NgxSpinnerService,
    AngularFirestore,
    SlugifyPipe,
  ],
  bootstrap: [AppComponent],
  // exports: [NgxSpinnerModule],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  entryComponents: []
})
export class AppModule {
  constructor(){

  }
 }
