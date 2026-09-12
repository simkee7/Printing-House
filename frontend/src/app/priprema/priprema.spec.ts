import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PripremaComponent } from './priprema';

describe('PripremaComponent', () => {
  let component: PripremaComponent;
  let fixture: ComponentFixture<PripremaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PripremaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PripremaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
