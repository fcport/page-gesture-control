import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialIconComponent } from './tutorial-icon.component';

describe('TutorialIconComponent', () => {
  let component: TutorialIconComponent;
  let fixture: ComponentFixture<TutorialIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorialIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorialIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
