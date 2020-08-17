import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAddressProfilePage } from './add-address-profile.page';

describe('AddAddressProfilePage', () => {
  let component: AddAddressProfilePage;
  let fixture: ComponentFixture<AddAddressProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAddressProfilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAddressProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
