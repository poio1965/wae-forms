import { Injectable } from '@angular/core';
import { Observable} from 'rxjs/Rx';
import { AuthHttp } from 'angular2-jwt';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Utils } from '../helpers/utils';
import { TouristGuideTemplate } from '../models/tourist-guide-template';


@Injectable()
export class TouristGuideTemplateService {
    private touristGuideTemplatesUrl = 'api/tourist-guide-template';

	private headers = new Headers({ 'Content-Type': 'application/json' });
  	private options = new RequestOptions({ headers: this.headers });

	constructor(private http: Http, private utils: Utils) {
	}

	create(touristGuideTemplate: TouristGuideTemplate): Observable<TouristGuideTemplate> {
		return this.http.post(this.touristGuideTemplatesUrl, JSON.stringify(touristGuideTemplate), this.options)
							.map(res => res.json())
							.catch(this.utils.handleError.bind(this.utils));
	}

	delete(id: string): Observable<any> {
		const url = `${this.touristGuideTemplatesUrl}/${id}`;
		return this.http.delete(url, this.options)
							.catch(this.utils.handleError.bind(this.utils));
	}

	getAll(): Observable<TouristGuideTemplate[]> {
		return this.http.get(this.touristGuideTemplatesUrl + '?get=media', this.options)
							.map(response => response.json() as TouristGuideTemplate[])
							.catch(this.utils.handleError.bind(this.utils));
	}

	get(id: string): Observable<TouristGuideTemplate> {
		const url = `${this.touristGuideTemplatesUrl}/${id}`;
		return this.http.get(url + '?get=media', this.options)
							.map(response => response.json() as TouristGuideTemplate)
							.catch(this.utils.handleError.bind(this.utils));
	}

	update(touristGuideTemplate: TouristGuideTemplate): Observable<TouristGuideTemplate> {
			const url = `${this.touristGuideTemplatesUrl}/${touristGuideTemplate._id}`;
			return this.http.put(url, JSON.stringify(touristGuideTemplate), this.options)
								.map(() => touristGuideTemplate)
								.catch(this.utils.handleError.bind(this.utils));
	}
}