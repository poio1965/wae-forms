import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragulaModule } from 'ng2-dragula';
import { FileUploadModule } from 'ng2-file-upload';
import { NguiAutoCompleteModule  } from '@ngui/auto-complete';
import { TranslateModule, TranslateStaticLoader, TranslateLoader } from 'ng2-translate';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { CalendarModule } from 'angular-calendar';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { TreeModule } from 'angular-tree-component';
import { AgmCoreModule } from '@agm/core';

import { AppRoutingModule } from './app.routing.module';

import { AppComponent } from './components/app/app.component';


export function createTranslateLoader(http: Http) {
		return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
	return new AuthHttp(new AuthConfig({
		tokenName: 'id_sage_token',
		globalHeaders: [{'Content-Type': 'application/json'}]
	}), http, options);
}

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		AppRoutingModule,
		DragulaModule,
		DragAndDropModule,
		NguiAutoCompleteModule,
		FileUploadModule,
		CalendarModule.forRoot(),
		NgbModule.forRoot(),
		TranslateModule.forRoot({
				provide: TranslateLoader,
				useFactory: (createTranslateLoader),
				deps: [Http]
		}),
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyBgQSsE7yDoV4sD6GPlANFQiAVzPDVacOo'
		}),
		TreeModule
	],
	providers: [		
		{
			provide: AuthHttp,
			useFactory: authHttpServiceFactory,
			deps: [Http, RequestOptions ]
		}
	],
	entryComponents: [],
	bootstrap: [AppComponent]
})


export class AppModule {

}

