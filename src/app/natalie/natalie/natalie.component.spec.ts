import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NatalieComponent } from './natalie.component';

describe('NatalieComponent', () => {
  let component: NatalieComponent;
  let fixture: ComponentFixture<NatalieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NatalieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NatalieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
