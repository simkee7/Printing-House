import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EkorpaComponent } from './ekorpa';

describe('EkorpaComponent', () => {
  let component: EkorpaComponent;
  let fixture: ComponentFixture<EkorpaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EkorpaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EkorpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
