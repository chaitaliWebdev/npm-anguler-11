import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateChatGroupComponent } from './add-update-chat-group.component';

describe('AddUpdateChatGroupComponent', () => {
  let component: AddUpdateChatGroupComponent;
  let fixture: ComponentFixture<AddUpdateChatGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateChatGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateChatGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
