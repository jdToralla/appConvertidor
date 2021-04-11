import {Component, ViewChild, ChangeDetectorRef} from '@angular/core';
import swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  area: number;
  perimetro: number;
  areaCuerda: number;
  perimetroCuerda: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  panelOpenState:boolean
  displayedColumns: string[] = ['area', 'perimetro', 'areaCuerda', 'perimetroCuerda'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  dataSource2:PeriodicElement
  optionCuerda:string
  valor:string
  measures={
    nCuerda: '',
    nYarda: '',
    nPulgada: '',
    nMetro: '',
    nCuarta: '',
    
    sCuerda: '',
    sYarda: '',
    sPulgada: '',
    sMetro: '',
    sCuarta: '',
    
    eCuerda: '',
    eYarda: '',
    ePulgada: '',
    eMetro: '',
    eCuarta: '',
    
    oCuerda: '',
    oYarda: '',
    oPulgada: '',
    oMetro: '',
    oCuarta: '',
  }


  constructor(private changeDetectorRefs: ChangeDetectorRef){
    this.panelOpenState = false
    this.optionCuerda = ''
    this.dataSource = new MatTableDataSource()
    this.valor = ''
    this.dataSource2 = {
      area: 0,
      perimetro: 0,
      areaCuerda: 0,
      perimetroCuerda: 0
    }
  }
  
  addNort(){
    if(this.optionCuerda === ''){
      swal.fire({
        icon:'error',
        text:'Seleccione el tipo de cuerda',
      })
    }
    
    if(this.optionCuerda == 'Ixil'){
      
      
      let norte = this.covertMeter(25,this.measures.nCuerda, this.measures.nYarda, this.measures.nPulgada, this.measures.nMetro,this.measures.nCuarta)
      let sur = this.covertMeter(25,this.measures.sCuerda, this.measures.sYarda, this.measures.sPulgada, this.measures.sMetro,this.measures.sCuarta)
      let este = this.covertMeter(25,this.measures.eCuerda, this.measures.eYarda, this.measures.ePulgada, this.measures.eMetro,this.measures.eCuarta)
      let oeste = this.covertMeter(25,this.measures.oCuerda, this.measures.oYarda, this.measures.oPulgada, this.measures.oMetro,this.measures.oCuarta)
  
      const area = (norte + sur)/2 * (este + oeste)/2
      const perimetro = norte + sur + este + oeste
      this.result(area, perimetro,436.7118)
    
    }else if(this.optionCuerda == 'Quiche'){
      
      let norte = this.covertMeter(30,this.measures.nCuerda, this.measures.nYarda, this.measures.nPulgada, this.measures.nMetro, this.measures.nCuarta)
      let sur = this.covertMeter(30,this.measures.sCuerda, this.measures.sYarda, this.measures.sPulgada, this.measures.sMetro,this.measures.sCuarta)
      let este = this.covertMeter(30,this.measures.eCuerda, this.measures.eYarda, this.measures.ePulgada, this.measures.eMetro,this.measures.eCuarta)
      let oeste = this.covertMeter(30,this.measures.oCuerda, this.measures.oYarda, this.measures.oPulgada, this.measures.oMetro,this.measures.oCuarta)
  
      const area = (norte + sur)/2 * (este + oeste)/2
      const perimetro = norte + sur + este + oeste
      this.result(area, perimetro,628.8649)

    }

  }
  
  data = {
    area: 0,
    perimetro: 0,
    areaCuerda: 0,
    perimetroCuerda:0
  }

  result(area:any, perimetro:any, cuerdaCuadrada:any){
    
    this.data = {
      area: 0,
      perimetro: 0,
      areaCuerda: 0,
      perimetroCuerda:0
    }

    swal.fire({
      icon:'success',
      text: `Calculo realizado correctamente`
    })

    this.data ={
      area: area.toFixed(2),
      perimetro: perimetro.toFixed(2),
      areaCuerda: parseFloat(( area /cuerdaCuadrada).toFixed(2)),
      perimetroCuerda: parseFloat((perimetro/(436.7118 * 436.7118)).toFixed(2))
    }

    this.valor = `Área (m²):${this.data.area}, Área (cuerda²): ${this.data.areaCuerda}`
    this.dataSource.data.push(this.data);
    this.dataSource2 = this.data
    this.refresh()

  }

  refresh(): void {
     this.dataSource.data = this.dataSource.data;
  }

  cancel(){

    const measures={
    nCuerda: '',
    nYarda: '',
    nPulgada: '',
    nMetro: '',
    nCuarta: '',
    
    sCuerda: '',
    sYarda: '',
    sPulgada: '',
    sMetro: '',
    sCuarta: '',
    
    eCuerda: '',
    eYarda: '',
    ePulgada: '',
    eMetro: '',
    eCuarta: '',
    
    oCuerda: '',
    oYarda: '',
    oPulgada: '',
    oMetro: '',
    oCuarta: '',
    }
    this.measures = measures
    this.dataSource2 = {
      area: 0,
      perimetro: 0,
      areaCuerda: 0,
      perimetroCuerda: 0
    }
    
  }

  selection(even:any){
    this.optionCuerda = even
  }

  covertMeter(numeroVaras:any, cuerda:any, yarda:any, pulgada:any, metro:any, cuarta:any){
    
    const valorVara = 0.835906
    const valorCuerda = valorVara * parseFloat(numeroVaras)
    const valorPulgada = 0.0254
    const valorCuarta = 0.2286

    //25 varas tiene una cuerda
    if(!cuerda){ cuerda = 0 }
    if(!yarda){ yarda = 0 }
    if(!pulgada){ pulgada = 0 }
    if(!metro){ metro = 0 }
    if(!cuarta){ cuarta = 0 }
  
    // 628.8649
    return (parseFloat(cuerda) * valorCuerda) +  (parseFloat(yarda) * valorVara) + (parseFloat(pulgada) * valorPulgada) + (parseFloat(metro) + (parseFloat(cuarta)) * valorCuarta)
  }

}
