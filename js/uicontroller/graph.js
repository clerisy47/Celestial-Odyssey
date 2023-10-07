import { Chart, registerables } from "chart.js";
import WebState from "../state";
import { ModelData } from "../modelData";
Chart.register(...registerables);

import autocolors from "chartjs-plugin-autocolors";
Chart.register(autocolors);

export function createGasChart() {
  let model = WebState.modelName;
  let data = ModelData[model];

  const gasData = data?.ui.gases;
  const gasLabels = Object.keys(gasData);
  const gasValues = Object.values(gasData);

  let chartWrapper = document.createElement("div");
  chartWrapper.classList.add("dataUi", "dark");
  let ChartUi = document.createElement("canvas");
  chartWrapper.append(ChartUi);

  let data_box = document.querySelector(".data-box");
  data_box.append(chartWrapper);

  const backgroundBar = {
    id: "backgroundBar",
    beforeDatasetsDraw(chart, args, opt) {
      const {
        data,
        ctx,
        chartArea: { top, bottom, left, right, width, height },
        scales: { x, y },
      } = chart;
      ctx.save();
      for (let i = 0; i < data.labels.length; i++) {
        const barHeight = data.datasets[0].barThickness;
        ctx.fillStyle = "rgba(200, 200, 255, 0.1)";
        ctx.fillRect(
          left,
          y.getPixelForValue(i) - barHeight / 2,
          width,
          barHeight
        );
      }
    },
  };

  const gasChart = new Chart(ChartUi, {
    type: "bar",
    data: {
      labels: gasLabels,
      datasets: [
        {
          label: "Gas Composition",
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#E7E9ED"],
          data: gasValues,
          borderWidth: 1,
          hoverBorderColor: "white",
          hoverBorderWidth: 2,
          barThickness: 22,
          hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#E7E9ED"],
        },
      ],
    },
    options: {
      responsive: true,
      indexAxis: "y",
      aspectRatio: 1.2,
      scales: {
        y: {
          ticks: {
            color: "white",
          },
        },
        x: {
          ticks: {
            color: "white",
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "white",
          },
        },
        datalabels: {
          color: "white",
        },
        tooltip: {
          callbacks: {
            label: (x) => {
              return x.formattedValue + " %";
            },
          },
        },
      },
    },
    plugins: [backgroundBar, autocolors],
  });
}
