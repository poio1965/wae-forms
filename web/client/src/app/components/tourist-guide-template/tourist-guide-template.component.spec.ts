/* tslint:disable:no-unused-variable */
import { TestBed, async } from '@angular/core/testing';
import { TouristGuideTemplateComponent } from './tourist-guide-template.component';
describe('AppComponent', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [
				TouristGuideTemplateComponent
			],
		});
		TestBed.compileComponents();
	});

	it('should create the app', async(() => {
		const fixture = TestBed.createComponent(TouristGuideTemplateComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	}));

	it(`should have as title 'app works!'`, async(() => {
		const fixture = TestBed.createComponent(TouristGuideTemplateComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app.title).toEqual('app works!');
	}));

	it('should render title in a h1 tag', async(() => {
		const fixture = TestBed.createComponent(TouristGuideTemplateComponent);
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		expect(compiled.querySelector('h1').textContent).toContain('app works!');
	}));
});
