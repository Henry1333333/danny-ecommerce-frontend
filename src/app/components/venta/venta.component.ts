import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReporteVentas } from 'src/app/model/ventas';
import { VentaService } from '../../service/venta.service';
import { Table } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { PrimeNGConfig } from 'primeng/api';
import * as FileSaver from 'file-saver';
import * as jsPDF from 'jspdf';
import { Calendar } from 'primeng/calendar';
import { Button } from 'primeng/button';


interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}
@Component({
    selector: 'app-venta',
    templateUrl: './venta.component.html',
    styleUrls: ['./venta.component.scss'],
    providers: [DatePipe],
})
export class VentaComponent {
    reporteVentas: ReporteVentas[] = [];
    fechaInicio: Date;
    fechaFin: Date;
    fechaActual: string;
    idElemento: any;
    cols!: Column[];
    exportColumns!: ExportColumn[];
    headerRow: ElementRef | undefined;
    bodyRow: ElementRef | undefined;
    @ViewChild('fechaInicioCalendar') fechaInicioCalendar: Calendar;
    @ViewChild('fechaFinCalendar') fechaFinCalendar: Calendar;
    @ViewChild('resetButton') resetButton: Button;
    mostrarResetButton: boolean = false;
    constructor(
        private ventaService: VentaService,
        private datePipe: DatePipe,
    ) {
        const fecha = new Date();

        // Formatear la fecha como DD/MM/YYYY
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // ¡Recuerda que los meses comienzan desde 0!
        const anio = fecha.getFullYear();
        this.fechaActual = `${dia}/${mes}/${anio}`;
    }

    ngOnInit(): void {
        this.getAll();
        this.cols = [
            { field: 'nombrecliente', header: 'N. Cliente' },
            { field: 'apellidocliente', header: 'A. Cliente' },
            { field: 'dnicliente', header: 'DNI' },
            { field: 'producto', header: 'Producto' },
            { field: 'cantidad', header: 'Cantidad' },
            { field: 'precioUnitario', header: 'P. Unitario' },
            { field: 'preciototal', header: 'P. Total' },
            { field: 'fechaVenta', header: 'Fecha Venta' },
        ];

        this.exportColumns = this.cols.map((col) => ({
            title: col.header,
            dataKey: col.field,
        }));
    }
    getAll(): void {
        this.ventaService.get().subscribe((data) => {
            this.reporteVentas = data.map((venta) => {
                const fechaVentaString = venta.fechaVenta;
                const fechaVenta = fechaVentaString
                    ? new Date(fechaVentaString)
                    : null;
                const fechaFormateada = fechaVenta
                    ? this.datePipe.transform(fechaVenta, 'yyyy-MM-dd')
                    : null;
                return {
                    ...venta,
                    fechaVenta: this.datePipe.transform(
                        venta.fechaVenta,
                        'yyyy-MM-dd'
                    ),
                };
            });
        });
    }

    exportPdf() {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then((x) => {
                const doc = new jsPDF.default('p', 'px', 'a4');
                (doc as any).autoTable(this.exportColumns, this.reporteVentas);
                doc.save(`${this.fechaActual}_reporte_ventas.pdf`);
            });
        });
    }
    listarVentas() {
        const fechaInicioString = this.fechaInicio
            ? this.datePipe.transform(this.fechaInicio, 'yyyy-MM-dd HH:mm:ss')
            : null;
        const fechaFinString = this.fechaFin
            ? this.datePipe.transform(this.fechaFin, 'yyyy-MM-dd HH:mm:ss')
            : null;

        this.ventaService
            .listarVentas(fechaInicioString, fechaFinString)
            .subscribe(
                (data: ReporteVentas[]) => {
                    this.reporteVentas = data.map((venta) => {
                        return {
                            ...venta,
                            fechaVenta: this.datePipe.transform(
                                venta.fechaVenta,
                                'yyyy-MM-dd HH:mm:ss'
                            ),
                        };
                    });
                    this.mostrarResetButton = true;
                    console.log('Ventas:', this.reporteVentas);
                },
                (error) => {
                    console.error('Error:', error);

                }
            );
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
    reiniciarFechas() {
        this.fechaInicio = null;
        this.fechaFin = null;
        this.mostrarResetButton = false;
        this.getAll();
      }

    exportExcel() {
      import('xlsx').then((xlsx) => {
          const worksheet = xlsx.utils.json_to_sheet(this.reporteVentas);
          const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer, 'reporteVentas');
      });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
          type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
