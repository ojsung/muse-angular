import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HaniModalComponent } from './hani-modal.component';

describe('HaniModalComponent', () => {
  let component: HaniModalComponent;
  let fixture: ComponentFixture<HaniModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HaniModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HaniModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
