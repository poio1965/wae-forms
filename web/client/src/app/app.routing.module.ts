import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { RestaurantTemplateComponent } from './components/restaurant-template/restaurant-template.component';


const rootRoutes: Routes = [
	{path: '', redirectTo: 'restaurant-template', pathMatch: 'full'},
	{path: 'restaurant-template', component: RestaurantTemplateComponent}
];

@NgModule({
	imports: [RouterModule.forRoot(rootRoutes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
