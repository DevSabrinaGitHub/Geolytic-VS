// src/app/usuarios/usuarios.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  roles: any[] = [];
  form: FormGroup;
  showModal: boolean = false;
  accion: string = 'Crear';
  usuarioSeleccionado: any = null;

  constructor(
    private AuthService: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id_usuario: [null],
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
      nombre_persona: ['', Validators.required],
      id_rol: [null, Validators.required],
      estado: ['', Validators.required],
      id_dominio: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.obtenerRoles();
  }

  obtenerRoles() {
    this.AuthService.getRoles().subscribe((data: any[]) => {
      this.roles = data;
    });
  }

  cargarUsuarios() {
    this.AuthService.getUsuarios().subscribe((data) => {
      this.usuarios = data;
    });
  }

  nuevoUsuario() {
    this.form.reset();
    this.accion = 'Crear';
    this.showModal = true;
  }

  editarUsuario(usuario: any) {
    this.form.patchValue(usuario);
    this.accion = 'Editar';
    this.showModal = true;
  }

  accion_form() {
    if (this.accion === 'Crear') {
      this.AuthService.createUsuario(this.form.value).subscribe((data) => {
        this.cargarUsuarios();
        this.showModal = false;
      });
    } else if (this.accion === 'Editar') {
      this.AuthService.updateUsuario(this.form.value.id_usuario, this.form.value).subscribe((data) => {
        this.cargarUsuarios();
        this.showModal = false;
      });
    }
  }

  eliminarUsuario(id: number) {
    this.AuthService.deleteUsuario(id).subscribe((data) => {
      this.cargarUsuarios();
    });
  }

  resetPassUsuario(id: number) {
    this.AuthService.resetPassUsuario(id).subscribe((data) => {
      Swal.fire('El password del usuario se reseteo correctamente. Gracias');
      this.cargarUsuarios();
    });
  }
}
