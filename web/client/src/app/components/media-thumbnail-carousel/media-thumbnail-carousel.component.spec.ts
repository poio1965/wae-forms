import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaThumbnailCarouselComponent } from './media-thumbnail-carousel.component';

describe('MediaThumbnailCarouselComponent', () => {
  let component: MediaThumbnailCarouselComponent;
  let fixture: ComponentFixture<MediaThumbnailCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaThumbnailCarouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaThumbnailCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
