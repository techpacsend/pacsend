import { AdEditComponent } from './ad-edit/ad-edit.component';
import { ForgotpassverificationComponent } from './frontend/forgotpassverification/forgotpassverification.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './frontend/index/index.component';
import { AllcarrieradsComponent } from './frontend/allcarrierads/allcarrierads.component';
import { AllsenderadsComponent } from './frontend/allsenderads/allsenderads.component';
import { TripinfoComponent } from './frontend/tripinfo/tripinfo.component';
import { AboutComponent } from './frontend/about/about.component';
import { PrivacypolicyComponent } from './frontend/privacypolicy/privacypolicy.component';
import { TermsandconditionsComponent } from './frontend/termsandconditions/termsandconditions.component';
import { FaqsComponent } from './frontend/faqs/faqs.component';
import { MyadsComponent } from './frontend/myads/myads.component';
import { MapsComponent } from './frontend/maps/maps.component';
import { ChatComponent } from './frontend/chat/chat.component';
import { LoginComponent } from './frontend/login/login.component';
import { SignupComponent } from './frontend/signup/signup.component';
import { ViewAdComponent } from './frontend/allads/view-ad/view-ad.component';
import { ViewcarrieradsComponent } from './frontend/myads/viewcarrierads/viewcarrierads.component';
import { ViewsenderadsComponent } from './frontend/myads/viewsenderads/viewsenderads.component';
import { ViewAdCarryComponent } from './frontend/allads/view-ad-carry/view-ad-carry.component';
import { VerificationComponent } from './frontend/verification/verification.component';
import { FavouritesComponent } from './frontend/favourites/favourites.component';
import { ErrorComponent } from './frontend/error/error.component';
import { ChangepasswordComponent } from './frontend/changepassword/changepassword.component';
import { MybookingComponent } from './frontend/myads/mybooking/mybooking.component';
import { SpinnerComponent } from './frontend/myads/spinner/spinner.component';
import { UserProfileComponent } from './frontend/user-profile/user-profile.component';
import { NotificationComponent } from './notification/notification.component';
import { DefaultPageComponent } from './frontend/default-page/default-page.component';
import { SignupNextComponent } from './frontend/signup/signup-next.component';
import { MyActivityComponent } from './frontend/my-activity/my-activity.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DefaultPageComponent,
    children: [
      {
        path: '',
        component: IndexComponent,
      },
      {
        path: 'all-ads',
        loadChildren: () => import('./frontend/allads/allads.module')
          .then(mod => mod.AlladsModule),
          // canActivate: [AuthGuard]
    
      },
      {
        path: 'all-carrier-ads',
        // component: AllcarrieradsComponent,
        loadChildren: () => import("./frontend/allcarrierads/allcarrier.module")
          .then((m) => m.AllCarrierModule),
        canActivate: [AuthGuard]
      },
    
      {
        path: 'all-sender-ads',
        // component: AllsenderadsComponent,
        loadChildren: () => import("./frontend/allsenderads/allsender.module")
        .then((m) => m.AllSenderModule),
        canActivate: [AuthGuard]
      },
      {
        // path: 'all-ads/sender-details/:id',
        path: 'all-ads/sender-details/:title',
        pathMatch: 'full',
        // component: ViewAdComponent,
        loadChildren: () => import("./frontend/allads/view-ad/viewad.module")
        .then((m) => m.ViewAdModule),
      },
    
      {
        // path: 'all-ads/carrier-details/:id',
        path: 'all-ads/carrier-details/:title',
        pathMatch: 'full',
        component: ViewAdCarryComponent,
      },
    
      {
        path: 'all-ads/ad-edit/:id',
        pathMatch: 'full',
        // component: AdEditComponent,
        loadChildren: () => import("./ad-edit/addedit.module")
        .then((m) => m.AdEditModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'my-ads',
        // component: MyadsComponent,
        loadChildren: () => import("./frontend/myads/myads.module")
        .then((m) => m.MyAdsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'my-activity',
        component: MyActivityComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'my-ads/mybookings',
        // component: MybookingComponent,
        loadChildren: () => import("./frontend/myads/myads.module")
        .then((m) => m.MyAdsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'my-ads/carrier-details/:id',
        component: ViewAdCarryComponent,
        canActivate: [AuthGuard]
      },
      {
    
        path: 'my-ads/sender-details/:id',
        // component: ViewAdComponent,
        loadChildren: () => import("./frontend/allads/view-ad/viewad.module")
        .then((m) => m.ViewAdModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'map',
        // component: MapsComponent
        loadChildren: () => import("./frontend/maps/maps.module")
          .then((m) => m.MapsModule),
          // canActivate: [AuthGuard]
      },
    
    
      {
        path: 'about',
        // component: AboutComponent,
        loadChildren: () => import("./frontend/about/about.module")
        .then((m) => m.AboutModule)
      },
    
      {
        path: 'privacy-policy',
        // component: PrivacypolicyComponent,
        loadChildren: () => import("./frontend/privacypolicy/privacypolicy.module")
          .then((m) => m.PrivacyPolicyModule)
      },
      {
        path: 'terms-and-condition',
        component: TermsandconditionsComponent,
      },
      {
        path: 'faqs',
        // component: FaqsComponent,
        loadChildren: () => import("./frontend/faqs/faqs.module")
        .then((m) => m.FAQSModule)
      },
      {
        path: 'chat',
        // pathMatch: 'full',
        component: ChatComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'favourites',
        // component: FavouritesComponent,
        loadChildren: () => import("./frontend/favourites/favourite.module")
        .then((m) => m.FavouriteModule),
        canActivate: [AuthGuard]
    
      },
      {
        path: 'trip-info',
        component: TripinfoComponent,
      },
      {
        path: 'my-ads-carrier/:id',
        component: ViewcarrieradsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'notification',
        // component: NotificationComponent
        loadChildren: () => import("./notification/notification.module")
          .then((m) => m.NotificationModule),
          canActivate: [AuthGuard]
      },
      {
        path: 'my-ads-sender/:id',
        component: ViewsenderadsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'user-profile/:id',
        data: {
          footer: false
        },
        // pathMatch: 'full',
        // component: UserProfileComponent,
        loadChildren: () => import("./frontend/user-profile/user-profile.module")
        .then((m) => m.UserProfileModule),
        canActivate: [AuthGuard]
    
      },
    ]
  },

  {
    path: 'login',
    // pathMatch: 'full',
    component: LoginComponent
  },
  {
    path: 'sign-up',
    component: SignupComponent

  },

  {
    path: 'signup-next',
    component: SignupNextComponent

  },

  
  {
    path: 'spinner',

    // pathMatch: 'full',
    component: SpinnerComponent

  },
  {
    path: 'verification/:id',

    // pathMatch: 'full',
    component: VerificationComponent

  },

  {
    path: 'change-password',
    // pathMatch: 'full',
    component: ChangepasswordComponent

  },
  {
    path: 'forgot-password-verification',
    // pathMatch: 'full',
    component: ForgotpassverificationComponent

  },
  {
    path: '404',
    // pathMatch: 'full',
    component: ErrorComponent

  },
  {
    path: '**',
    component: ErrorComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ''
  },

]


@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
