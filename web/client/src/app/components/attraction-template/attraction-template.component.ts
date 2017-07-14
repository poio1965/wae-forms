import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { InputDropZoneListComponent } from '../input-drop-zone-list/input-drop-zone-list.component';

import { MediaService } from '../../services/media.service';
import { AttractionTemplateService } from '../../services/attraction-template.service';
import { AttractionTemplate } from '../../models/attraction-template';

declare var google: any;

@Component({
	selector: 'app-attraction-template',
	templateUrl: './attraction-template.component.html',
	styleUrls: ['./attraction-template.component.less']
})

export class AttractionTemplateComponent implements OnInit {

	attractions: AttractionTemplate[];
	attractionsToShow: AttractionTemplate[];
	attractionForm: FormGroup;
	attraction: AttractionTemplate;

	updateFunction: Function;
	filterText: string;


	@ViewChild("dropZone")
	dropZone: InputDropZoneListComponent;

	constructor(private fb: FormBuilder,
				private service: AttractionTemplateService,
				private mediaService: MediaService){

		this.createForm();
	}

	ngOnInit(): void {
		this.filterText = "";
		this.service.getAll().subscribe(list => {
			this.attractions = list;
			this.filter();
		});
		this.attraction = new AttractionTemplate;
		this.attractionForm.valueChanges.subscribe(() =>{
			//for autosave add .debounceTime(1000) before subscribe
			this.prepareToSave();
		});

		this.updateFunction = this.save.bind(this);

		//uncomment if autosave
		//this.mediaService.allItemsCompleted.subscribe(() => this.save());
		//this.mediaService.itemRemoved.subscribe(() => this.save());
	}	

	createForm(){
		this.attractionForm = this.fb.group({
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
		this.attractionForm.reset({
			'name': this.attraction.name ? this.attraction.name : '',
			'address': this.attraction.address ? this.attraction.address : '',
			'field1': this.attraction.field1 ? this.attraction.field1 :'',
			'field2': this.attraction.field2 ? this.attraction.field2 :'',
			'field3': this.attraction.field3 ? this.attraction.field3 :'',
			'lat':this.attraction.lat ? this.attraction.lat : 0,
			'lng': this.attraction.lng ? this.attraction.lng : 0
		});
	}

	setPosition(event){
		this.attraction.lat = event.coords.lat;
		this.attraction.lng = event.coords.lng;
		this.resetForm();	
	}

	locate(){
		const formModel = this.attractionForm.value;
		this.attraction.lat = formModel.lat as number;
		this.attraction.lng = formModel.lng as number;
		this.resetForm();
	}


	prepareToSave(){
		const formModel = this.attractionForm.value;
		for (var key in formModel) {
			var value = formModel[key];
			if(value){
				this.attraction[key] = value
			}
		}
	}

	save(){
		this.prepareToSave();
		if(this.attraction._id){
			this.service.update(this.attraction).subscribe(r => {
				this.attraction = r;
			});
		}else{
			this.service.create(this.attraction).subscribe(r => {
				this.attractions.push(r);
				this.filter();
				this.attraction = r;
				this.resetForm();
			});
		}
	}

	select(attraction: AttractionTemplate){
		this.attraction = attraction;
		this.resetForm();
		setTimeout(()=>{
			this.dropZone.refresh();
		}, 100)
	}

	newAttraction(){
		this.attraction = new AttractionTemplate;
		this.resetForm();
	}

	remove(attraction: AttractionTemplate){
		let index = this.attractions.findIndex(r => r._id === attraction._id);
		this.service.delete(attraction._id).subscribe(()=>{
			this.attractions.splice(index, 1);
			if(this.attraction._id === attraction._id){
				this.attraction = new AttractionTemplate;
				this.resetForm();
				this.filter();
			}
		});
	}

	filter(){
		if(this.filterText){
			this.attractionsToShow = this.attractions.filter(r => {
				if(r.name){
					return r.name.toLowerCase().indexOf(this.filterText.toLowerCase()) > -1;
				}
				return false;
			});
		}else{
			this.attractionsToShow = this.attractions;
		}
	}

	placeSet(place){
		//set latitude, longitude and zoom
		this.attraction.lat = place.geometry.location.lat();
		this.attraction.lng = place.geometry.location.lng();
		
		if(place.name){
			this.attraction.name = place.name;
		}
		if(place.formatted_address){
			this.attraction.address = place.formatted_address;
		}
		this.attraction.googlePlaceId = place.place_id;
		this.resetForm();
	}

	locationChange(position){
		this.attraction.lat = position.lat;
		this.attraction.lng = position.lng;
		this.resetForm();	
	}

}
