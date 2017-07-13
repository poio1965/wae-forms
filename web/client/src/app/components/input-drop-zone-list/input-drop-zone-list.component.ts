import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { DragulaService } from 'ng2-dragula';

import { MediaThumbnailCarouselComponent } from '../media-thumbnail-carousel/media-thumbnail-carousel.component';

import { MediaService } from '../../services/media.service';

import { Utils } from '../../helpers/utils';

import { Media } from '../../models/media';

@Component({
	selector: 'app-input-drop-zone-list',
	templateUrl: './input-drop-zone-list.component.html',
	styleUrls: ['./input-drop-zone-list.component.less']
})
export class InputDropZoneListComponent implements OnInit, OnDestroy {

	@ViewChild('resources')
	resources: ElementRef;

	@ViewChild('carousel')
	carousel: MediaThumbnailCarouselComponent

	uploadUrl = 'api/upload';
	@Input()
	mediaList: Media[];
	@Input()
	label: string;
	@Input()
	nameMaxLength: number;
	labelTranslated: string;
	uploader = new FileUploader({
		url: this.uploadUrl,
		autoUpload: true,
		removeAfterUpload: true
	});
	
	@Input() updateFunction: Function;

	@Output()
	mediaListOrderChanged = new EventEmitter();

	hasBaseDropZoneOver = false;
	error = false;

	constructor(private translateService: TranslateService,
		private mediaService: MediaService,
		private dragulaService: DragulaService,
		private utils: Utils) {
		this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
			this.setTranslatedLabel();
		});

		dragulaService.dropModel.subscribe((value) => {
			//this.setValues(value.slice(1));
			if (value && value.length > 0 && (value[0] === 'media' || value[0] === 'ext-resources')) {
				this.setValues(value.splice(1));
			}
		});
	}

	ngOnInit() {
		this.uploader.onCompleteAll = () => {
			this.mediaService.allCompleted();
		}
		this.uploader.onCompleteItem = (item: FileItem, response: any, status: number, headers: any): void => {
			const media = JSON.parse(response);
			if (!this.mediaList) {
				this.mediaList = [];
			}
			this.mediaList.push(media);
			this.mediaService.mediaUploaded(media);
		};

		this.uploader.onErrorItem = (item: FileItem, response: any, status: number, headers: any): void => {
			this.error = true;
			setTimeout(() => {
				this.error = false;
			}, 5000);
		};

		this.setTranslatedLabel();

	}

	ngOnDestroy() {
		if (this.dragulaService.find('media')) {
			this.dragulaService.destroy('media');
		}
		const resourcesBag = this.dragulaService.find('ext-resources');
		if (resourcesBag) {
			const drake = resourcesBag.drake;
			if (drake.containers.length > 1 || drake.models.length > 1) {
				const index = drake.containers.indexOf(this.resources.nativeElement);
				drake.containers.splice(index, 1);
				drake.models.splice(index, 1);
			}else {
				this.dragulaService.destroy('ext-resources');
			}
		}
	}

	setTranslatedLabel() {
		this.translateService.get(this.label).subscribe((res: string) => {
			this.labelTranslated = res;
		});
	}

	fileOverBase(e: any): void {
		this.error = false;
		this.hasBaseDropZoneOver = e;
	}

	setValues(args) {
		this.mediaListOrderChanged.emit();
	}

	removeMedia(mediaData){
		let index = this.mediaList.findIndex(m => m._id === mediaData._id);
		if(index > -1){
			this.mediaList.splice(index, 1);
			if (this.updateFunction !== undefined) {
				this.updateFunction();
			}			
		}
	}
	onOrderChange(){
		this.mediaListOrderChanged.emit();
	}

	refresh(){
		if(this.carousel)
			this.carousel.refresh();
	}
}
