import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recupero',
  templateUrl: './recupero.component.html',
  styleUrls: ['./recupero.component.css']
})
export class RecuperoComponent {
  form: FormGroup;
  router: Router;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private r: Router,

  ) { 
    this.form = this.fb.group({
      email: ['', Validators.required]
    });
    this.router = r;
  }

  ngOnInit(): void {
  }

  // function to recover password
  

  // function to send email
  enviarEmail(): void {

    let email = this.form.value.email;

    console.log(email);

    if (this.validateEmail(email)) {
      // make petition to the /send-email endpoint
      let data = {
        email: email
      }

      // const url = 'http://localhost:9800/send-email';
       const url = environment.api+'/send-email';
      
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
        .then(response => {
          console.log('Success:', response);
          // return to login
          this.router.navigate(['/login']);
          Swal.fire('Email enviado correctamente');
        })
        .catch(error => {
          console.error('Error:', error);
          Swal.fire('Error al enviar el email');

        });

    } else {
      this.errorMessage = 'Email no válido';
      Swal.fire(this.errorMessage);
    }
  }
  // function to validate email
  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  // function to validate password
  // function to validate password confirmation
  // function to change password


}
