import { Injectable } from '@angular/core';
import { Observable} from 'rxjs/Rx';
import { AuthHttp } from 'angular2-jwt';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Utils } from '../helpers/utils';
import { AttractionTemplate } from '../models/attraction-template';


@Injectable()
export class AttractionTemplateService {
    private attractionTemplatesUrl = 'api/attraction-template';

	private headers = new Headers({ 'Content-Type': 'application/json' });
  	private options = new RequestOptions({ headers: this.headers });

	constructor(private http: Http, private utils: Utils) {
	}

	create(attractionTemplate: AttractionTemplate): Observable<AttractionTemplate> {
		return this.http.post(this.attractionTemplatesUrl, JSON.stringify(attractionTemplate), this.options)
							.map(res => res.json())
							.catch(this.utils.handleError.bind(this.utils));
	}

	delete(id: string): Observable<any> {
		const url = `${this.attractionTemplatesUrl}/${id}`;
		return this.http.delete(url, this.options)
							.catch(this.utils.handleError.bind(this.utils));
	}

	getAll(): Observable<AttractionTemplate[]> {
		return this.http.get(this.attractionTemplatesUrl + '?get=media', this.options)
							.map(response => response.json() as AttractionTemplate[])
							.catch(this.utils.handleError.bind(this.utils));
	}

	get(id: string): Observable<AttractionTemplate> {
		const url = `${this.attractionTemplatesUrl}/${id}`;
		return this.http.get(url + '?get=media', this.options)
							.map(response => response.json() as AttractionTemplate)
							.catch(this.utils.handleError.bind(this.utils));
	}

	update(attractionTemplate: AttractionTemplate): Observable<AttractionTemplate> {
			const url = `${this.attractionTemplatesUrl}/${attractionTemplate._id}`;
			return this.http.put(url, JSON.stringify(attractionTemplate), this.options)
								.map(() => attractionTemplate)
								.catch(this.utils.handleError.bind(this.utils));
	}
}