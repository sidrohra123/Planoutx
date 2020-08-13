import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OccasionsPage } from './occasions.page';

describe('OccasionsPage', () => {
  let component: OccasionsPage;
  let fixture: ComponentFixture<OccasionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccasionsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OccasionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
