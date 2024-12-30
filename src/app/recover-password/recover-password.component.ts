import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-recover-password',
    templateUrl: './recover-password.component.html',
    styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent implements OnInit {
    
    form: FormGroup;
    token: string = '';
    route: ActivatedRoute;
    router: Router;

    constructor(private http: HttpClient, private fb: FormBuilder, route: ActivatedRoute, router: Router) {
        

        this.form = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
        });

        this.route = route;
        this.router = router;
    }

    ngOnInit(): void {
        this.token = this.route.snapshot.queryParams['token'];
        this.checkTokenValidity();
    }

    checkTokenValidity() {
        const token = this.token;
        this.http.post('http://localhost:9800/validate-token', {token: token}).subscribe(
            response => {
                console.log('Token is valid', response);
                
            },
            error => {
                console.error('Token is invalid', error);
                Swal.fire('El enlace es inválido o ha expirado');
                this.router.navigate(['/login']);
            }
        );
    }

    sendNewPassword(): void {
        const newPassword = this.form.get('password')?.value;
        fetch('http://localhost:9800/usuarios/reset-password', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            token: this.token,
            password: newPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Password has been reset', data);
            Swal.fire('La contraseña ha sido cambiada con éxito');
            this.router.navigate(['/login']);
        })
        .catch(error => {
            console.error('Error resetting password', error);
            Swal.fire('Ha ocurrido un error al cambiar la contraseña');
        });
    }
}