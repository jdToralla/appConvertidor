import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';

const ELEMENT_DATA = [] = [
  { dimension: 'Metros²', valor: '' },
  { dimension: 'Manzanas', valor: '' },
  { dimension: 'Varas²', valor: '' },
  { dimension: 'Caballerias', valor: '' },
  { dimension: 'Cuerdas 25*25', valor: '' },
  { dimension: 'Cuerdas 40*40', valor: '' },
];

@Component({
  selector: 'app-convert',
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.scss']
})
export class ConvertComponent implements OnInit {

  measures = {
    metrosCuadrados: '',
    manzanas: '',
    varasCuadradas: '',
    caballerias: '',
    cuerdas25: '',
    cuerdas40: ''
  }

  displayedColumns: string[] = ['dimension', 'valor'];
  dataSource = ELEMENT_DATA
  constructor() {
  }

  ngOnInit(): void {
  }

  calculate(): void {
    // console.log('Metor', measures.metrosCuadrados, measures.metrosCuadrados, typeof this.measures.metrosCuadrados);

    let measures = {
      metrosCuadrados: this.measures.metrosCuadrados ? parseFloat(this.measures.metrosCuadrados) : 0,
      manzanas: this.measures.manzanas ? parseFloat(this.measures.manzanas) : 0,
      varasCuadradas: this.measures.varasCuadradas ? parseFloat(this.measures.varasCuadradas) : 0,
      caballerias: this.measures.caballerias ? parseFloat(this.measures.caballerias) : 0,
      cuerdas25: this.measures.cuerdas25 ? parseFloat(this.measures.cuerdas25) : 0,
      cuerdas40: this.measures.cuerdas40 ? parseFloat(this.measures.cuerdas40) : 0
    }

    if (measures.metrosCuadrados > 0 || measures.manzanas > 0 || measures.varasCuadradas > 0 || measures.caballerias > 0 || measures.cuerdas25 > 0 || measures.cuerdas40 > 0) {

      // console.log(measures);
      // console.log(measures.manzanas*10000);
      // console.log(measures.caballerias*645816.125);
      // console.log(measures.varasCuadradas);
      // console.log(measures.metrosCuadrados + (measures.manzanas)*10000 + (measures.caballerias)*645816.125 + (measures.varasCuadradas))/1.431149868);


      /** Metros */
      ELEMENT_DATA[0].valor = (((measures.manzanas * 10000 + measures.caballerias * 645816.125 + measures.varasCuadradas) / 1.431149868) + measures.metrosCuadrados + measures.cuerdas25 * 436.7118 + measures.cuerdas40 * 1117.9821).toFixed(4)
      // ELEMENT_DATA[1].valor = ((measures.manzanas + (measures.caballerias * 645816.125 + measures.varasCuadradas + (measures.metrosCuadrados * 1.431149868) + measures.cuerdas25*0.625 + measures.cuerdas40*0.16))/10000).toFixed(4)
      /** Manzana */
      ELEMENT_DATA[1].valor = ((measures.manzanas * 10000 + measures.caballerias * 645816.125 + measures.varasCuadradas + (measures.metrosCuadrados * 1.431149868) + measures.cuerdas25 * 625 + measures.cuerdas40 * 1600) / 10000).toFixed(4)
      /** Varas */
      ELEMENT_DATA[2].valor = (measures.manzanas * 10000 + measures.caballerias * 645816.125 + measures.varasCuadradas + (measures.metrosCuadrados * 1.431149868) + measures.cuerdas25 * 625 + measures.cuerdas40 * 1600).toFixed(4)
      /** Caballeria */
      ELEMENT_DATA[3].valor = (measures.manzanas / 64.581612 + measures.caballerias + measures.varasCuadradas / 645816.124968 + measures.metrosCuadrados / 451256.8107 + measures.cuerdas25 / 1033.31 + measures.cuerdas40 / 403.64).toFixed(4)
      /** Cuerda 25*25 */
      ELEMENT_DATA[4].valor = (measures.manzanas / 0.0625 + measures.caballerias * 1033.31 + measures.varasCuadradas / 625 + measures.metrosCuadrados / 436.7118 + measures.cuerdas25 + measures.cuerdas40 / 0.39).toFixed(4)
      /** Cuerda 40*40 */
      ELEMENT_DATA[5].valor = (measures.manzanas / 0.16 + measures.caballerias * 403.63 + measures.varasCuadradas / 1600 + measures.metrosCuadrados / 1117.9821 + measures.cuerdas25 / 2.56 + measures.cuerdas40).toFixed(4)

    } else {

      swal.fire({
        icon: 'info',
        text: `Ingrese un valor para calcular`
      })
    }

  }

  cancel(): void {
    this.measures = {
      metrosCuadrados: '',
      manzanas: '',
      varasCuadradas: '',
      caballerias: '',
      cuerdas25: '',
      cuerdas40: ''
    }

    ELEMENT_DATA.map(val => {
      val.valor = ''
    })
  }

}
