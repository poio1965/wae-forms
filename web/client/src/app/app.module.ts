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
import { InputDropZoneListComponent } from './components/input-drop-zone-list/input-drop-zone-list.component';
import { MediaThumbnailCarouselComponent } from './components/media-thumbnail-carousel/media-thumbnail-carousel.component';
import { InputTagsComponent } from './components/input-tags/input-tags.component';
import { RestaurantTemplateComponent } from './components/restaurant-template/restaurant-template.component';

import { Utils } from './helpers/utils';

import { RestaurantTemplateService } from './services/restaurant-template.service';
import { MediaService } from './services/media.service';


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
		AppComponent,
		InputDropZoneListComponent,
		InputTagsComponent,
		MediaThumbnailCarouselComponent,
		RestaurantTemplateComponent
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
			apiKey: 'AIzaSyBgQSsE7yDoV4sD6GPlANFQiAVzPDVacOo',
			libraries: ["places"]
		}),
		TreeModule
	],
	providers: [		
		{
			provide: AuthHttp,
			useFactory: authHttpServiceFactory,
			deps: [Http, RequestOptions ]
		},
		MediaService,
		RestaurantTemplateService,
		Utils
	],
	entryComponents: [],
	bootstrap: [AppComponent]
})


export class AppModule {

}

