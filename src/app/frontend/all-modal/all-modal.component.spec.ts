
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AllModalComponent } from './all-modal.component';

describe('AllModalComponent', () => {
  let component: AllModalComponent;
  let fixture: ComponentFixture<AllModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
