import { Injectable, EventEmitter} from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { Router } from '@angular/router';

import {Observable} from 'rxjs/Rx';


@Injectable()
export class Utils {    
    gmapsKey: string;

    constructor(private translateService: TranslateService, private router: Router) {
		this.gmapsKey = "AIzaSyBgQSsE7yDoV4sD6GPlANFQiAVzPDVacOo";
    }
    
    navigate(commands: any[], extras?): void {
		this.router.navigate(commands, extras);
	}

	handleError(error: any): any {
		console.error('An error occurred', error);
		switch (error.status) {
			// Unauthorized
			case 401:
				this.navigate(['/login', { message: 'TokenExpired' }]);
				break;
			default:
		}
		return Observable.throw(error.message || error);
		}
	
	public maxLength(text: string, charNumber: number) {
		if (!text) {
			return;
		}
		if (!charNumber) {
			charNumber = 20;
		}
		if (text.length > charNumber) {
			text = text.substring(0, charNumber) + '...';
		}
		return text;
	}
}