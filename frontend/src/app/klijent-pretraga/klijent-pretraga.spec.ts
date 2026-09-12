import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KlijentPretragaComponent } from './klijent-pretraga';

describe('KlijentPretragaComponent', () => {
  let component: KlijentPretragaComponent;
  let fixture: ComponentFixture<KlijentPretragaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KlijentPretragaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KlijentPretragaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
