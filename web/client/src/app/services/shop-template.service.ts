import { Injectable } from '@angular/core';
import { Observable} from 'rxjs/Rx';
import { AuthHttp } from 'angular2-jwt';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Utils } from '../helpers/utils';
import { ShopTemplate } from '../models/shop-template';


@Injectable()
export class ShopTemplateService {
    private shopTemplatesUrl = 'api/shop-template';

	private headers = new Headers({ 'Content-Type': 'application/json' });
  	private options = new RequestOptions({ headers: this.headers });

	constructor(private http: Http, private utils: Utils) {
	}

	create(shopTemplate: ShopTemplate): Observable<ShopTemplate> {
		return this.http.post(this.shopTemplatesUrl, JSON.stringify(shopTemplate), this.options)
							.map(res => res.json())
							.catch(this.utils.handleError.bind(this.utils));
	}

	delete(id: string): Observable<any> {
		const url = `${this.shopTemplatesUrl}/${id}`;
		return this.http.delete(url, this.options)
							.catch(this.utils.handleError.bind(this.utils));
	}

	getAll(): Observable<ShopTemplate[]> {
		return this.http.get(this.shopTemplatesUrl + '?get=media', this.options)
							.map(response => response.json() as ShopTemplate[])
							.catch(this.utils.handleError.bind(this.utils));
	}

	get(id: string): Observable<ShopTemplate> {
		const url = `${this.shopTemplatesUrl}/${id}`;
		return this.http.get(url + '?get=media', this.options)
							.map(response => response.json() as ShopTemplate)
							.catch(this.utils.handleError.bind(this.utils));
	}

	update(shopTemplate: ShopTemplate): Observable<ShopTemplate> {
			const url = `${this.shopTemplatesUrl}/${shopTemplate._id}`;
			return this.http.put(url, JSON.stringify(shopTemplate), this.options)
								.map(() => shopTemplate)
								.catch(this.utils.handleError.bind(this.utils));
	}
}