import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StamparijaProizvodiComponent } from './stamparija-proizvodi';

describe('StamparijaProizvodiComponent', () => {
  let component: StamparijaProizvodiComponent;
  let fixture: ComponentFixture<StamparijaProizvodiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StamparijaProizvodiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StamparijaProizvodiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
