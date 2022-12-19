import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllcarrieradsComponent } from './allcarrierads.component';

describe('AllcarrieradsComponent', () => {
  let component: AllcarrieradsComponent;
  let fixture: ComponentFixture<AllcarrieradsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllcarrieradsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllcarrieradsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
