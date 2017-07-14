import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttractionTemplateComponent } from './components/attraction-template/attraction-template.component';
import { MuseumTemplateComponent } from './components/museum-template/museum-template.component';
import { RestaurantTemplateComponent } from './components/restaurant-template/restaurant-template.component';


const rootRoutes: Routes = [
	{path: '', redirectTo: 'restaurant-template', pathMatch: 'full'},
	{path: 'attraction-template', component: AttractionTemplateComponent},
	{path: 'museum-template', component: MuseumTemplateComponent},
	{path: 'restaurant-template', component: RestaurantTemplateComponent}
];

@NgModule({
	imports: [RouterModule.forRoot(rootRoutes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
