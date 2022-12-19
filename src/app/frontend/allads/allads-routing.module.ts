import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlladsComponent } from './allads.component';
import { ViewAdCarryComponent } from './view-ad-carry/view-ad-carry.component';


const routes: Routes = [
  {
    path: '',
    component: AlladsComponent
  },

  {
    path: '',
    component: ViewAdCarryComponent
  },
  {
    path: '',
    component: ViewAdCarryComponent
  }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlladsRoutingModule { }
