import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainIntentsComponent } from './maintain-intents.component';

describe('MaintainIntentsComponent', () => {
  let component: MaintainIntentsComponent;
  let fixture: ComponentFixture<MaintainIntentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainIntentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainIntentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
