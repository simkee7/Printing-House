import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DodavanjeIzFajlaComponent } from './dodavanje-iz-fajla';

describe('DodavanjeIzFajlaComponent', () => {
  let component: DodavanjeIzFajlaComponent;
  let fixture: ComponentFixture<DodavanjeIzFajlaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DodavanjeIzFajlaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DodavanjeIzFajlaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
