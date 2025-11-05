import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWardsComponent } from './admin-wards.component';

describe('AdminWardsComponent', () => {
  let component: AdminWardsComponent;
  let fixture: ComponentFixture<AdminWardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminWardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminWardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
