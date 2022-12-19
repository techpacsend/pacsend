import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewAdComponent } from './view-ad.component';


const routes: Routes = [
  { path: '', component: ViewAdComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewAdRoutingModule { }
