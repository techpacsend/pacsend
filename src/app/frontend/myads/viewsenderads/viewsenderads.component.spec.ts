import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsenderadsComponent } from './viewsenderads.component';

describe('ViewsenderadsComponent', () => {
  let component: ViewsenderadsComponent;
  let fixture: ComponentFixture<ViewsenderadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewsenderadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewsenderadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
