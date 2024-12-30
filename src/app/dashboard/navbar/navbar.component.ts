import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  form_pass: FormGroup;

  nombre_usuario = localStorage.getItem('usuario');
  id_usuario = localStorage.getItem('id_usuario');
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private AuthService: AuthService,
    private MapService: MapService
    ) {
      this.form_pass = this.fb.group({
        pass: [''],
        pass2: [''],

      });
  }

  ngOnInit(): void {

  }
  loggout(){
    localStorage.clear();
    this.router.navigate(['/']);
  }

  cambio_pass(){
    if(this.form_pass.value.pass!=this.form_pass.value.pass2){
      Swal.fire({
        title: 'Error',
        text: `los campos de password deben ser iguales`,
        icon: 'error',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ok'
      })
    }else{
      const parametros = {
        id_usuario: this.id_usuario,
        pass: this.form_pass.value.pass,
        pass2: this.form_pass.value.pass2,
      };
      // console.log(this.form.value)
      this.AuthService.CambioPass(parametros).subscribe((res: any) => {
          this.loggout();
     });
    }

  }

  resize(){
    //console.log("entra");
    let mapa = this.MapService.getMap();
    window.setTimeout(function() {
    mapa?.resize();
    //mapa?._resizeCanvas;
    //console.log("en el timeout");
    },300)
    //console.log("despues del resize");
  }

}
