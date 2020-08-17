import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewaddressPage } from './addnewaddress.page';

describe('AddnewaddressPage', () => {
  let component: AddnewaddressPage;
  let fixture: ComponentFixture<AddnewaddressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddnewaddressPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnewaddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
