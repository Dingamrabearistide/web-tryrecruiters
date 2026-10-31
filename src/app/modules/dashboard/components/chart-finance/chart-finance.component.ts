import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { Chart, ChartConfiguration, registerables } from "chart.js";

@Component({
  standalone: false,

  selector: "app-chart-finance",
  templateUrl: "./chart-finance.component.html",
  styleUrls: ["./chart-finance.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class ChartFinanceComponent implements AfterViewInit {
  @ViewChild("financeChart") financeChartRef!: ElementRef;

  constructor() {
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    const ctx = this.financeChartRef.nativeElement.getContext("2d");

    const config: ChartConfiguration<"line"> = {
      type: "line",
      data: {
        labels: [
          "JAN",
          "FEV",
          "MAR",
          "AVR",
          "MAI",
          "JUN",
          "JUI",
          "AOU",
          "SEP",
          "OCT",
          "NOV",
          "DEC",
        ],
        datasets: [
          {
            label: "Candidats",
            data: [65, 59, 80, 81, 56, 55, 40, 68, 98, 77, 89, 99],
            borderColor: "#026fb8",
            backgroundColor: "#026fb830",
            borderWidth: 2,
            tension: 0.4,
            fill: true,
          },
          {
            label: "Entreprises",
            data: [28, 48, 40, 19, 86, 27, 90, 44, 66, 87, 54, 76],
            borderColor: "#1D9BED",
            backgroundColor: "#1D9BED30",
            borderWidth: 2,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: (value) => value + "K",
            },
          },
        },
      },
    };

    new Chart(ctx, config);
  }
}
