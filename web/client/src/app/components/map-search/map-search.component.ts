import { Component, OnInit, ViewChild, ElementRef, NgZone, EventEmitter,
		 Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

import { MapsAPILoader }  from '@agm/core';


declare var google: any;

@Component({
	selector: 'app-map-search',
	templateUrl: './map-search.component.html',
	styleUrls: ['./map-search.component.less']
})

export class MapSearchComponent implements OnInit, OnChanges {

	searchControl: FormControl;
	zoom: number;
	showMarker: boolean;

	@Output()
	placeEmitter = new EventEmitter<any>();
	@Output()
	locationChange = new EventEmitter<any>();

	@Input()
	lat: number;
	@Input()
	lng: number;

	@ViewChild("search")
	public searchElementRef: ElementRef;


	constructor(private mapsAPILoader: MapsAPILoader,
				private ngZone: NgZone){
	}

	ngAfterViewInit() {
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
							
					this.placeEmitter.emit(place);
					this.showMarker = true;
					this.zoom = 12;					
				});
			});
		});
		
			
	}

	ngOnInit(): void {
		//create search FormControl
		this.searchControl = new FormControl();
		
		this.zoom = 1;
		this.showMarker = false;
	}

	ngOnChanges(changes: SimpleChanges): void {
		if(changes['lat'] || changes['lng']){
			if(this.lat != 0 || this.lng != 0){
				this.zoom = 12;
				this.showMarker = true;
			}else{
				this.zoom = 1;
				this.showMarker = false;
			}
		}
	}

	setPosition(event){
		this.zoom = 12;		
		this.searchControl.reset();
		this.locationChange.emit({'lat': event.coords.lat, 'lng': event.coords.lng});	
	}

	locate(){
		this.zoom = 12;
		this.locationChange.emit({'lat': this.lat, 'lng': this.lng});
	}


	zoomChange(event){
		this.zoom = event;
	}

}
