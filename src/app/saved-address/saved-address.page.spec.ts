import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedAddressPage } from './saved-address.page';

describe('SavedAddressPage', () => {
  let component: SavedAddressPage;
  let fixture: ComponentFixture<SavedAddressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedAddressPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
