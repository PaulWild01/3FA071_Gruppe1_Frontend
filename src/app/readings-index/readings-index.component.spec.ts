import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadingsIndexComponent } from './readings-index.component';

describe('ReadingsIndexComponent', () => {
  let component: ReadingsIndexComponent;
  let fixture: ComponentFixture<ReadingsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadingsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadingsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
