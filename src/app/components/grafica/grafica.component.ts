import { Component, OnInit } from '@angular/core';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-grafica',
  templateUrl: './grafica.component.html',
  styleUrls: ['./grafica.component.css'],
})
export class GraficaComponent implements OnInit {
  public lineChartData: ChartDataSets[] = [
    { data: [0, 0, 0, 0], label: 'Ventas' },
  ];
  public lineChartLabels: Label[] = ['Enero', 'Febrero', 'Marzo', 'Abril'];

  constructor(
    private http: HttpClient,
    public wsService: WebsocketService,
  ) {}

  ngOnInit(): void {
    // setInterval(() => {
    //   const newData = [
    //     Math.round(Math.random() * 100),
    //     Math.round(Math.random() * 100),
    //     Math.round(Math.random() * 100),
    //     Math.round(Math.random() * 100)
    //   ];
    //   this.lineChartData = [
    //     {data: newData, label: 'Ventas'}
    //   ];
    // }, 3000);
    this.getData();
    this.escucharSocket();
  }

  getData() {
    this.http
      .get('http://localhost:5000/grafica')
      .subscribe((data: any) => (this.lineChartData = data));
  }

  escucharSocket() {
    this.wsService.listen('cambio-grafica').subscribe((data: any) => {
      console.log('socket', data);
      this.lineChartData = data;
    });
  }

  incrementar(mes: string, unidades: number) {
    this.http
      .post('http://localhost:5000/grafica', {
        mes,
        unidades,
      })
      .subscribe((data: any) => {
        console.log('respuesta post', data);
        this.lineChartData = data;
      });
  }
}
