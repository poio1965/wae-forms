import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { InputDropZoneListComponent } from '../input-drop-zone-list/input-drop-zone-list.component';

import { MediaService } from '../../services/media.service';
import { ShopTemplateService } from '../../services/shop-template.service';
import { ShopTemplate } from '../../models/shop-template';

declare var google: any;

@Component({
	selector: 'app-shop-template',
	templateUrl: './shop-template.component.html',
	styleUrls: ['./shop-template.component.less']
})

export class ShopTemplateComponent implements OnInit {

	shops: ShopTemplate[];
	shopsToShow: ShopTemplate[];
	shopForm: FormGroup;
	shop: ShopTemplate;

	updateFunction: Function;
	filterText: string;


	@ViewChild("dropZone")
	dropZone: InputDropZoneListComponent;

	constructor(private fb: FormBuilder,
				private service: ShopTemplateService,
				private mediaService: MediaService){

		this.createForm();
	}

	ngOnInit(): void {
		this.filterText = "";
		this.service.getAll().subscribe(list => {
			this.shops = list;
			this.filter();
		});
		this.shop = new ShopTemplate;
		this.shopForm.valueChanges.subscribe(() =>{
			//for autosave add .debounceTime(1000) before subscribe
			this.prepareToSave();
		});

		this.updateFunction = this.save.bind(this);

		//uncomment if autosave
		//this.mediaService.allItemsCompleted.subscribe(() => this.save());
		//this.mediaService.itemRemoved.subscribe(() => this.save());
	}	

	createForm(){
		this.shopForm = this.fb.group({
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
		this.shopForm.reset({
			'name': this.shop.name ? this.shop.name : '',
			'address': this.shop.address ? this.shop.address : '',
			'field1': this.shop.field1 ? this.shop.field1 :'',
			'field2': this.shop.field2 ? this.shop.field2 :'',
			'field3': this.shop.field3 ? this.shop.field3 :'',
			'lat':this.shop.lat ? this.shop.lat : 0,
			'lng': this.shop.lng ? this.shop.lng : 0
		});
	}

	setPosition(event){
		this.shop.lat = event.coords.lat;
		this.shop.lng = event.coords.lng;
		this.resetForm();	
	}

	locate(){
		const formModel = this.shopForm.value;
		this.shop.lat = formModel.lat as number;
		this.shop.lng = formModel.lng as number;
		this.resetForm();
	}


	prepareToSave(){
		const formModel = this.shopForm.value;
		for (var key in formModel) {
			var value = formModel[key];
			if(value){
				this.shop[key] = value
			}
		}
	}

	save(){
		this.prepareToSave();
		if(this.shop._id){
			this.service.update(this.shop).subscribe(r => {
				this.shop = r;
			});
		}else{
			this.service.create(this.shop).subscribe(r => {
				this.shops.push(r);
				this.filter();
				this.shop = r;
				this.resetForm();
			});
		}
	}

	select(shop: ShopTemplate){
		this.shop = shop;
		this.resetForm();
		setTimeout(()=>{
			this.dropZone.refresh();
		}, 100)
	}

	newShop(){
		this.shop = new ShopTemplate;
		this.resetForm();
	}

	remove(shop: ShopTemplate){
		let index = this.shops.findIndex(r => r._id === shop._id);
		this.service.delete(shop._id).subscribe(()=>{
			this.shops.splice(index, 1);
			if(this.shop._id === shop._id){
				this.shop = new ShopTemplate;
				this.resetForm();
				this.filter();
			}
		});
	}

	filter(){
		if(this.filterText){
			this.shopsToShow = this.shops.filter(r => {
				if(r.name){
					return r.name.toLowerCase().indexOf(this.filterText.toLowerCase()) > -1;
				}
				return false;
			});
		}else{
			this.shopsToShow = this.shops;
		}
	}

	placeSet(place){
		//set latitude, longitude and zoom
		this.shop.lat = place.geometry.location.lat();
		this.shop.lng = place.geometry.location.lng();
		
		if(place.name){
			this.shop.name = place.name;
		}
		if(place.formatted_address){
			this.shop.address = place.formatted_address;
		}
		this.shop.googlePlaceId = place.place_id;
		this.resetForm();
	}

	locationChange(position){
		this.shop.lat = position.lat;
		this.shop.lng = position.lng;
		this.resetForm();	
	}

}
