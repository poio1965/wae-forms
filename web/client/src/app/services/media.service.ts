import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Http, Response, Headers, ResponseContentType } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Utils } from '../helpers/utils';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Media } from '../models/media';

@Injectable()
export class MediaService {

	private mediaUrl = 'api/media';
	private headers = new Headers({'Accept': '*/*'});

	@Output()
	itemUploaded = new EventEmitter<Media>();
	@Output()
	allItemsCompleted = new EventEmitter<Media>();

	@Output()
	itemRemoved = new EventEmitter<Media>();

	constructor(private http: Http, private utils: Utils) {
	}

	download(media: Media) {
		const url = `${this.mediaUrl}/${media._id}/download`;
		return this.http.get(url, {responseType: ResponseContentType.ArrayBuffer, headers: this.headers})
								.map(res => new Blob([res.arrayBuffer()], {type: media.type}))
								.catch(this.utils.handleError.bind(this.utils));
	}

	getUnattachedMedia(): Observable<Media[]> {
		return this.http.get(this.mediaUrl + '?unattachedResource=true')
							.map(response => response.json() as Media[])
							.catch(this.utils.handleError.bind(this.utils));
	}

	mediaUploaded(media: Media) {
		this.itemUploaded.emit(media);
	}

	mediaRemoved(media: Media) {
		this.itemRemoved.emit(media);
	}

	get(id): Observable<Media> {
		const url = `${this.mediaUrl}/${id}`;
		return this.http.get(url)
							.map(response => response.json() as Media)
							.catch(this.utils.handleError.bind(this.utils));
	}

	allCompleted() {
		this.allItemsCompleted.emit();
	}

	delete(id): Observable<any> {
		const url = `${this.mediaUrl}/${id}`;
		return this.http.delete(url)
							.catch(this.utils.handleError.bind(this.utils));
	} 
}
