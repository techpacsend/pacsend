import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivacypolicyComponent } from './privacypolicy.component';

const routes: Routes = [
  { path: '', component: PrivacypolicyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivacyPolicyRoutingModule { }
