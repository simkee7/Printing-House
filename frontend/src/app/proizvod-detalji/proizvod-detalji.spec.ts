import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProizvodDetaljiComponent } from './proizvod-detalji';

describe('ProizvodDetaljiComponent', () => {
  let component: ProizvodDetaljiComponent;
  let fixture: ComponentFixture<ProizvodDetaljiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProizvodDetaljiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProizvodDetaljiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
