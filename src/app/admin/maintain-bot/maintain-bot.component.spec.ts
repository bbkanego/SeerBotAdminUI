import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainBotComponent } from './maintain-bot.component';

describe('MaintainBotComponent', () => {
  let component: MaintainBotComponent;
  let fixture: ComponentFixture<MaintainBotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainBotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
