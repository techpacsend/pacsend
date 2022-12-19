import { FavouritesComponent } from './favourites.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
//   { path: 'favourites', redirectTo: 'favourites', pathMatch: 'full' },
  { path: '', component: FavouritesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FavouriteRoutingModule { }
