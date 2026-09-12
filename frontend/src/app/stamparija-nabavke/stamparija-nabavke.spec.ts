import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StamparijaNabavkeComponent } from './stamparija-nabavke';

describe('StamparijaNabavkeComponent', () => {
  let component: StamparijaNabavkeComponent;
  let fixture: ComponentFixture<StamparijaNabavkeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StamparijaNabavkeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StamparijaNabavkeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
