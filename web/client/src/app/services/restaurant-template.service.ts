import { Injectable } from '@angular/core';
import { Observable} from 'rxjs/Rx';
import { AuthHttp } from 'angular2-jwt';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Utils } from '../helpers/utils';
import { RestaurantTemplate } from '../models/restaurant-template';


@Injectable()
export class RestaurantTemplateService {
    private restaurantTemplatesUrl = 'api/restaurant-template';

	private headers = new Headers({ 'Content-Type': 'application/json' });
  	private options = new RequestOptions({ headers: this.headers });

	constructor(private http: Http, private utils: Utils) {
	}

	create(restaurantTemplate: RestaurantTemplate): Observable<RestaurantTemplate> {
		return this.http.post(this.restaurantTemplatesUrl, JSON.stringify(restaurantTemplate), this.options)
							.map(res => res.json())
							.catch(this.utils.handleError.bind(this.utils));
	}

	delete(id: string): Observable<any> {
		const url = `${this.restaurantTemplatesUrl}/${id}`;
		return this.http.delete(url, this.options)
							.catch(this.utils.handleError.bind(this.utils));
	}

	getAll(): Observable<RestaurantTemplate[]> {
		return this.http.get(this.restaurantTemplatesUrl + '?get=media', this.options)
							.map(response => response.json() as RestaurantTemplate[])
							.catch(this.utils.handleError.bind(this.utils));
	}

	get(id: string): Observable<RestaurantTemplate> {
		const url = `${this.restaurantTemplatesUrl}/${id}`;
		return this.http.get(url + '?get=media', this.options)
							.map(response => response.json() as RestaurantTemplate)
							.catch(this.utils.handleError.bind(this.utils));
	}

	update(restaurantTemplate: RestaurantTemplate): Observable<RestaurantTemplate> {
			const url = `${this.restaurantTemplatesUrl}/${restaurantTemplate._id}`;
			return this.http.put(url, JSON.stringify(restaurantTemplate), this.options)
								.map(() => restaurantTemplate)
								.catch(this.utils.handleError.bind(this.utils));
	}
}