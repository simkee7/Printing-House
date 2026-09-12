import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { AdminService } from '../services/admin';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-admin-statistika',
  imports: [],
  templateUrl: './admin-statistika.html',
  styleUrl: './admin-statistika.css',
})
export class AdminStatistikaComponent implements AfterViewInit {

  private adminService = inject(AdminService);

  statistika: any = null;

  prometPrazanNiz = false;
  najtrazeniPrazanNiz = false;
  ocenaPrazanNiz = false;

  @ViewChild('grafikonPrometa') grafikonPrometaRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('grafikonNajtrazenijih') grafikonNajtrazenijihRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('grafikonOcena') grafikonOcenaRef!: ElementRef<HTMLCanvasElement>;

  private paleta = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'];

  ngAfterViewInit(): void {
    this.adminService.statistika().subscribe(data => {
      this.statistika = data;
    });

    this.adminService.prometPoStamparijama().subscribe(data => {
      if (!data || data.length === 0) {
        this.prometPrazanNiz = true;
        return;
      }
      this.nacrtajPrometGrafikon(data);
    });

    this.adminService.najtrazenijiProizvodiMesec().subscribe(data => {
      if (!data || data.length === 0) {
        this.najtrazeniPrazanNiz = true;
        return;
      }
      this.nacrtajNajtrazenijeGrafikon(data);
    });

    this.adminService.ocenaProizvodaKrozVreme().subscribe(data => {
      if (!data || data.length === 0) {
        this.ocenaPrazanNiz = true;
        return;
      }
      this.nacrtajOcenaGrafikon(data);
    });
  }

  private nacrtajPrometGrafikon(podaci: any[]): void {
    new Chart(this.grafikonPrometaRef.nativeElement, {
      type: 'bar',
      data: {
        labels: podaci.map(p => p.stamparija),
        datasets: [{
          label: 'Promet (din)',
          data: podaci.map(p => p.promet),
          backgroundColor: '#2a78d6'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: '#e1e0d9' },
            ticks: { color: '#898781' }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#898781' }
          }
        }
      }
    });
  }

  private nacrtajNajtrazenijeGrafikon(podaci: any[]): void {
    new Chart(this.grafikonNajtrazenijihRef.nativeElement, {
      type: 'pie',
      data: {
        labels: podaci.map(p => `${p.naziv} (${p.procenat}%)`),
        datasets: [{
          data: podaci.map(p => p.kolicina),
          backgroundColor: this.paleta.slice(0, podaci.length)
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#52514e' }
          }
        }
      }
    });
  }

  private nacrtajOcenaGrafikon(podaci: any[]): void {
    let sveTacke = podaci.flatMap(p => p.tacke.map((t: any) => t.t));
    let raspon = sveTacke.length > 0 ? Math.max(...sveTacke) - Math.min(...sveTacke) : 0;
    let prikaziVreme = raspon < 24 * 60 * 60 * 1000;

    let formatiraj = (vrednost: any) => {
      let datum = new Date(vrednost);
      return prikaziVreme
        ? datum.toLocaleString('sr-RS', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
        : datum.toLocaleDateString();
    };

    new Chart(this.grafikonOcenaRef.nativeElement, {
      type: 'line',
      data: {
        datasets: podaci.map((p, indeks) => ({
          label: p.naziv,
          data: p.tacke.map((t: any) => ({ x: t.t, y: t.ocena })),
          borderColor: this.paleta[indeks % this.paleta.length],
          backgroundColor: this.paleta[indeks % this.paleta.length],
          fill: false,
          tension: 0
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#52514e' }
          },
          tooltip: {
            callbacks: {
              title: (stavke: any) => stavke.length > 0 ? formatiraj(stavke[0].parsed.x) : ''
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            grid: { color: '#e1e0d9' },
            ticks: {
              color: '#898781',
              callback: (vrednost: any) => formatiraj(vrednost)
            }
          },
          y: {
            grid: { color: '#e1e0d9' },
            ticks: { color: '#898781' }
          }
        }
      }
    });
  }

}
