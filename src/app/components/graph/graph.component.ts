import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit, AfterViewInit {

  @ViewChild('canvasRef', { static: false }) canvasRef: ElementRef;
  private cx: CanvasRenderingContext2D;

  public width: number = 1100;
  public height: number = 1100;
  color: string = ''
  anguloRecto: string = ''
  distanciaCota: number = 30

  constructor(public routeActive: ActivatedRoute) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.render()
  }

  selection(event: any) {
    this.anguloRecto = event
  }
  selectionC(event: any) {
    this.color = event
  }

  graphNow(): void {
    console.log('Color', this.color);

    if (this.color.length > 0 && this.anguloRecto.length > 0) {
      this.render()
    } else {
      swal.fire({
        icon: 'info',
        text: `Seleccione el angulo recto y el color.`
      })

    }
  }

  // dimensionesCardinales = []
  public render(): void {
    const canvasEl = this.canvasRef.nativeElement;
    this.cx = canvasEl.getContext('2d');
    canvasEl.width = this.width;
    canvasEl.height = this.height;

    let dimensionesCardinales = {
      norte: this.routeActive.snapshot.params.norte,
      sur: this.routeActive.snapshot.params.sur,
      este: this.routeActive.snapshot.params.este,
      oeste: this.routeActive.snapshot.params.oeste
    }
    // let dimensionesCardinales = {
    //   norte: 50,
    //   sur: 60,
    //   este: 60,
    //   oeste: 60
    // }

    let max = Object.entries(dimensionesCardinales).reduce(function (prev, curr) {
      return prev[1] > curr[1] ? prev : curr;
    });
    let dimensionMasGrande = max[1]
    console.log('Cual es:', dimensionMasGrande);

    let coordenadasInicio = { x: 0, y: 0 }
    let distanciaCota = 30
    let anguloRecto = this.anguloRecto
    let posiciones = {
      xNorte: 0, yNorte: 0,
      xEste: 0, yEste: 0,
      xSur: 0, ySur: 0,
      xOeste: 0, yOeste: 0
    }


    if (anguloRecto == 'A') {

      coordenadasInicio.x = 70
      coordenadasInicio.y = 70

      posiciones.xNorte = (((dimensionesCardinales.norte * 100) / dimensionMasGrande) * 1030) / 100
      posiciones.yNorte = coordenadasInicio.y

      posiciones.xSur = (((dimensionesCardinales.sur * 100) / dimensionMasGrande) * 1030) / 100
      posiciones.ySur = (((dimensionesCardinales.este * 100) / dimensionMasGrande) * 1030) / 100

      posiciones.xEste = (((dimensionesCardinales.sur * 100) / dimensionMasGrande) * 1030) / 100
      posiciones.yEste = (((dimensionesCardinales.este * 100) / dimensionMasGrande) * 1030) / 100

      posiciones.xOeste = coordenadasInicio.x
      posiciones.yOeste = (((dimensionesCardinales.oeste * 100) / dimensionMasGrande) * 1030) / 100

      /** Figura y relleno */
      this.cx.beginPath();
      this.cx.moveTo(coordenadasInicio.x, coordenadasInicio.y) //Fijo
      this.cx.lineTo(posiciones.xNorte, posiciones.yNorte)
      this.cx.lineTo(posiciones.xEste, posiciones.yEste)
      this.cx.stroke();

      this.cx.moveTo(coordenadasInicio.x, coordenadasInicio.y) //Fijo
      this.cx.lineTo(posiciones.xOeste, posiciones.yOeste)
      this.cx.lineTo(posiciones.xSur, posiciones.ySur)
      this.cx.fillStyle = this.color == 'COLOR' ? 'rgb(226, 253, 207)' : 'white'
      this.cx.stroke();
      this.cx.fill()

      /** Lineas diagonales */
      this.drawX(coordenadasInicio.x, coordenadasInicio.y, posiciones.xSur, posiciones.ySur)
      this.drawX(posiciones.xOeste, posiciones.yOeste, posiciones.xNorte, posiciones.yNorte)

      /** Disenio letra */
      this.cx.font = "20px Arial";
      this.cx.fillStyle = this.color == 'COLOR' ? 'green' : 'black';
      this.cx.lineCap = 'round';

      /** Cotas */
      this.drawSide('norte', dimensionesCardinales, coordenadasInicio.x, coordenadasInicio.y, posiciones.xNorte, posiciones.yNorte)
      this.drawSide('oeste', dimensionesCardinales, coordenadasInicio.x, coordenadasInicio.y, posiciones.xOeste, posiciones.yOeste)
      this.drawSide('sur', dimensionesCardinales, posiciones.xOeste, posiciones.yOeste, posiciones.xEste, posiciones.yEste)
      this.drawSide('este', dimensionesCardinales, posiciones.xNorte, posiciones.yNorte, posiciones.xEste, posiciones.yEste)

      this.drawTextCenter(coordenadasInicio.x, posiciones.xNorte, posiciones.ySur, posiciones.yNorte)

      /** Lineas Cotas */
      this.drawCotas(coordenadasInicio.x, coordenadasInicio.y, 'norOeste')
      this.drawCotas(posiciones.xNorte, posiciones.yNorte, 'norEste')
      this.drawCotas(posiciones.xOeste, posiciones.yOeste, 'surOeste')
      this.drawCotas(posiciones.xEste, posiciones.yEste, 'surEste')

    } else if (anguloRecto == 'B') {
      coordenadasInicio.x = 1030
      coordenadasInicio.y = 70
      
      posiciones.xNorte = 1100 -(((dimensionesCardinales.norte * 100) / dimensionMasGrande) * 1030) / 100
      posiciones.yNorte = coordenadasInicio.y
      
      posiciones.xSur = 1100 - (((dimensionesCardinales.sur * 100) / dimensionMasGrande) * 1030) / 100
      posiciones.ySur = (((dimensionesCardinales.oeste * 100) / dimensionMasGrande) * 1030) / 100
      
      posiciones.xOeste = 1100 -(((dimensionesCardinales.sur * 100) / dimensionMasGrande) * 1030) / 100
      posiciones.yOeste = (((dimensionesCardinales.oeste * 100) / dimensionMasGrande) * 1030) / 100

      posiciones.xEste= coordenadasInicio.x
      posiciones.yEste = (((dimensionesCardinales.este * 100) / dimensionMasGrande) * 1030) / 100
      

      /** Figura y relleno */
      this.cx.beginPath();
      this.cx.moveTo(coordenadasInicio.x, coordenadasInicio.y) //Fijo
      this.cx.lineTo(posiciones.xNorte, posiciones.yNorte)
      this.cx.lineTo(posiciones.xOeste, posiciones.yOeste)
      this.cx.stroke();
      
      this.cx.moveTo(coordenadasInicio.x, coordenadasInicio.y) //Fijo
      this.cx.lineTo(posiciones.xEste, posiciones.yEste)
      this.cx.lineTo(posiciones.xSur, posiciones.ySur)
      this.cx.fillStyle = this.color == 'COLOR' ? 'rgb(226, 253, 207)' : 'white'
      this.cx.stroke();
      this.cx.fill()

      /** Lineas diagonales */
      this.drawX(coordenadasInicio.x, coordenadasInicio.y, posiciones.xSur, posiciones.ySur)
      this.drawX(posiciones.xEste, posiciones.yEste, posiciones.xNorte, posiciones.yNorte)

      /** Disenio letra */
      this.cx.font = "20px Arial";
      this.cx.fillStyle = this.color == 'COLOR' ? 'green' : 'black';
      this.cx.lineCap = 'round';

      // /** Cotas */
      this.drawSide('norte', dimensionesCardinales, coordenadasInicio.x, coordenadasInicio.y, posiciones.xNorte, posiciones.yNorte)
      this.drawSide('este', dimensionesCardinales, coordenadasInicio.x, coordenadasInicio.y, posiciones.xEste, posiciones.yEste)
      this.drawSide('sur', dimensionesCardinales, posiciones.xOeste, posiciones.yOeste, posiciones.xEste, posiciones.yEste)
      this.drawSide('oeste', dimensionesCardinales, posiciones.xNorte, posiciones.yNorte, posiciones.xOeste, posiciones.yOeste)

      this.drawTextCenter(posiciones.xNorte, posiciones.xEste, posiciones.ySur, posiciones.yNorte)

      // /** Lineas Cotas */
      this.drawCotas(coordenadasInicio.x, coordenadasInicio.y, 'norEste')
      this.drawCotas(posiciones.xNorte, posiciones.yNorte, 'norOeste')
      this.drawCotas(posiciones.xOeste, posiciones.yOeste, 'surOeste')
      this.drawCotas(posiciones.xEste, posiciones.yEste, 'surEste')

    } else if (anguloRecto == 'C') {

      coordenadasInicio.x = 1030
      coordenadasInicio.y = 1030

      posiciones.xEste = coordenadasInicio.x
      posiciones.yEste = 1100-(((dimensionesCardinales.este * 100) / dimensionMasGrande) * 1030) / 100
      
      posiciones.xNorte = 1100-(((dimensionesCardinales.norte * 100) / dimensionMasGrande) * 1030) / 100
      posiciones.yNorte = 1100-(((dimensionesCardinales.oeste * 100) / dimensionMasGrande) * 1030) / 100
      
      posiciones.xOeste = 1100-(((dimensionesCardinales.norte * 100) / dimensionMasGrande) * 1030) / 100
      posiciones.yOeste = 1100-(((dimensionesCardinales.oeste * 100) / dimensionMasGrande) * 1030) / 100

      posiciones.xSur = 1100- (((dimensionesCardinales.sur * 100) / dimensionMasGrande) * 1030) / 100
      posiciones.ySur = coordenadasInicio.y

      /** Figura y relleno */
      this.cx.beginPath();
      this.cx.moveTo(coordenadasInicio.x, coordenadasInicio.y) //Fijo
      this.cx.lineTo(posiciones.xEste, posiciones.yEste)
      this.cx.lineTo(posiciones.xNorte, posiciones.yNorte)
      this.cx.stroke();
      
      this.cx.moveTo(coordenadasInicio.x, coordenadasInicio.y) //Fijo
      this.cx.lineTo(posiciones.xSur, posiciones.ySur)
      this.cx.lineTo(posiciones.xOeste, posiciones.yOeste)
      this.cx.fillStyle = this.color == 'COLOR' ? 'rgb(226, 253, 207)' : 'white'
      this.cx.stroke();
      this.cx.fill()

      /** Lineas diagonales */
      this.drawX(coordenadasInicio.x, coordenadasInicio.y, posiciones.xNorte, posiciones.yNorte)
      this.drawX(posiciones.xSur, posiciones.ySur, posiciones.xEste, posiciones.yEste)

      // /** Disenio letra */
      this.cx.font = "20px Arial";
      this.cx.fillStyle = this.color == 'COLOR' ? 'green' : 'black';
      this.cx.lineCap = 'round';

      // /** Cotas */
      this.drawSide('oeste', dimensionesCardinales, posiciones.xSur, posiciones.ySur, posiciones.xNorte, posiciones.yNorte)
      this.drawSide('norte', dimensionesCardinales, posiciones.xEste, posiciones.yEste,posiciones.xNorte, posiciones.yNorte)
      this.drawSide('sur', dimensionesCardinales, coordenadasInicio.x, coordenadasInicio.y, posiciones.xSur, posiciones.ySur)
      this.drawSide('este', dimensionesCardinales, coordenadasInicio.x, coordenadasInicio.y, posiciones.xEste, posiciones.yEste)

      this.drawTextCenter(posiciones.xNorte, posiciones.xEste, posiciones.ySur, posiciones.yOeste)

      this.drawCotas(coordenadasInicio.x, coordenadasInicio.y, 'surEste')
      this.drawCotas(posiciones.xNorte, posiciones.yNorte, 'norOeste')
      this.drawCotas(posiciones.xEste, posiciones.yEste, 'norEste')
      this.drawCotas(posiciones.xSur, posiciones.ySur, 'surOeste')
      
    } else if (anguloRecto == 'D') {

      coordenadasInicio.x = 70
      coordenadasInicio.y = 1030

      posiciones.xOeste = coordenadasInicio.x
      posiciones.yOeste = (1100) - (((dimensionesCardinales.oeste * 100) / dimensionMasGrande) * 1030) / 100

      posiciones.xNorte = (((dimensionesCardinales.norte * 100) / dimensionMasGrande) * 1030) / 100
      posiciones.yNorte = 1100 - (((dimensionesCardinales.este * 100) / dimensionMasGrande) * 1030) / 100

      posiciones.xEste = (((dimensionesCardinales.norte * 100) / dimensionMasGrande) * 1030) / 100
      posiciones.yEste = 1100 - (((dimensionesCardinales.este * 100) / dimensionMasGrande) * 1030) / 100

      posiciones.xSur = (((dimensionesCardinales.sur * 100) / dimensionMasGrande) * 1030) / 100
      posiciones.ySur = coordenadasInicio.y

      /** Figura y relleno */
      this.cx.beginPath();
      this.cx.moveTo(coordenadasInicio.x, coordenadasInicio.y) //Fijo
      this.cx.lineTo(posiciones.xOeste, posiciones.yOeste)
      this.cx.lineTo(posiciones.xNorte, posiciones.yNorte)
      this.cx.stroke();

      this.cx.moveTo(coordenadasInicio.x, coordenadasInicio.y) //Fijo
      this.cx.lineTo(posiciones.xSur, posiciones.ySur)
      this.cx.lineTo(posiciones.xEste, posiciones.yEste)
      this.cx.fillStyle = this.color == 'COLOR' ? 'rgb(226, 253, 207)' : 'white'
      this.cx.stroke();
      this.cx.fill()

      /** Lineas diagonales */
      this.drawX(coordenadasInicio.x, coordenadasInicio.y, posiciones.xEste, posiciones.yEste)
      this.drawX(posiciones.xOeste, posiciones.yOeste, posiciones.xSur, posiciones.ySur)

      /** Disenio letra */
      this.cx.font = "20px Arial";
      this.cx.fillStyle = this.color == 'COLOR' ? 'green' : 'black';
      this.cx.lineCap = 'round';

      /** Cotas */
      this.drawSide('norte', dimensionesCardinales, posiciones.xOeste, posiciones.yOeste, posiciones.xNorte, posiciones.yNorte)
      this.drawSide('oeste', dimensionesCardinales, coordenadasInicio.x, coordenadasInicio.y, posiciones.xOeste, posiciones.yOeste)
      this.drawSide('sur', dimensionesCardinales, coordenadasInicio.x, coordenadasInicio.y, posiciones.xSur, posiciones.ySur)
      this.drawSide('este', dimensionesCardinales, posiciones.xSur, posiciones.ySur, posiciones.xEste, posiciones.yEste)

      this.drawTextCenter(posiciones.xOeste, posiciones.xNorte, coordenadasInicio.y, 0)

      this.drawCotas(coordenadasInicio.x, coordenadasInicio.y, 'surOeste')
      this.drawCotas(posiciones.xNorte, posiciones.yNorte, 'norEste')
      this.drawCotas(posiciones.xOeste, posiciones.yOeste, 'norOeste')
      this.drawCotas(posiciones.xSur, posiciones.ySur, 'surEste')
      
    }

    
      
  }


  drawSide(side: string, dimensionesCardinales, xInicio: number, yInicio: number, xFin: number, yFin: number): void {


    this.cx.beginPath();

    if (side.toLowerCase() == 'norte') {

      this.cx.moveTo(xInicio, yInicio - this.distanciaCota)
      this.cx.lineTo(xFin, yFin - this.distanciaCota)
      this.cx.fillText(dimensionesCardinales[side], ((xInicio + xFin) / 2), ((yInicio + yFin) / 2) - this.distanciaCota * 1.5);

    } else if (side.toLowerCase() == 'sur') {
      this.cx.moveTo(xInicio, yInicio + this.distanciaCota)
      this.cx.lineTo(xFin, yFin + this.distanciaCota)
      this.cx.fillText(dimensionesCardinales[side], ((xInicio + xFin) / 2), ((yInicio + yFin) / 2) + this.distanciaCota * 2);

    } else if (side.toLowerCase() == 'este') {
      this.cx.moveTo(xInicio + this.distanciaCota, yInicio)
      this.cx.lineTo(xFin + this.distanciaCota, yFin)
      this.cx.fillText(dimensionesCardinales[side], ((xInicio + xFin) / 2) + this.distanciaCota * 1.5, (yInicio + yFin) / 2);


    } else if (side.toLowerCase() == 'oeste') {
      this.cx.moveTo(xInicio - this.distanciaCota, yInicio)
      this.cx.lineTo(xFin - this.distanciaCota, yFin)
      this.cx.fillText(dimensionesCardinales[side], ((xInicio + xFin) / 2) - this.distanciaCota * 2, (yInicio + yFin) / 2);
    }


    this.cx.stroke();
    this.cx.closePath()

  }

  drawX(xInicio: number, yInicio: number, xFin: number, yFin: number): void {

    /** Lineas del centro */
    this.cx.beginPath();
    this.cx.setLineDash([4, 10]);
    this.cx.moveTo(xInicio, yInicio)
    this.cx.lineTo(xFin, yFin)
    this.cx.stroke();
    this.cx.setLineDash([]);
  }


  drawCotas(x: number, y: number, type: string): void {
   console.log('x ',x, 'y ', y, 'type ', type );
   
    this.cx.beginPath();
    this.cx.moveTo(x, y);

    if (type === 'norOeste' || type === 'norEste') {
      this.cx.lineTo(x, y - this.distanciaCota * 1.5);

    } else if (type === 'surOeste' || type === 'surEste') {
      this.cx.lineTo(x, y + this.distanciaCota * 1.5);
    }

    this.cx.stroke();
    this.cx.closePath()

    this.cx.beginPath();
    this.cx.moveTo(x, y);

    if (type === 'norOeste' || type === 'surOeste') {
      this.cx.lineTo(x - this.distanciaCota * 1.5, y);
    } else if (type === 'norEste' || type === 'surEste') {
      this.cx.lineTo(x + this.distanciaCota * 1.5, y);
    }

    this.cx.stroke();
    this.cx.closePath()

  }

  drawTextCenter(xInicio: number, yInicio: number, xFin: number, yFin: number): void {
    this.cx.font = "35px Arial";
    this.cx.fillStyle = this.color == 'COLOR' ? 'green' : 'black';
    this.cx.textAlign = "center";
    this.cx.fillText(`Area ${this.routeActive.snapshot.params.area}m²`, (xInicio + xFin) / 2, (yInicio + yFin) / 2);
    // this.cx.fillText(`Area ${this.routeActive.snapshot.params.area}m²`, (coordenadasInicio.x + posiciones.xNorte) / 2, (posiciones.ySur + posiciones.yNorte) /2);
  }

  drawLetter(xInicio, yInicio): void {
    // this.cx.font = "40px Arial";
    // this.cx.fillStyle = this.color == 'COLOR' ? 'red' : 'black';
    // this.cx.fillText("A", xInicio - 20, yInicio - 15);
    // this.cx.fillText("B", posiciones.xNorte + 20, posiciones.yNorte - 20);
    // this.cx.fillText("C", posiciones.xEste + 30, posiciones.yEste + 40);
    // this.cx.fillText("D", posiciones.xOeste - 20, posiciones.yOeste + 40);
  }


  drawArrow(x: number, y: number, type: string): void { /** No se usa */

    let xTmp = 0
    if (type === 'norOeste') {
      xTmp = x + 15
    } else if (type === 'norEste') {
      xTmp = x - 15

    } else if (type === 'surOeste') {
      xTmp = x + 15
    }

    this.cx.beginPath();
    this.cx.moveTo(xTmp, y - this.distanciaCota * 1.5);
    this.cx.lineTo(x, y - this.distanciaCota);
    this.cx.lineTo(xTmp, y - this.distanciaCota * 0.5);
    this.cx.stroke();
    this.cx.closePath()

  }

  drawAngulo(dimensionMasGrande, dimensionesCardinales): void {

    let coordenadasInicio = { x: 0, y: 0 }
    let distanciaCota = this.distanciaCota
    // let anguloRecto = this.anguloRecto
    let posiciones = {
      xNorte: 0, yNorte: 0,
      xEste: 0, yEste: 0,
      xSur: 0, ySur: 0,
      xOeste: 0, yOeste: 0
    }

    coordenadasInicio.x = 70
    coordenadasInicio.y = 70

    posiciones.xNorte = (((dimensionesCardinales.norte * 100) / dimensionMasGrande) * 1030) / 100
    posiciones.yNorte = coordenadasInicio.y

    posiciones.xSur = (((dimensionesCardinales.sur * 100) / dimensionMasGrande) * 1030) / 100
    posiciones.ySur = (((dimensionesCardinales.este * 100) / dimensionMasGrande) * 1030) / 100

    posiciones.xEste = (((dimensionesCardinales.sur * 100) / dimensionMasGrande) * 1030) / 100
    posiciones.yEste = (((dimensionesCardinales.este * 100) / dimensionMasGrande) * 1030) / 100

    posiciones.xOeste = coordenadasInicio.x
    posiciones.yOeste = (((dimensionesCardinales.oeste * 100) / dimensionMasGrande) * 1030) / 100

    /** Area y relleno */
    this.cx.beginPath();
    this.cx.moveTo(coordenadasInicio.x, coordenadasInicio.y) //Fijo
    this.cx.lineTo(posiciones.xNorte, posiciones.yNorte)
    this.cx.lineTo(posiciones.xEste, posiciones.yEste)
    this.cx.stroke();

    this.cx.moveTo(coordenadasInicio.x, coordenadasInicio.y) //Fijo
    this.cx.lineTo(posiciones.xOeste, posiciones.yOeste)
    this.cx.lineTo(posiciones.xSur, posiciones.ySur)
    this.cx.fillStyle = this.color == 'COLOR' ? 'rgb(226, 253, 207)' : 'white'
    this.cx.stroke();
    this.cx.fill()

    /** Lineas del centro */
    this.cx.beginPath();
    this.cx.setLineDash([4, 10]);
    this.cx.moveTo(coordenadasInicio.x, coordenadasInicio.y) //Fijo
    this.cx.lineTo(posiciones.xSur, posiciones.ySur)
    this.cx.stroke();

    this.cx.beginPath();
    this.cx.setLineDash([4, 10]);
    this.cx.moveTo(posiciones.xNorte, posiciones.yNorte) //Fijo
    this.cx.lineTo(posiciones.xOeste, posiciones.yOeste)
    this.cx.stroke();
    this.cx.setLineDash([]);

    /** Disenio letra */
    this.cx.font = "20px Arial";
    this.cx.fillStyle = this.color == 'COLOR' ? 'green' : 'black';

    /** Cotas */
    /** Norte */
    this.cx.lineCap = 'round';
    this.cx.beginPath();
    this.cx.moveTo(coordenadasInicio.x, coordenadasInicio.y - distanciaCota) //Fijo
    this.cx.lineTo(posiciones.xNorte, posiciones.yNorte - distanciaCota)
    this.cx.fillText(dimensionesCardinales.norte.toString(), posiciones.xNorte / 2, posiciones.yNorte / 2);
    this.cx.stroke();
    this.cx.closePath()

    /** Este */
    this.cx.beginPath();
    this.cx.moveTo(posiciones.xNorte + distanciaCota, posiciones.yNorte)
    this.cx.lineTo(posiciones.xEste + distanciaCota, posiciones.yEste)
    this.cx.fillText(dimensionesCardinales.este.toString(), ((posiciones.xNorte + posiciones.xSur) / 2) + distanciaCota * 1.5, posiciones.yEste / 2);
    this.cx.stroke();
    this.cx.closePath()

    /** Oeste */
    this.cx.beginPath();
    this.cx.moveTo(coordenadasInicio.x - distanciaCota, coordenadasInicio.y)
    this.cx.lineTo(posiciones.xOeste - distanciaCota, posiciones.yOeste)
    this.cx.fillText(dimensionesCardinales.oeste.toString(), ((coordenadasInicio.x + posiciones.xOeste) / 2) - distanciaCota * 2, posiciones.yOeste / 2);
    this.cx.stroke();
    this.cx.closePath()

    /** Sur */
    this.cx.beginPath();
    this.cx.moveTo(posiciones.xOeste, posiciones.yOeste + distanciaCota)
    this.cx.lineTo(posiciones.xEste, posiciones.yEste + distanciaCota)
    this.cx.fillText(dimensionesCardinales.sur.toString(), posiciones.xEste / 2, (posiciones.yEste + posiciones.yOeste) / 2 + distanciaCota * 2);
    this.cx.stroke();
    this.cx.closePath()

    /** Text Center */
    this.cx.font = "35px Arial";
    this.cx.fillStyle = this.color == 'COLOR' ? 'green' : 'black';
    this.cx.textAlign = "center";
    this.cx.fillText(`Area ${this.routeActive.snapshot.params.area}m²`, (coordenadasInicio.x + posiciones.xNorte) / 2, (coordenadasInicio.y + posiciones.yEste) / 2);

    /** Cotas */
    this.drawCotas(coordenadasInicio.x, coordenadasInicio.y, 'norOeste')
    this.drawCotas(posiciones.xNorte, posiciones.yNorte, 'norEste')
    this.drawCotas(posiciones.xOeste, posiciones.yOeste, 'surOeste')
    this.drawCotas(posiciones.xEste, posiciones.yEste, 'surEste')

    /** Flechas */
    // this.drawArrow(coordenadasInicio.x, coordenadasInicio.y, 'norOeste')
    // this.drawArrow(posiciones.xNorte, posiciones.yNorte, 'norEste')
    // this.drawArrow(posiciones.xOeste, posiciones.yOeste, 'surOeste')
    // this.drawArrow(posiciones.xNorte, posiciones.yNorte, 'surEste')

    this.cx.font = "40px Arial";
    this.cx.fillStyle = this.color == 'COLOR' ? 'red' : 'black';
    this.cx.fillText("A", coordenadasInicio.x - 20, coordenadasInicio.y - 15);
    this.cx.fillText("B", posiciones.xNorte + 20, posiciones.yNorte - 20);
    this.cx.fillText("C", posiciones.xEste + 30, posiciones.yEste + 40);
    this.cx.fillText("D", posiciones.xOeste - 20, posiciones.yOeste + 40);

  }

  // drawLineCota(dimensionesCardinales, coordenadasInicio, posiciones): void {

  /*** Cotas ***/
  /** Este es DESDE ABAJO */
  /** Oeste */
  // this.cx.beginPath();
  // this.cx.moveTo(coordenadasInicio.x - distanciaCota, coordenadasInicio.y) //Fijo
  // this.cx.lineTo(posiciones.xOeste - distanciaCota, posiciones.yOeste)
  // this.cx.fillText(dimensionesCardinales.oeste, ((coordenadasInicio.x + posiciones.xOeste) / 2) - distanciaCota * 2, (posiciones.yOeste + coordenadasInicio.y) / 2);
  // this.cx.stroke();
  // this.cx.closePath()

  /** Norte */
  // this.cx.beginPath();
  // this.cx.moveTo(posiciones.xOeste, posiciones.yOeste - distanciaCota)
  // this.cx.lineTo(posiciones.xNorte, posiciones.yNorte - distanciaCota)
  // this.cx.fillText(dimensionesCardinales.norte.toString(), ((posiciones.xNorte + posiciones.xOeste) / 2) + distanciaCota * 1.5, posiciones.yEste / 2);
  // this.cx.stroke();
  // this.cx.closePath()

  /** Sur */
  // this.cx.beginPath();
  // this.cx.moveTo(coordenadasInicio.x, coordenadasInicio.y + distanciaCota)
  // this.cx.lineTo(posiciones.xSur, posiciones.ySur + distanciaCota)
  // this.cx.fillText(dimensionesCardinales.sur.toString(), ((coordenadasInicio.x + posiciones.xSur) / 2), posiciones.ySur + distanciaCota * 2);
  // this.cx.stroke();
  // this.cx.closePath()

  /** Este */
  // this.cx.beginPath();
  // this.cx.moveTo(posiciones.xSur + distanciaCota, posiciones.ySur)
  // this.cx.lineTo(posiciones.xNorte + distanciaCota, posiciones.yNorte)
  // this.cx.fillText(dimensionesCardinales.este.toString(), (posiciones.xEste) - distanciaCota * 2, (posiciones.yEste + posiciones.ySur) / 2);
  // this.cx.stroke();
  // this.cx.closePath()


  /********************************************************* */

  //   /** Oeste */
  //   this.cx.beginPath();
  //   this.cx.moveTo(coordenadasInicio.x - this.distanciaCota, coordenadasInicio.y) //Fijo
  //   this.cx.lineTo(posiciones.xOeste - this.distanciaCota, posiciones.yOeste)
  //   this.cx.fillText(dimensionesCardinales.oeste.toString() + 'p', ((coordenadasInicio.x + posiciones.xOeste) / 2) - this.distanciaCota * 2, ((coordenadasInicio.y + posiciones.yOeste) / 2));
  //   this.cx.stroke();
  //   this.cx.closePath()

  //   /** Oeste */
  //   this.cx.beginPath();
  //   this.cx.moveTo(coordenadasInicio.x - this.distanciaCota, coordenadasInicio.y)
  //   this.cx.lineTo(posiciones.xOeste - this.distanciaCota, posiciones.yOeste)
  //   this.cx.fillText(dimensionesCardinales.oeste.toString() + 'p', ((coordenadasInicio.x + posiciones.xOeste) / 2) - this.distanciaCota * 2, ((coordenadasInicio.y + posiciones.yOeste) / 2));
  //   this.cx.stroke();
  //   this.cx.closePath()


  //   //----------------------------------------------------------------------------------------------------------------------

  //   /** Norte */
  //   this.cx.beginPath();
  //   this.cx.moveTo(coordenadasInicio.x, coordenadasInicio.y - this.distanciaCota) //Fijo
  //   this.cx.lineTo(posiciones.xNorte, posiciones.yNorte - this.distanciaCota)
  //   this.cx.fillText(dimensionesCardinales.norte.toString(), posiciones.xNorte / 2, posiciones.yNorte / 2);
  //   this.cx.stroke();
  //   this.cx.closePath()

  //   /** Norte */
  //   this.cx.beginPath();
  //   this.cx.moveTo(posiciones.xOeste, posiciones.yOeste - this.distanciaCota)
  //   this.cx.lineTo(posiciones.xNorte, posiciones.yNorte - this.distanciaCota)
  //   this.cx.fillText(dimensionesCardinales.norte.toString(), ((posiciones.xNorte + posiciones.xOeste) / 2) + this.distanciaCota * 1.5, posiciones.yOeste / 2);
  //   this.cx.stroke();
  //   this.cx.closePath()

  //   //----------------------------------------------------------------------------------------------------------------------


  //   /** Sur */
  //   this.cx.beginPath();
  //   this.cx.moveTo(posiciones.xOeste, posiciones.yOeste + this.distanciaCota)
  //   this.cx.lineTo(posiciones.xEste, posiciones.yEste + this.distanciaCota)
  //   this.cx.fillText(dimensionesCardinales.sur.toString(), posiciones.xEste / 2, (posiciones.yEste + posiciones.yOeste) / 2 + this.distanciaCota * 2);
  //   this.cx.stroke();
  //   this.cx.closePath()

  //   /** Sur */
  //   this.cx.beginPath();
  //   this.cx.moveTo(coordenadasInicio.x, coordenadasInicio.y + this.distanciaCota)
  //   this.cx.lineTo(posiciones.xSur, posiciones.ySur + this.distanciaCota)
  //   this.cx.fillText(dimensionesCardinales.sur.toString(), ((coordenadasInicio.x + posiciones.xSur) / 2), posiciones.ySur + this.distanciaCota * 2);
  //   this.cx.stroke();
  //   this.cx.closePath()


  //   //----------------------------------------------------------------------------------------------------------------------


  //   /** Este */
  //   this.cx.beginPath();
  //   this.cx.moveTo(posiciones.xSur + this.distanciaCota, posiciones.ySur)
  //   this.cx.lineTo(posiciones.xNorte + this.distanciaCota, posiciones.yNorte)
  //   this.cx.fillText(dimensionesCardinales.este.toString(), (posiciones.xEste) - this.distanciaCota * 2, (posiciones.yEste + posiciones.ySur) / 2);
  //   this.cx.stroke();
  //   this.cx.closePath()



  //   /** Este */
  //   this.cx.beginPath();
  //   this.cx.moveTo(posiciones.xNorte + this.distanciaCota, posiciones.yNorte)
  //   this.cx.lineTo(posiciones.xEste + this.distanciaCota, posiciones.yEste)
  //   this.cx.fillText(dimensionesCardinales.este.toString(), ((posiciones.xNorte + posiciones.xSur) / 2) + this.distanciaCota * 1.5, posiciones.yEste / 2);
  //   this.cx.stroke();
  //   this.cx.closePath()
  // }



}
