import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArhivaProizvodaComponent } from './arhiva-proizvoda';

describe('ArhivaProizvodaComponent', () => {
  let component: ArhivaProizvodaComponent;
  let fixture: ComponentFixture<ArhivaProizvodaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArhivaProizvodaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArhivaProizvodaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
