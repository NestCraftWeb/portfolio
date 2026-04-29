document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('mainChart').getContext('2d');

  // Gradient for the chart fill
  let gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(88, 166, 255, 0.4)'); // accent-primary with opacity
  gradient.addColorStop(1, 'rgba(88, 166, 255, 0.0)');

  // Mock Data Points
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dataPoints = [61200, 62500, 61800, 63400, 62900, 64100, 64230];

  Chart.defaults.color = '#8b949e';
  Chart.defaults.font.family = "'Inter', sans-serif";

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'BTC Price (USD)',
        data: dataPoints,
        borderColor: '#58a6ff',
        backgroundColor: gradient,
        borderWidth: 2,
        pointBackgroundColor: '#0d1117',
        pointBorderColor: '#58a6ff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4 // Smooth curves
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false // Hide default legend
        },
        tooltip: {
          backgroundColor: 'rgba(22, 27, 34, 0.8)',
          titleColor: '#f0f6fc',
          bodyColor: '#58a6ff',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return '$' + context.parsed.y.toLocaleString();
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
            drawBorder: false,
          },
          ticks: {
            callback: function(value) {
              return '$' + value / 1000 + 'k';
            }
          }
        },
        x: {
          grid: {
            display: false,
            drawBorder: false,
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
    }
  });
});
