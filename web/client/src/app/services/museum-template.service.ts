import { Injectable } from '@angular/core';
import { Observable} from 'rxjs/Rx';
import { AuthHttp } from 'angular2-jwt';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Utils } from '../helpers/utils';
import { MuseumTemplate } from '../models/museum-template';


@Injectable()
export class MuseumTemplateService {
    private museumTemplatesUrl = 'api/museum-template';

	private headers = new Headers({ 'Content-Type': 'application/json' });
  	private options = new RequestOptions({ headers: this.headers });

	constructor(private http: Http, private utils: Utils) {
	}

	create(museumTemplate: MuseumTemplate): Observable<MuseumTemplate> {
		return this.http.post(this.museumTemplatesUrl, JSON.stringify(museumTemplate), this.options)
							.map(res => res.json())
							.catch(this.utils.handleError.bind(this.utils));
	}

	delete(id: string): Observable<any> {
		const url = `${this.museumTemplatesUrl}/${id}`;
		return this.http.delete(url, this.options)
							.catch(this.utils.handleError.bind(this.utils));
	}

	getAll(): Observable<MuseumTemplate[]> {
		return this.http.get(this.museumTemplatesUrl + '?get=media', this.options)
							.map(response => response.json() as MuseumTemplate[])
							.catch(this.utils.handleError.bind(this.utils));
	}

	get(id: string): Observable<MuseumTemplate> {
		const url = `${this.museumTemplatesUrl}/${id}`;
		return this.http.get(url + '?get=media', this.options)
							.map(response => response.json() as MuseumTemplate)
							.catch(this.utils.handleError.bind(this.utils));
	}

	update(museumTemplate: MuseumTemplate): Observable<MuseumTemplate> {
			const url = `${this.museumTemplatesUrl}/${museumTemplate._id}`;
			return this.http.put(url, JSON.stringify(museumTemplate), this.options)
								.map(() => museumTemplate)
								.catch(this.utils.handleError.bind(this.utils));
	}
}