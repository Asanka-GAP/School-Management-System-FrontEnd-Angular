// Dashboard initialization script for Angular
(function() {
  'use strict';

  // Initialize dashboard after DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
  });

  function initializeDashboard() {
    // Initialize Feather Icons
    if (typeof feather !== 'undefined') {
      feather.replace();
    }

    // Initialize counter animations
    initializeCounters();

    // Initialize charts
    setTimeout(() => {
      initializeCharts();
    }, 500);
  }

  function initializeCounters() {
    const counters = document.querySelectorAll('.counter-value');
    counters.forEach(function(counter) {
      const target = +counter.getAttribute('data-target');
      const increment = target / 250;
      
      function updateCounter() {
        const current = +counter.innerText;
        if (current < target) {
          counter.innerText = Math.ceil(current + increment);
          setTimeout(updateCounter, 1);
        } else {
          counter.innerText = target;
        }
      }
      
      updateCounter();
    });
  }

  function initializeCharts() {
    // Mini Charts
    if (typeof ApexCharts !== 'undefined') {
      // Mini Chart 1
      const miniChart1Options = {
        series: [{
          data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54]
        }],
        chart: {
          type: 'line',
          width: 80,
          height: 35,
          sparkline: {
            enabled: true
          }
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        colors: ['#5156be'],
        tooltip: {
          fixed: {
            enabled: false
          },
          x: {
            show: false
          },
          y: {
            title: {
              formatter: function() {
                return '';
              }
            }
          },
          marker: {
            show: false
          }
        }
      };

      const miniChart1 = document.querySelector('#mini-chart1');
      if (miniChart1) {
        const chart1 = new ApexCharts(miniChart1, miniChart1Options);
        chart1.render();
      }

      // Similar charts for mini-chart2, mini-chart3, mini-chart4
      const miniChart2 = document.querySelector('#mini-chart2');
      if (miniChart2) {
        const chart2 = new ApexCharts(miniChart2, miniChart1Options);
        chart2.render();
      }

      const miniChart3 = document.querySelector('#mini-chart3');
      if (miniChart3) {
        const chart3 = new ApexCharts(miniChart3, miniChart1Options);
        chart3.render();
      }

      const miniChart4 = document.querySelector('#mini-chart4');
      if (miniChart4) {
        const chart4 = new ApexCharts(miniChart4, miniChart1Options);
        chart4.render();
      }
    }
  }

})();