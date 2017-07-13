import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';

import { MapsAPILoader }  from '@agm/core';

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
	restaurantForm: FormGroup;
	restaurant: RestaurantTemplate;
	searchControl: FormControl;
	zoom: number;
	showMarker: boolean;

	updateFunction: Function;

	@ViewChild("search")
	public searchElementRef: ElementRef;

	@ViewChild("dropZone")
	dropZone: InputDropZoneListComponent;

	constructor(private fb: FormBuilder,
				private service: RestaurantTemplateService,
				private mediaService: MediaService,
				private mapsAPILoader: MapsAPILoader,
				private ngZone: NgZone){

		this.createForm();
	}

	ngAfterViewInit() {
		this.startAutocomplete(place => {
			//set latitude, longitude and zoom
			this.restaurant.lat = place.geometry.location.lat();
			this.restaurant.lng = place.geometry.location.lng();
			this.zoom = 12;
			
			console.log(place);
			if(place.name){
				this.restaurant.name = place.name;
			}
			if(place.formatted_address){
				this.restaurant.address = place.formatted_address;
			}
			this.restaurant.googlePlaceId = place.place_id;
			this.resetForm();
			this.showMarker = true;
		});
	}

	startAutocomplete(callback){
		this.mapsAPILoader.load().then(() => {
			let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
			
      		autocomplete.addListener("place_changed", () => {
				this.ngZone.run(() => {
			
					//get the place result
					let place = autocomplete.getPlace();
					

					//verify result
					if (place.geometry === undefined || place.geometry === null) {
						return;
					}
					if(callback){
						callback(place);
					}
					
					
				});
			});
		});
	}

	ngOnInit(): void {
		this.service.getAll().subscribe(list => {
			this.restaurants = list;
		});
		this.restaurant = new RestaurantTemplate;

		this.updateFunction = this.save.bind(this);

    	//create search FormControl
		this.searchControl = new FormControl();
		
		this.zoom = 1;
		this.showMarker = false;

		this.mediaService.allItemsCompleted.subscribe(() => this.save());
		this.mediaService.itemRemoved.subscribe(() => this.save());
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
			'field1': '',
			'field2': '',
			'field3': '',
			'lat':this.restaurant.lat ? this.restaurant.lat : 0,
			'lng': this.restaurant.lng ? this.restaurant.lng : 0
		});
	}

	setPosition(event){
		console.log(event);
		this.restaurant.lat = event.coords.lat;
		this.restaurant.lng = event.coords.lng;
		this.searchControl.reset();
		this.resetForm();	
	}

	locate(){
		const formModel = this.restaurantForm.value;
		this.restaurant.lat = formModel.lat as number;
		this.restaurant.lng = formModel.lng as number;
		this.zoom = 12;
		this.resetForm();
		console.log(this.restaurant);
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
		console.log("save");
		this.prepareToSave();
		console.log(this.restaurant);
		if(this.restaurant._id){
			this.service.update(this.restaurant).subscribe();
		}else{
			this.service.create(this.restaurant).subscribe(r => {
				this.restaurants.push(r);
				this.restaurant = r;
				this.resetForm();
			});
		}
	}

	select(restaurant: RestaurantTemplate){
		this.restaurant = restaurant;
		this.searchControl.reset();
		this.resetForm();
		this.showMarker = true;
		this.zoom = 12;
		setTimeout(()=>{
			this.dropZone.refresh();
		}, 100)
	}

	newRestaurant(){
		this.restaurant = new RestaurantTemplate;
		this.zoom = 1;
		this.resetForm();
		this.searchControl.reset();
		this.showMarker = false;
	}

	zoomChange(event){
		this.zoom = event;
	}

}
