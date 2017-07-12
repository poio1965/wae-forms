import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.less']
})

export class AppComponent implements OnInit {

	translatedText: string;
	supportedLanguages: any[] = [
		{ display: 'English', value: 'en' },
		{ display: 'Español', value: 'es' }
	];

	constructor(private translateService: TranslateService,
		private router: Router) {

		const browserLang = translateService.getBrowserLang();
		// this language will be used as a fallback when a translation isn't found in the current language
		translateService.setDefaultLang('en');
		// the lang to use, if the lang isn't available, it will use the current loader to get them
		const isSupported = this.supportedLanguages.find(supportedLanguage => supportedLanguage.value === browserLang);

		if (isSupported) {
			translateService.use(browserLang);
		} else {
			translateService.use('en');
		}

		translateService.use('es');

		
	}

	ngOnInit(): void {
	}

	

	toHomepage() {
		//this.utils.navigate(['/']);
	}

	selectLanguage(value: string) {
		this.translateService.use(value);
	}

	isCurrentLang(lang: string) {
		// check if the selected lang is current lang
		return lang === this.translateService.currentLang;
	}
}
