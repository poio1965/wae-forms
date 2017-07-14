import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { InputDropZoneListComponent } from '../input-drop-zone-list/input-drop-zone-list.component';

import { MediaService } from '../../services/media.service';
import { MuseumTemplateService } from '../../services/museum-template.service';
import { MuseumTemplate } from '../../models/museum-template';

declare var google: any;

@Component({
	selector: 'app-museum-template',
	templateUrl: './museum-template.component.html',
	styleUrls: ['./museum-template.component.less']
})

export class MuseumTemplateComponent implements OnInit {

	museums: MuseumTemplate[];
	museumsToShow: MuseumTemplate[];
	museumForm: FormGroup;
	museum: MuseumTemplate;

	updateFunction: Function;
	filterText: string;


	@ViewChild("dropZone")
	dropZone: InputDropZoneListComponent;

	constructor(private fb: FormBuilder,
				private service: MuseumTemplateService,
				private mediaService: MediaService){

		this.createForm();
	}

	ngOnInit(): void {
		this.filterText = "";
		this.service.getAll().subscribe(list => {
			this.museums = list;
			this.filter();
		});
		this.museum = new MuseumTemplate;
		this.museumForm.valueChanges.subscribe(() =>{
			//for autosave add .debounceTime(1000) before subscribe
			this.prepareToSave();
		});

		this.updateFunction = this.save.bind(this);

		//uncomment if autosave
		//this.mediaService.allItemsCompleted.subscribe(() => this.save());
		//this.mediaService.itemRemoved.subscribe(() => this.save());
	}	

	createForm(){
		this.museumForm = this.fb.group({
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
		this.museumForm.reset({
			'name': this.museum.name ? this.museum.name : '',
			'address': this.museum.address ? this.museum.address : '',
			'field1': this.museum.field1 ? this.museum.field1 :'',
			'field2': this.museum.field2 ? this.museum.field2 :'',
			'field3': this.museum.field3 ? this.museum.field3 :'',
			'lat':this.museum.lat ? this.museum.lat : 0,
			'lng': this.museum.lng ? this.museum.lng : 0
		});
	}

	setPosition(event){
		this.museum.lat = event.coords.lat;
		this.museum.lng = event.coords.lng;
		this.resetForm();	
	}

	locate(){
		const formModel = this.museumForm.value;
		this.museum.lat = formModel.lat as number;
		this.museum.lng = formModel.lng as number;
		this.resetForm();
	}


	prepareToSave(){
		const formModel = this.museumForm.value;
		for (var key in formModel) {
			var value = formModel[key];
			if(value){
				this.museum[key] = value
			}
		}
	}

	save(){
		this.prepareToSave();
		if(this.museum._id){
			this.service.update(this.museum).subscribe(r => {
				this.museum = r;
			});
		}else{
			this.service.create(this.museum).subscribe(r => {
				this.museums.push(r);
				this.filter();
				this.museum = r;
				this.resetForm();
			});
		}
	}

	select(museum: MuseumTemplate){
		this.museum = museum;
		this.resetForm();
		setTimeout(()=>{
			this.dropZone.refresh();
		}, 100)
	}

	newMuseum(){
		this.museum = new MuseumTemplate;
		this.resetForm();
	}

	remove(museum: MuseumTemplate){
		let index = this.museums.findIndex(r => r._id === museum._id);
		this.service.delete(museum._id).subscribe(()=>{
			this.museums.splice(index, 1);
			if(this.museum._id === museum._id){
				this.museum = new MuseumTemplate;
				this.resetForm();
				this.filter();
			}
		});
	}

	filter(){
		if(this.filterText){
			this.museumsToShow = this.museums.filter(r => {
				if(r.name){
					return r.name.toLowerCase().indexOf(this.filterText.toLowerCase()) > -1;
				}
				return false;
			});
		}else{
			this.museumsToShow = this.museums;
		}
	}

	placeSet(place){
		//set latitude, longitude and zoom
		this.museum.lat = place.geometry.location.lat();
		this.museum.lng = place.geometry.location.lng();
		
		if(place.name){
			this.museum.name = place.name;
		}
		if(place.formatted_address){
			this.museum.address = place.formatted_address;
		}
		this.museum.googlePlaceId = place.place_id;
		this.resetForm();
	}

	locationChange(position){
		this.museum.lat = position.lat;
		this.museum.lng = position.lng;
		this.resetForm();	
	}

}
