import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StamparijaNarudzbineComponent } from './stamparija-narudzbine';

describe('StamparijaNarudzbineComponent', () => {
  let component: StamparijaNarudzbineComponent;
  let fixture: ComponentFixture<StamparijaNarudzbineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StamparijaNarudzbineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StamparijaNarudzbineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
