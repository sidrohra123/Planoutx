import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiktokPage } from './tiktok.page';

describe('TiktokPage', () => {
  let component: TiktokPage;
  let fixture: ComponentFixture<TiktokPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiktokPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiktokPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
