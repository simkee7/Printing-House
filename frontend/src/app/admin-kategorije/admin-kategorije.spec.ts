import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminKategorijeComponent } from './admin-kategorije';

describe('AdminKategorijeComponent', () => {
  let component: AdminKategorijeComponent;
  let fixture: ComponentFixture<AdminKategorijeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminKategorijeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminKategorijeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
