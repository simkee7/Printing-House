import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StamparijaIzvestavanjeComponent } from './stamparija-izvestavanje';

describe('StamparijaIzvestavanjeComponent', () => {
  let component: StamparijaIzvestavanjeComponent;
  let fixture: ComponentFixture<StamparijaIzvestavanjeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StamparijaIzvestavanjeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StamparijaIzvestavanjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
