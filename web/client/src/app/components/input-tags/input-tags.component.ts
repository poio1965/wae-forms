import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService, LangChangeEvent } from 'ng2-translate';

@Component({
	selector: 'app-input-tags',
	templateUrl: './input-tags.component.html',
	styleUrls: ['./input-tags.component.less']
})
export class InputTagsComponent implements OnInit {

	@Input()
	tags: string[];
	@Input()
	inheritedTags: string[];
	@Input()
	name: string;
	@Input()
	id: string;
	@Input()
	label: string;
	@Input()
	tooltip: string;
	labelTranslated: string;
	tooltipTranslated: string;
	tag: string;

	@Output()
	tagsChanged = new EventEmitter();

	constructor(private translateService: TranslateService) {
		this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
			this.setTranslatedLabel();
		});
	}

	ngOnInit() {
		this.setTranslatedLabel();
	}

	setTranslatedLabel() {
		this.translateService.get(this.label).subscribe((res: string) => {
			this.labelTranslated = res;
		});
		if (this.tooltip) {
			this.translateService.get(this.tooltip).subscribe((res: string) => {
				this.tooltipTranslated = res;
			});
		}
	}

	addTag(): void {
		if (this.tags === undefined) {
			this.tags = [];
		}
		const tagsLength = this.tags.length;
		if (this.tag) {
			const tags = this.tag.split(',');
			tags.forEach(tag => {
				tag = tag.trim();
				if (tag && !this.repeatedTag(tag)) {
					this.tags.push(tag);					
				}
			});
			this.tag = '';
			if (tagsLength !== this.tags.length) {
				this.tagsChanged.emit();
			}		
		}
	}

	deleteTag(tag: string): void {
		if (this.tags) {
			this.tags.splice(this.tags.indexOf(tag), 1);
			this.tagsChanged.emit();
		}		
	}

	repeatedTag(tag: string): boolean {
		if (this.tags) {
			return this.tags.indexOf(tag) > -1;
		}
	}
}
