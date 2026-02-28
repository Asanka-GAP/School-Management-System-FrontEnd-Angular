import { Injectable } from '@angular/core';

declare var feather: any;
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }

  initializeFeatherIcons() {
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  }

  initializeCounters() {
    const counters = document.querySelectorAll('.counter-value');
    counters.forEach((counter: any) => {
      const target = +counter.getAttribute('data-target');
      const increment = target / 250;
      
      const updateCounter = () => {
        const current = +counter.innerText;
        if (current < target) {
          counter.innerText = Math.ceil(current + increment);
          setTimeout(updateCounter, 1);
        } else {
          counter.innerText = target;
        }
      };
      
      updateCounter();
    });
  }

  initializeDashboard() {
    setTimeout(() => {
      this.initializeFeatherIcons();
      this.initializeCounters();
    }, 100);
  }
}