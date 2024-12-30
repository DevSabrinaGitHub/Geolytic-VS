import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  roles: any[] = [];
  form: FormGroup;
  accion: string = 'Crear';
  showModal: boolean = false;
  constructor(private fb: FormBuilder, private AuthService: AuthService) {
    this.form = this.fb.group({
      id_rol: [''],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerRoles();
  }

  obtenerRoles() {
    this.AuthService.getRoles().subscribe((data: any[]) => {
      this.roles = data;
    });
  }
  nuevoRol() {
    this.accion = 'Crear';
    this.form.reset();
    this.showModal = true;
    // $('#rolModal').modal('show'); // Asegúrate de tener jQuery o usa otra forma de abrir el modal
  }
  editarRol(rol: any) {
    this.accion = 'Editar';
    this.form.patchValue(rol);
    this.showModal = true;
    // $('#rolModal').modal('show'); // Asegúrate de tener jQuery o usa otra forma de abrir el modal
  }

  eliminarRol(id: number) {
    if (confirm('¿Está seguro de que desea eliminar este rol?')) {
      this.AuthService.deleteRol(id).subscribe(() => {
        this.obtenerRoles();
      });
    }
  }
  cerrarModal() {
    this.showModal = false;
  }
  accion_form() {
    if (this.form.valid) {
      if (this.accion === 'Crear') {
        this.AuthService.createRol(this.form.value).subscribe(() => {
          this.obtenerRoles();
        });
      } else {
        this.AuthService.updateRol(this.form.value).subscribe(() => {
          this.obtenerRoles();
        });
      }
      
      Swal.fire({
        title: 'Gracias',
        text: `El rol se creo exitosamente!`,
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ok'
      }).then((result) => {
        this.form.reset();
      this.accion = 'Crear';
      this.cerrarModal()
      })
      
    }
  }
}
