import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllcarrieradsComponent } from './allcarrierads.component';

const routes: Routes = [
  { path: '', component: AllcarrieradsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllCarrierRoutingModule { }
