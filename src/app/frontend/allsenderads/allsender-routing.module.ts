import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllsenderadsComponent } from './allsenderads.component';

const routes: Routes = [
  { path: '', component: AllsenderadsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllSenderRoutingModule { }
