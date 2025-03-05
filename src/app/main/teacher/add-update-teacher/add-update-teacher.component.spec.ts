import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateTeacherComponent } from './add-update-teacher.component';

describe('AddUpdateTeacherComponent', () => {
  let component: AddUpdateTeacherComponent;
  let fixture: ComponentFixture<AddUpdateTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateTeacherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
