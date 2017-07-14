import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { InputDropZoneListComponent } from '../input-drop-zone-list/input-drop-zone-list.component';

import { MediaService } from '../../services/media.service';
import { TouristGuideTemplateService } from '../../services/tourist-guide-template.service';
import { TouristGuideTemplate } from '../../models/tourist-guide-template';

declare var google: any;

@Component({
	selector: 'app-tourist-guide-template',
	templateUrl: './tourist-guide-template.component.html',
	styleUrls: ['./tourist-guide-template.component.less']
})

export class TouristGuideTemplateComponent implements OnInit {

	touristGuides: TouristGuideTemplate[];
	touristGuidesToShow: TouristGuideTemplate[];
	touristGuideForm: FormGroup;
	touristGuide: TouristGuideTemplate;

	updateFunction: Function;
	filterText: string;


	@ViewChild("dropZone")
	dropZone: InputDropZoneListComponent;

	constructor(private fb: FormBuilder,
				private service: TouristGuideTemplateService,
				private mediaService: MediaService){

		this.createForm();
	}

	ngOnInit(): void {
		this.filterText = "";
		this.service.getAll().subscribe(list => {
			this.touristGuides = list;
			this.filter();
		});
		this.touristGuide = new TouristGuideTemplate;
		this.touristGuideForm.valueChanges.subscribe(() =>{
			//for autosave add .debounceTime(1000) before subscribe
			this.prepareToSave();
		});

		this.updateFunction = this.save.bind(this);

		//uncomment if autosave
		//this.mediaService.allItemsCompleted.subscribe(() => this.save());
		//this.mediaService.itemRemoved.subscribe(() => this.save());
	}	

	createForm(){
		this.touristGuideForm = this.fb.group({
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
		this.touristGuideForm.reset({
			'name': this.touristGuide.name ? this.touristGuide.name : '',
			'address': this.touristGuide.address ? this.touristGuide.address : '',
			'field1': this.touristGuide.field1 ? this.touristGuide.field1 :'',
			'field2': this.touristGuide.field2 ? this.touristGuide.field2 :'',
			'field3': this.touristGuide.field3 ? this.touristGuide.field3 :'',
			'lat':this.touristGuide.lat ? this.touristGuide.lat : 0,
			'lng': this.touristGuide.lng ? this.touristGuide.lng : 0
		});
	}

	setPosition(event){
		this.touristGuide.lat = event.coords.lat;
		this.touristGuide.lng = event.coords.lng;
		this.resetForm();	
	}

	locate(){
		const formModel = this.touristGuideForm.value;
		this.touristGuide.lat = formModel.lat as number;
		this.touristGuide.lng = formModel.lng as number;
		this.resetForm();
	}


	prepareToSave(){
		const formModel = this.touristGuideForm.value;
		for (var key in formModel) {
			var value = formModel[key];
			if(value){
				this.touristGuide[key] = value
			}
		}
	}

	save(){
		this.prepareToSave();
		if(this.touristGuide._id){
			this.service.update(this.touristGuide).subscribe(r => {
				this.touristGuide = r;
			});
		}else{
			this.service.create(this.touristGuide).subscribe(r => {
				this.touristGuides.push(r);
				this.filter();
				this.touristGuide = r;
				this.resetForm();
			});
		}
	}

	select(touristGuide: TouristGuideTemplate){
		this.touristGuide = touristGuide;
		this.resetForm();
		setTimeout(()=>{
			this.dropZone.refresh();
		}, 100)
	}

	newTouristGuide(){
		this.touristGuide = new TouristGuideTemplate;
		this.resetForm();
	}

	remove(touristGuide: TouristGuideTemplate){
		let index = this.touristGuides.findIndex(r => r._id === touristGuide._id);
		this.service.delete(touristGuide._id).subscribe(()=>{
			this.touristGuides.splice(index, 1);
			if(this.touristGuide._id === touristGuide._id){
				this.touristGuide = new TouristGuideTemplate;
				this.resetForm();
				this.filter();
			}
		});
	}

	filter(){
		if(this.filterText){
			this.touristGuidesToShow = this.touristGuides.filter(r => {
				if(r.name){
					return r.name.toLowerCase().indexOf(this.filterText.toLowerCase()) > -1;
				}
				return false;
			});
		}else{
			this.touristGuidesToShow = this.touristGuides;
		}
	}

	placeSet(place){
		//set latitude, longitude and zoom
		this.touristGuide.lat = place.geometry.location.lat();
		this.touristGuide.lng = place.geometry.location.lng();
		
		if(place.name){
			this.touristGuide.name = place.name;
		}
		if(place.formatted_address){
			this.touristGuide.address = place.formatted_address;
		}
		this.touristGuide.googlePlaceId = place.place_id;
		this.resetForm();
	}

	locationChange(position){
		this.touristGuide.lat = position.lat;
		this.touristGuide.lng = position.lng;
		this.resetForm();	
	}

}
