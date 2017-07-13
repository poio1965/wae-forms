import { Component, OnInit, Input, Output, ElementRef, EventEmitter } from '@angular/core';

import { Media } from '../../models/media';
import { MediaService } from '../../services/media.service';
import { Utils } from '../../helpers/utils';
import { DragulaService } from 'ng2-dragula';

export class MediaData {
	_id: string;
	url: string;
	style : any;
	media: Media;
	type: string;
	text: string;
}

@Component({
	selector: 'app-media-thumbnail-carousel',
	templateUrl: './media-thumbnail-carousel.component.html',
	styleUrls: ['./media-thumbnail-carousel.component.less']
})
export class MediaThumbnailCarouselComponent implements OnInit {
	
	@Input()
	mediaList: Media[];

	@Input()
	comments: string[];

	@Input()
	defaultOpen: boolean = false;

	@Input()
	showDelete: boolean = true;

	@Input()
	extendMediaSection: boolean = true;

	mediaDataList: MediaData[];
	element: ElementRef;
	showMedia: Boolean;
	selectedMedia: number;

	@Input()
	nameMaxLength: number;

	@Output()
	mediaRemoved = new EventEmitter();

	@Output()
	mediaListOrderChanged = new EventEmitter();

	@Output()
	mediaSelected = new EventEmitter();

	@Output()
	mediaDeselected = new EventEmitter();

	constructor(private mediaService: MediaService,
				private dragulaService: DragulaService,
				private utils: Utils) {

		dragulaService.dropModel.subscribe((value) => {
			
			
			if (value && value.length > 0 && (value[0] === 'media')) {

				this.mediaList.sort((m1,m2)=>{
					let index1 = this.mediaDataList.findIndex(m => m._id === m1._id);
					let index2 = this.mediaDataList.findIndex(m => m._id === m2._id);

					return index1 - index2;
				});
				this.setValues(value.splice(1));
			}
		});

		mediaService.itemUploaded.subscribe((media) => {
			if(this.mediaList.includes(media)){
				this.processMedia(media);
			}
		});

		mediaService.itemRemoved.subscribe((media) => {
			const index = this.mediaDataList.findIndex((md)=> {
				if(md.media){
					return md.media._id === media._id;
				}
				return false;
			});
			
			if (index > -1) {
				this.mediaDataList.splice(index, 1);
			}			
		});
		this.showMedia = false;
	}

	ngOnInit() {
		console.log("init carousel - medialist.length = " + this.mediaList.length);		
		this.mediaDataList = [];
		this.mediaList.forEach(media => {
			this.processMedia(media);
		});
		if(this.comments){
			this.comments.forEach((comment, index) => {
				const mediaData = {
					_id: index.toString(),
					url: undefined,					
					media: undefined,
					type: 'text',
					text: comment,
					style: undefined
				};
				this.mediaDataList.push(mediaData);
			});	
		}
		if(this.defaultOpen){
			this.showMedia = true;
			this.selectedMedia = 0;
		}
	}

	getMediaUrl(media: Media) {
		return 'api/media/' + media._id + '/download';
	}

	processMedia(media: Media) {
		if (media.type) {
			if (media.type.indexOf('image') > -1) {
				// var image = new Image();
				// image.addEventListener('load', (e) => this.handleImageLoad(e, media));
				// image.src = this.getMediaUrl(media);
				
				const mediaData = {
					_id: media._id,
					url: this.getMediaUrl(media),					
					media: media,
					type: 'image',
					style: undefined,
					text: undefined
				}
				this.mediaDataList.push(mediaData);
			}else if (media.type.indexOf('video') > -1) {
				const mediaData = {
					_id: media._id,
					url: this.getMediaUrl(media),					
					media: media,
					type: 'video',
					style: undefined,
				text: undefined
				}
				this.mediaDataList.push(mediaData);
			}else if (media.type.indexOf('audio') > -1) {
				const mediaData = {
					_id: media._id,
					url: this.getMediaUrl(media),					
					media: media,
					type: 'audio',
					style: undefined,
				text: undefined
				}
				this.mediaDataList.push(mediaData);
			}else{
				const mediaData = {
					_id: media._id,
					url: this.getMediaUrl(media),					
					media: media,
					type: 'document',
					style: undefined,
					text: media.name
				}
				this.mediaDataList.push(mediaData);
			}
		}
	}

	getShortenedName(media: Media) {
		return this.utils.maxLength(media.name, this.nameMaxLength);
	}

	selectMedia(media: MediaData, index){
		if(index === this.selectedMedia){
			this.showMedia = false;
			this.selectedMedia = -1;
			this.mediaDeselected.emit();
		}else{
			this.showMedia = true;
			this.selectedMedia = index;
			this.mediaSelected.emit({mediaDataList: this.mediaDataList, index});
		}
	}

	previous(){
		if(this.selectedMedia > 0){
			this.selectedMedia--;
		}
	}

	next(){
		if(this.selectedMedia < this.mediaDataList.length - 1){
			this.selectedMedia++;
		}
	}

	deleteMedia(media: MediaData){
		let index = this.mediaDataList.findIndex(m => m._id === media._id);
		if(index > -1){
			if(index < this.selectedMedia){
				 this.selectedMedia--;
			}else if(this.selectedMedia === this.mediaDataList.length - 1){
				this.selectedMedia--;
			}

			if(this.selectedMedia === -1){
				this.showMedia = false;
			}

			this.mediaDataList.splice(index, 1);
		}
		this.mediaService.delete(media._id).subscribe(() => {
			this.mediaRemoved.emit(media);
		});
	}

	setValues(args) {
		this.mediaListOrderChanged.emit();
	}

	refresh(){
		this.ngOnInit();
	}
	
}
