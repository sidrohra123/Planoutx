import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefernearnPage } from './refernearn.page';

describe('RefernearnPage', () => {
  let component: RefernearnPage;
  let fixture: ComponentFixture<RefernearnPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefernearnPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefernearnPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
