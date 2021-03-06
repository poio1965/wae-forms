import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttractionTemplateComponent } from './components/attraction-template/attraction-template.component';
import { MuseumTemplateComponent } from './components/museum-template/museum-template.component';
import { RestaurantTemplateComponent } from './components/restaurant-template/restaurant-template.component';
import { ShopTemplateComponent } from './components/shop-template/shop-template.component';
import { TouristGuideTemplateComponent } from './components/tourist-guide-template/tourist-guide-template.component';


const rootRoutes: Routes = [
	{path: '', redirectTo: 'restaurant-template', pathMatch: 'full'},
	{path: 'attraction-template', component: AttractionTemplateComponent},
	{path: 'museum-template', component: MuseumTemplateComponent},
	{path: 'shop-template', component: ShopTemplateComponent},
	{path: 'restaurant-template', component: RestaurantTemplateComponent},
	{path: 'tourist-guide-template', component: TouristGuideTemplateComponent}
];

@NgModule({
	imports: [RouterModule.forRoot(rootRoutes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
