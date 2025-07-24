import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptCreateComponent } from './receipt-create.component';

describe('ReceiptCreateComponent', () => {
  let component: ReceiptCreateComponent;
  let fixture: ComponentFixture<ReceiptCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiptCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
