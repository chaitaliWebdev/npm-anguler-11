import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatLeftComponent } from './chat-left.component';

describe('ChatLeftComponent', () => {
  let component: ChatLeftComponent;
  let fixture: ComponentFixture<ChatLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatLeftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
