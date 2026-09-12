import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilStamparijaComponent } from './profil-stamparija';

describe('ProfilStamparijaComponent', () => {
  let component: ProfilStamparijaComponent;
  let fixture: ComponentFixture<ProfilStamparijaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilStamparijaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilStamparijaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
