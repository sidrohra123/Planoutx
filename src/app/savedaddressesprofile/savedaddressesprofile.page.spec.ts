import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedaddressesprofilePage } from './savedaddressesprofile.page';

describe('SavedaddressesprofilePage', () => {
  let component: SavedaddressesprofilePage;
  let fixture: ComponentFixture<SavedaddressesprofilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedaddressesprofilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedaddressesprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
