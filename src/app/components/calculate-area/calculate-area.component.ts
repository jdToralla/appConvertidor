import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

export interface PeriodicElement {
  area: number;
  perimetro: number;
  areaCuerda: number;
  perimetroCuerda: number;
}

@Component({
  selector: 'app-calculate-area',
  templateUrl: './calculate-area.component.html',
  styleUrls: ['./calculate-area.component.scss']
})
export class CalculateAreaComponent implements OnInit {

  @ViewChild('canvasRef', { static: false }) canvasRef: ElementRef;
  private cx: CanvasRenderingContext2D;

  public width: number = 1100;
  public height: number = 1100;

  ngOnInit(): void {
  }



  panelOpenState: boolean
  displayedColumns: string[] = ['area', 'perimetro', 'areaCuerda', 'perimetroCuerda'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  dataSource2: PeriodicElement
  optionCuerda: string
  valor: string
  
  dataGraph = {
    area: 0,
    norte: 0,
    este: 0,
    sur:0,
    oeste: 0
  }
  

  measures = {
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


  constructor(private changeDetectorRefs: ChangeDetectorRef, private router:Router) {
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


  addNort() {
    if (this.optionCuerda === '') {
      swal.fire({
        icon: 'info',
        text: 'Seleccione el Tipo de cuerda',
      })
    }
    let area = 0
    let norte = 0
    let sur = 0
    let este = 0
    let oeste = 0

    if (this.optionCuerda == 'Ixil') {


      norte = this.covertMeter(25, this.measures.nCuerda, this.measures.nYarda, this.measures.nPulgada, this.measures.nMetro, this.measures.nCuarta)
      sur = this.covertMeter(25, this.measures.sCuerda, this.measures.sYarda, this.measures.sPulgada, this.measures.sMetro, this.measures.sCuarta)
      este = this.covertMeter(25, this.measures.eCuerda, this.measures.eYarda, this.measures.ePulgada, this.measures.eMetro, this.measures.eCuarta)
      oeste = this.covertMeter(25, this.measures.oCuerda, this.measures.oYarda, this.measures.oPulgada, this.measures.oMetro, this.measures.oCuarta)

      area = (norte + sur) / 2 * (este + oeste) / 2
      const perimetro = norte + sur + este + oeste
      this.result(area, perimetro, 436.7118)

    } else if (this.optionCuerda == 'Quiche') {

      norte = this.covertMeter(30, this.measures.nCuerda, this.measures.nYarda, this.measures.nPulgada, this.measures.nMetro, this.measures.nCuarta)
      sur = this.covertMeter(30, this.measures.sCuerda, this.measures.sYarda, this.measures.sPulgada, this.measures.sMetro, this.measures.sCuarta)
      este = this.covertMeter(30, this.measures.eCuerda, this.measures.eYarda, this.measures.ePulgada, this.measures.eMetro, this.measures.eCuarta)
      oeste = this.covertMeter(30, this.measures.oCuerda, this.measures.oYarda, this.measures.oPulgada, this.measures.oMetro, this.measures.oCuarta)

      area = (norte + sur) / 2 * (este + oeste) / 2
      const perimetro = norte + sur + este + oeste
      this.result(area, perimetro, 628.8649)

    }else if(this.optionCuerda == 'Ninguna'){

     norte = this.covertMeter(0, this.measures.nCuerda, this.measures.nYarda, this.measures.nPulgada, this.measures.nMetro, this.measures.nCuarta)
     sur = this.covertMeter(0, this.measures.sCuerda, this.measures.sYarda, this.measures.sPulgada, this.measures.sMetro, this.measures.sCuarta)
     este = this.covertMeter(0, this.measures.eCuerda, this.measures.eYarda, this.measures.ePulgada, this.measures.eMetro, this.measures.eCuarta)
     oeste = this.covertMeter(0, this.measures.oCuerda, this.measures.oYarda, this.measures.oPulgada, this.measures.oMetro, this.measures.oCuarta)

      area = (norte + sur) / 2 * (este + oeste) / 2
      const perimetro = norte + sur + este + oeste
      this.result(area, perimetro, 628.8649)

    }

    this.dataGraph ={
      area: area,
      norte:norte,
      este:este,
      sur:sur,
      oeste:oeste
    }
  }

  data = {
    area: 0,
    perimetro: 0,
    areaCuerda: 0,
    perimetroCuerda: 0
  }

  result(area: any, perimetro: any, cuerdaCuadrada: any) {

    this.data = {
      area: 0,
      perimetro: 0,
      areaCuerda: 0,
      perimetroCuerda: 0
    }

    swal.fire({
      icon: 'success',
      text: `Calculo realizado correctamente`
    })

    this.data = {
      area: area.toFixed(2),
      perimetro: perimetro.toFixed(2),
      areaCuerda: parseFloat((area / cuerdaCuadrada).toFixed(2)),
      perimetroCuerda: parseFloat((perimetro / (436.7118 * 436.7118)).toFixed(2))
    }

    this.valor = `Área (m²):${this.data.area}, Área (cuerda²): ${this.data.areaCuerda}`
    this.dataSource.data.push(this.data);
    this.dataSource2 = this.data
    this.refresh()

  }

  refresh(): void {
    this.dataSource.data = this.dataSource.data;
  }

  cancel() {

    const measures = {
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

  selection(even: any) {
    this.optionCuerda = even
  }

  graph():void{
    console.log('Graficar', this.dataGraph);
    if(this.dataGraph.area > 0 && this.dataGraph.norte > 0 && this.dataGraph.sur > 0 && this.dataGraph.este > 0 && this.dataGraph.oeste > 0){

      this.dataGraph ={
        area: this.dataGraph.area,
        norte:this.dataGraph.norte,
        este:this.dataGraph.este,
        sur:this.dataGraph.sur,
        oeste:this.dataGraph.oeste
      }
      this.router.navigateByUrl(`/graph/${this.dataGraph.norte}/${this.dataGraph.este}/${this.dataGraph.sur}/${this.dataGraph.oeste}/${this.dataGraph.area}`,)
    }else{
      swal.fire({
        icon: 'info',
        text: `No puede graficar sin calcular un area`
      })
    }
  }

  covertMeter(numeroVaras: any, cuerda: any, yarda: any, pulgada: any, metro: any, cuarta: any) {

    const valorVara = 0.835906
    const valorCuerda = valorVara * parseFloat(numeroVaras)
    const valorPulgada = 0.0254
    const valorCuarta = 0.2286

    //25 varas tiene una cuerda
    if (!cuerda) { cuerda = 0 }
    if (!yarda) { yarda = 0 }
    if (!pulgada) { pulgada = 0 }
    if (!metro) { metro = 0 }
    if (!cuarta) { cuarta = 0 }

    // 628.8649
    return (parseFloat(cuerda) * valorCuerda) + (parseFloat(yarda) * valorVara) + (parseFloat(pulgada) * valorPulgada) + (parseFloat(metro) + (parseFloat(cuarta)) * valorCuarta)
  }

 

  

}
