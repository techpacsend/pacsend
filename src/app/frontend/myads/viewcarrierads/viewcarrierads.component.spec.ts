import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewcarrieradsComponent } from './viewcarrierads.component';

describe('ViewcarrieradsComponent', () => {
  let component: ViewcarrieradsComponent;
  let fixture: ComponentFixture<ViewcarrieradsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewcarrieradsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewcarrieradsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
