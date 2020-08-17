import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WallethistoryPage } from './wallethistory.page';

describe('WallethistoryPage', () => {
  let component: WallethistoryPage;
  let fixture: ComponentFixture<WallethistoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WallethistoryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallethistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
