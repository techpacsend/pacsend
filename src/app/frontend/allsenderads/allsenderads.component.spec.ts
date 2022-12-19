import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllsenderadsComponent } from './allsenderads.component';

describe('AllsenderadsComponent', () => {
  let component: AllsenderadsComponent;
  let fixture: ComponentFixture<AllsenderadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllsenderadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllsenderadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
