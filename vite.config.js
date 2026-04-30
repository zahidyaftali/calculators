import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:           resolve(__dirname, 'index.html'),
        bmi:            resolve(__dirname, 'bmi-calculator.html'),
        age:            resolve(__dirname, 'age-calculator.html'),
        emi:            resolve(__dirname, 'emi-calculator.html'),
        percentage:     resolve(__dirname, 'percentage-calculator.html'),
        profitMargin:   resolve(__dirname, 'profit-margin-calculator.html'),
        discount:       resolve(__dirname, 'discount-calculator.html'),
      },
    },
  },
});
