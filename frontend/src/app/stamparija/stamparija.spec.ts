import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StamparijaComponent } from './stamparija';

describe('StamparijaComponent', () => {
  let component: StamparijaComponent;
  let fixture: ComponentFixture<StamparijaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StamparijaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StamparijaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
