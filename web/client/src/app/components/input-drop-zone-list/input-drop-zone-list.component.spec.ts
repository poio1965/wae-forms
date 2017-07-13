/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import {} from 'jasmine';

import { InputDropZoneListComponent } from './input-drop-zone-list.component';

describe('InputDropZoneComponent', () => {
	let component: InputDropZoneListComponent;
	let fixture: ComponentFixture<InputDropZoneListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ InputDropZoneListComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(InputDropZoneListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
