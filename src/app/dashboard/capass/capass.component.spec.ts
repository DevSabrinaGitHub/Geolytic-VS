import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapassComponent } from './capass.component';

describe('CapassComponent', () => {
  let component: CapassComponent;
  let fixture: ComponentFixture<CapassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
