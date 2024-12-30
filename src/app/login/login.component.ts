import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loading = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private AuthService: AuthService
  ) {
    this.form = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  login() {
    // this.router.navigate(['/dashboard']);
    const parametros = {
      usuario: this.form.value.usuario,
      password: this.form.value.password,
    };
    this.AuthService.login(parametros).subscribe((res: any) => {
      if (res.status) {
         localStorage.setItem('token', res.token);
         localStorage.setItem('id', res.datos.id);
         localStorage.setItem('rol', res.datos.id_rol);
         localStorage.setItem('usuario', res.datos.nameuser);
         this.router.navigate(['/dashboard/visualizador']);
      } else {
        Swal.fire(res.mensaje);
      }
    });
  }

  registro() {
    this.router.navigate(['/registro']);
  }

  recupero_cuenta() {
    this.router.navigate(['/recupero']);
  }
}
