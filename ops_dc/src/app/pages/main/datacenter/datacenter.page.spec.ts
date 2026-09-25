import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatacenterPage } from './datacenter.page';

describe('DatacenterPage', () => {
  let component: DatacenterPage;
  let fixture: ComponentFixture<DatacenterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DatacenterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
