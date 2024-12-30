import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

declare var $: any; // Declaración para usar jQuery
@Component({
  selector: 'app-abmcapas',
  templateUrl: './abmcapas.component.html',
  styleUrls: ['./abmcapas.component.css']
})
export class AbmcapasComponent implements OnInit {

  form: FormGroup;
  accion:any
  Capa:any
  nombre_capa:any;
  capa:any;
  tipo:any;
  datos:any;
  id:any;
  correo:any
  selectedAttributes: string[] = []; // Cambiado a un array
  availableAttributes: string[] = []; // Atributos iniciales disponibles


  // Variables auxiliares para ngModel
  availableAttribute: string | null = null;
  selectedAttribute: string | null = null;

  password:any
  uniqueAttributes: string[] = [];
  editable: boolean = true;  
  constructor(
    private AuthService: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id: [''],
      nombre_capa: ['', Validators.required],
      nombre_persona: ['', Validators.required],
      correo: [''],
      estado: [''],
    });
   }

  ngOnInit(): void {
    this.getAtributosCapas();
    this.getCapas(this.selectedAttributes);
  }
  logSelectedAttributes(): void {
     console.log(this.selectedAttributes);
    this.getCapas(this.selectedAttributes);
  }
  ngAfterViewInit(): void {
    // Inicializa Select2
    $('#atributosSelect').select2({
      theme: 'bootstrap-4', // Estilizado para Bootstrap 5
      placeholder: 'Selecciona atributos',
      allowClear: true
    });

    // Carga las opciones dinámicamente
    this.loadOptions();
  }

  // Carga las opciones en el select2
  loadOptions(): void {
    const select = $('#atributosSelect');
    this.uniqueAttributes.forEach(attr => {
      const option = new Option(attr, attr, false, false);
      select.append(option).trigger('change'); // Agrega opciones y actualiza
    });
  }

  // Obtén los valores seleccionados
  getSelectedValues(): string[] {
    return $('#atributosSelect').val();
  }

  selectAttribute(attribute: any): void {
    const selectedOptions = Array.from((attribute.target as HTMLSelectElement).selectedOptions);
    this.selectedAttributes = selectedOptions.map(option => option.value);
  }

  getAtributosCapas() {
    let filtro=[]
    this.AuthService.getCapas(filtro).subscribe((res: any) => {
        //  console.log(res)
        this.uniqueAttributes = [...new Set(
          (res as any[])
            .flatMap(row => row.atributos)
        )]; 
        this.availableAttributes = [...this.uniqueAttributes]
      
    });
  }
  getCapas(filtro:any) {
    console.log(filtro)
    this.AuthService.getCapas(filtro).subscribe((res: any) => {
      this.datos=res;
    });
  }

  bajaItem(item: any): void {
    // Cambiar estado a 'inactivo' y realizar lógica adicional
    item.estado = 'inactivo';
    const payload = {
      nombre: item.nombre,
      estado: 'Baja'
    };
    this.AuthService.bajaCapas(payload).subscribe((res: any) => {
        item.estado = 'inactivo'; // Actualiza el estado localmente
      },
      (error) => {
        console.error('Error al dar de baja:', error);
      });
  }
  
  altaItem(item: any): void {
    // Cambiar estado a 'activo' y realizar lógica adicional
    item.estado = 'activo';
    const payload = {
      nombre: item.nombre,
    };
    this.AuthService.altaCapas(payload).subscribe((res: any) => {
        item.estado = 'activo'; // Actualiza el estado localmente
      },
      (error) => {
        console.error('Error al dar de baja:', error);
      });
    
  }
 
  

}
