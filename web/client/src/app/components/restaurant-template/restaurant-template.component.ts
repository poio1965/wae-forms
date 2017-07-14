import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { InputDropZoneListComponent } from '../input-drop-zone-list/input-drop-zone-list.component';

import { MediaService } from '../../services/media.service';
import { RestaurantTemplateService } from '../../services/restaurant-template.service';
import { RestaurantTemplate } from '../../models/restaurant-template';

declare var google: any;

@Component({
	selector: 'app-restaurant-template',
	templateUrl: './restaurant-template.component.html',
	styleUrls: ['./restaurant-template.component.less']
})

export class RestaurantTemplateComponent implements OnInit {

	restaurants: RestaurantTemplate[];
	restaurantsToShow: RestaurantTemplate[];
	restaurantForm: FormGroup;
	restaurant: RestaurantTemplate;

	updateFunction: Function;
	filterText: string;


	@ViewChild("dropZone")
	dropZone: InputDropZoneListComponent;

	constructor(private fb: FormBuilder,
				private service: RestaurantTemplateService,
				private mediaService: MediaService){

		this.createForm();
	}

	ngOnInit(): void {
		this.filterText = "";
		this.service.getAll().subscribe(list => {
			this.restaurants = list;
			this.filter();
		});
		this.restaurant = new RestaurantTemplate;

		this.updateFunction = this.save.bind(this);

		//uncomment if autosave
		//this.mediaService.allItemsCompleted.subscribe(() => this.save());
		//this.mediaService.itemRemoved.subscribe(() => this.save());
	}	

	createForm(){
		this.restaurantForm = this.fb.group({
			'name': ['', Validators.required],
			'address': '',
			'field1': '',
			'field2': '',
			'field3': '',
			'lat':0,
			'lng': 0
		});
	}

	resetForm(){
		this.restaurantForm.reset({
			'name': this.restaurant.name ? this.restaurant.name : '',
			'address': this.restaurant.address ? this.restaurant.address : '',
			'field1': this.restaurant.field1 ? this.restaurant.field1 :'',
			'field2': this.restaurant.field2 ? this.restaurant.field2 :'',
			'field3': this.restaurant.field3 ? this.restaurant.field3 :'',
			'lat':this.restaurant.lat ? this.restaurant.lat : 0,
			'lng': this.restaurant.lng ? this.restaurant.lng : 0
		});
	}

	setPosition(event){
		this.restaurant.lat = event.coords.lat;
		this.restaurant.lng = event.coords.lng;
		this.resetForm();	
	}

	locate(){
		const formModel = this.restaurantForm.value;
		this.restaurant.lat = formModel.lat as number;
		this.restaurant.lng = formModel.lng as number;
		this.resetForm();
	}


	prepareToSave(){
		const formModel = this.restaurantForm.value;
		for (var key in formModel) {
			var value = formModel[key];
			if(value){
				this.restaurant[key] = value
			}
		}
	}

	save(){
		this.prepareToSave();
		if(this.restaurant._id){
			this.service.update(this.restaurant).subscribe();
		}else{
			this.service.create(this.restaurant).subscribe(r => {
				this.restaurants.push(r);
				this.filter();
				this.restaurant = r;
				this.resetForm();
			});
		}
	}

	select(restaurant: RestaurantTemplate){
		this.restaurant = restaurant;
		this.resetForm();
		setTimeout(()=>{
			this.dropZone.refresh();
		}, 100)
	}

	newRestaurant(){
		this.restaurant = new RestaurantTemplate;
		this.resetForm();
	}

	remove(restaurant: RestaurantTemplate){
		let index = this.restaurants.findIndex(r => r._id === restaurant._id);
		this.service.delete(restaurant._id).subscribe(()=>{
			this.restaurants.splice(index, 1);
			if(this.restaurant._id === restaurant._id){
				this.restaurant = new RestaurantTemplate;
				this.resetForm();
				this.filter();
			}
		});
	}

	filter(){
		if(this.filterText){
			this.restaurantsToShow = this.restaurants.filter(r => {
				if(r.name){
					return r.name.toLowerCase().indexOf(this.filterText.toLowerCase()) > -1;
				}
				return false;
			});
		}else{
			this.restaurantsToShow = this.restaurants;
		}
	}

	placeSet(place){
		//set latitude, longitude and zoom
		this.restaurant.lat = place.geometry.location.lat();
		this.restaurant.lng = place.geometry.location.lng();
		
		if(place.name){
			this.restaurant.name = place.name;
		}
		if(place.formatted_address){
			this.restaurant.address = place.formatted_address;
		}
		this.restaurant.googlePlaceId = place.place_id;
		this.resetForm();
	}

	locationChange(position){
		this.restaurant.lat = position.lat;
		this.restaurant.lng = position.lng;
		this.resetForm();	
	}

}
