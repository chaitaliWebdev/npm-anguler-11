import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateGroupAdminComponent } from './add-update-group-admin.component';

describe('AddUpdateGroupAdminComponent', () => {
  let component: AddUpdateGroupAdminComponent;
  let fixture: ComponentFixture<AddUpdateGroupAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateGroupAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateGroupAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
