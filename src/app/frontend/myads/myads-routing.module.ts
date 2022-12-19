import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyadsComponent } from './myads.component';
import { MybookingComponent } from './mybooking/mybooking.component';

const routes: Routes = [
  { path: '', component: MyadsComponent },
  {path:'',  component: MybookingComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MydsRoutingModule { }
