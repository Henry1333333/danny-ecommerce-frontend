import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioventaListComponent } from './usuarioventa-list.component';

describe('UsuarioventaListComponent', () => {
  let component: UsuarioventaListComponent;
  let fixture: ComponentFixture<UsuarioventaListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsuarioventaListComponent]
    });
    fixture = TestBed.createComponent(UsuarioventaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
