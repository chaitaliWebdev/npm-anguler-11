import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateQuickReplyComponent } from './add-update-quick-reply.component';

describe('AddUpdateQuickReplyComponent', () => {
  let component: AddUpdateQuickReplyComponent;
  let fixture: ComponentFixture<AddUpdateQuickReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateQuickReplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateQuickReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
