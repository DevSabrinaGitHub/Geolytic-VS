// src/app/registro-usuarios/registro-usuarios.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Route, Router } from '@angular/router';


@Component({
  selector: 'app-registro-usuarios',
  templateUrl: './registro-usuarios.component.html',
  styleUrls: ['./registro-usuarios.component.css']
})
export class RegistroUsuariosComponent implements OnInit {
  form: FormGroup;
  showModal: boolean = false;
  accion: string = 'Registrar';

  constructor(
    private AuthService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      nombre_persona: ['', Validators.required],
      email: ['', Validators.required],
      estado: ['activo', Validators.required],
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void { }

  passwordMatchValidator(form: FormGroup) {
    return form.controls['password'].value === form.controls['confirmPassword'].value 
      ? null : { 'mismatch': true };
  }

  onSubmit() {
    if (this.form.valid) {
      const { confirmPassword, ...userData } = this.form.value;
      this.AuthService.registerUsuario(userData).subscribe((data) => {

        alert('Usuario registrado con éxito');
        this.router.navigate(['/registro']);
        this.form.reset();

      }, (error) => {
        alert('Error al registrar el usuario');
      });
    }
  }
}

