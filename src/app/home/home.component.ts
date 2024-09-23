import { Component } from '@angular/core';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import { Categoria } from '../models/categoria';
import { CategoriaService } from '../services/categoria.service';
import { DialogModule } from 'primeng/dialog';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog'; 
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TableModule, ButtonModule,DialogModule,RouterModule,InputTextModule,FormsModule,ConfirmDialogModule,ToastModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
 categorias:Categoria[]=[];
 titulo:string='';
 opc:string='';
 categoria= new Categoria();
 op = 0; 
 visible: boolean = false; 
 isDeleteInProgress: boolean = false;

  constructor(
    private categoriaService: CategoriaService,
    private messageService: MessageService
  ){}

  ngOnInit():void{
    this.listarCategorias();
  }
  listarCategorias(){
    this.categoriaService.getCategorias().subscribe((data)=>{
      this.categorias=data;
    });
  }
  hola(id:number){
    console.log('button clicked '+id);
  }
  showDialogCreate() {
    this.titulo="Crear Categoría"
    this.opc="Save";   
    this.op=0;
    this.visible = true; // Cambia la visibilidad del diálogo
  }
  showDialogEdit(id:number) {
    this.titulo="Editar Categoría"
    this.opc="Editar"; 
   this.categoriaService.getCategoriaById(id).subscribe((data)=>{
      this.categoria=data; 
      this.op=1;     
   });    
    this.visible = true; // Cambia la visibilidad del diálogo
  }
  deleteCategoria(id: number) {
    this.isDeleteInProgress = true;
    this.categoriaService.deleteCategoria(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Correcto',
          detail: 'Categoria eliminada',
        });
        this.isDeleteInProgress = false;
        this.listarCategorias();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la categoría',
        });
      },
    });
  }
  addCategoria():void{ 
    this.categoriaService.createCategoria(this.categoria).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Categoria Registrada',
        });
        this.listarCategorias();
        this.op=0;
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo Agregar la categoría',
        });
      },
    });    
    this.visible = false;
  }
  editCategoria(){
    this.categoriaService.updateCategoria(this.categoria,this.categoria.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Categoria Editada',
        });
        this.listarCategorias();
        console.log(this.categoria.id+' '+this.categoria.nombre+' '+this.categoria.estado);
        this.op=0;
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo Editar la categoría',
        });
      },
    });    
    this.visible = false;
  }
  opcion():void{
    if(this.op==0){
      this.addCategoria();
      this.limpiar();
    }else if(this.op==1){
      console.log("Editar");
      this.editCategoria();
      this.limpiar();
    }else{
      console.log("No se hace nada");
      this.limpiar();
    }
    
  }
 limpiar(){
  this.titulo='';
  this.opc='';
  this.op = 0; 
  this.categoria.id=0;
  this.categoria.nombre='';
  this.categoria.estado='1';
 }
}
