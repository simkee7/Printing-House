import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KlijentProizvodDetaljiComponent } from './klijent-proizvod-detalji';

describe('KlijentProizvodDetaljiComponent', () => {
  let component: KlijentProizvodDetaljiComponent;
  let fixture: ComponentFixture<KlijentProizvodDetaljiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KlijentProizvodDetaljiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KlijentProizvodDetaljiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
