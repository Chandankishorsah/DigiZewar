import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecieptPrintComponent } from './reciept-print.component';

describe('RecieptPrintComponent', () => {
  let component: RecieptPrintComponent;
  let fixture: ComponentFixture<RecieptPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecieptPrintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecieptPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
