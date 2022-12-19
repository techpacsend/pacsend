import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdEditComponent } from './ad-edit.component';


const routes: Routes = [
  { path: '', component: AdEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdEditRoutingModule { }
