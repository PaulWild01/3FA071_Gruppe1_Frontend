import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadingCreateComponent } from './readings-create.component';

describe('CustomerCreateComponent', () => {
  let component: ReadingCreateComponent;
  let fixture: ComponentFixture<ReadingCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadingCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadingCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
