import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadingShowComponent } from './readings-show.component';

describe('CustomerShowComponent', () => {
  let component: ReadingShowComponent;
  let fixture: ComponentFixture<ReadingShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadingShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadingShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
