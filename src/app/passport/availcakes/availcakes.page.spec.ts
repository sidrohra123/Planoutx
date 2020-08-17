import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailcakesPage } from './availcakes.page';

describe('AvailcakesPage', () => {
  let component: AvailcakesPage;
  let fixture: ComponentFixture<AvailcakesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailcakesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailcakesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
