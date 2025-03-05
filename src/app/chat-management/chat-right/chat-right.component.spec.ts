import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRightComponent } from './chat-right.component';

describe('ChatRightComponent', () => {
  let component: ChatRightComponent;
  let fixture: ComponentFixture<ChatRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatRightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
