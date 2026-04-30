/* ===========================
   Infinite Calculators - Shared JS
   =========================== */

/* --- Mobile Nav Toggle --- */
export function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    const open = links.classList.contains('open');
    toggle.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
    }
  });
}

/* --- FAQ Accordion --- */
export function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* --- Input validation helper --- */
export function validateNumber(input, min = 0) {
  const val = parseFloat(input.value);
  if (isNaN(val) || val <= min) {
    input.classList.add('err');
    return null;
  }
  input.classList.remove('err');
  return val;
}

export function showResult(boxEl) {
  boxEl.classList.add('show');
  boxEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* --- Format currency --- */
export function fmtCurrency(n, symbol = '₹') {
  return symbol + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

export function fmtNum(n, decimals = 2) {
  return parseFloat(n.toFixed(decimals)).toLocaleString();
}

/* ===========================
   BMI CALCULATOR
=========================== */
export function initBMI() {
  const form    = document.getElementById('bmiForm');
  const result  = document.getElementById('bmiResult');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const weightEl = document.getElementById('weight');
    const heightEl = document.getElementById('height');
    const weight = validateNumber(weightEl, 0);
    const height = validateNumber(heightEl, 0);
    if (!weight || !height) return;

    const bmi = weight / Math.pow(height / 100, 2);
    const bmiFixed = bmi.toFixed(1);

    let cat, tagClass, desc;
    if (bmi < 18.5) {
      cat = 'Underweight'; tagClass = 'tag-underweight';
      desc = 'Your BMI indicates you are underweight. Consider consulting a healthcare provider about a balanced diet and nutrition plan.';
    } else if (bmi < 25) {
      cat = 'Normal Weight'; tagClass = 'tag-normal';
      desc = 'Great! Your BMI is in the healthy range. Maintain your current lifestyle with regular exercise and a balanced diet.';
    } else if (bmi < 30) {
      cat = 'Overweight'; tagClass = 'tag-overweight';
      desc = 'Your BMI indicates you are overweight. Regular physical activity and a calorie-conscious diet can help achieve a healthier weight.';
    } else {
      cat = 'Obese'; tagClass = 'tag-obese';
      desc = 'Your BMI falls in the obese range. Please consult a healthcare professional for a personalized weight management plan.';
    }

    document.getElementById('bmiValue').textContent = bmiFixed;
    const catEl = document.getElementById('bmiCategory');
    catEl.textContent = cat;
    catEl.className = 'result-category ' + tagClass;
    document.getElementById('bmiDesc').textContent = desc;

    const pct = Math.min(Math.max((bmi - 10) / 30 * 100, 2), 98);
    document.getElementById('bmiPointer').style.left = pct + '%';

    showResult(result);
  });

  form.addEventListener('reset', () => result.classList.remove('show'));
}

/* ===========================
   AGE CALCULATOR
=========================== */
export function initAge() {
  const form   = document.getElementById('ageForm');
  const result = document.getElementById('ageResult');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const dobInput = document.getElementById('dob');
    const dob = new Date(dobInput.value);
    const today = new Date();

    if (!dobInput.value || dob >= today) {
      dobInput.classList.add('err');
      return;
    }
    dobInput.classList.remove('err');

    let years  = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth()    - dob.getMonth();
    let days   = today.getDate()     - dob.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) { years--; months += 12; }

    const totalDays   = Math.floor((today - dob) / 86400000);
    const totalMonths = years * 12 + months;
    const totalWeeks  = Math.floor(totalDays / 7);

    document.getElementById('ageYears').textContent  = years;
    document.getElementById('ageMonths').textContent = months;
    document.getElementById('ageDays').textContent   = days;
    document.getElementById('ageTotalDays').textContent   = totalDays.toLocaleString();
    document.getElementById('ageTotalWeeks').textContent  = totalWeeks.toLocaleString();
    document.getElementById('ageTotalMonths').textContent = totalMonths.toLocaleString();

    const nextBday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBday <= today) nextBday.setFullYear(today.getFullYear() + 1);
    const daysToNext = Math.ceil((nextBday - today) / 86400000);
    document.getElementById('ageNextBday').textContent = daysToNext + ' days';

    showResult(result);
  });

  form.addEventListener('reset', () => result.classList.remove('show'));
}

/* ===========================
   EMI CALCULATOR
=========================== */
export function initEMI() {
  const form   = document.getElementById('emiForm');
  const result = document.getElementById('emiResult');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const loanEl   = document.getElementById('loanAmount');
    const rateEl   = document.getElementById('interestRate');
    const tenureEl = document.getElementById('tenure');

    const P = validateNumber(loanEl, 0);
    const r = validateNumber(rateEl, 0);
    const n = validateNumber(tenureEl, 0);
    if (!P || !r || !n) return;

    const monthlyRate = r / 12 / 100;
    const emi = P * monthlyRate * Math.pow(1 + monthlyRate, n) / (Math.pow(1 + monthlyRate, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    document.getElementById('emiMonthly').textContent    = fmtCurrency(emi);
    document.getElementById('emiTotal').textContent      = fmtCurrency(totalPayment);
    document.getElementById('emiInterest').textContent   = fmtCurrency(totalInterest);
    document.getElementById('emiPrincipal').textContent  = fmtCurrency(P);

    const principalPct = Math.round((P / totalPayment) * 100);
    document.getElementById('emiPrincipalPct').textContent = principalPct + '%';
    document.getElementById('emiInterestPct').textContent  = (100 - principalPct) + '%';
    document.getElementById('emiPrincipalBar').style.width = principalPct + '%';
    document.getElementById('emiInterestBar').style.width  = (100 - principalPct) + '%';

    showResult(result);
  });

  form.addEventListener('reset', () => result.classList.remove('show'));
}

/* ===========================
   PERCENTAGE CALCULATOR
=========================== */
export function initPercentage() {
  const form   = document.getElementById('percentForm');
  const result = document.getElementById('percentResult');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const obtainedEl = document.getElementById('obtained');
    const totalEl    = document.getElementById('total');
    const obtained = validateNumber(obtainedEl, -1);
    const total    = validateNumber(totalEl, 0);
    if (obtained === null || total === null) return;
    if (obtained > total) { obtainedEl.classList.add('err'); return; }

    const pct = (obtained / total) * 100;
    let grade, gradeClass;
    if (pct >= 90) { grade = 'A+ (Excellent)'; gradeClass = 'tag-normal'; }
    else if (pct >= 80) { grade = 'A (Very Good)'; gradeClass = 'tag-normal'; }
    else if (pct >= 70) { grade = 'B (Good)'; gradeClass = 'tag-normal'; }
    else if (pct >= 60) { grade = 'C (Average)'; gradeClass = 'tag-overweight'; }
    else if (pct >= 50) { grade = 'D (Below Avg)'; gradeClass = 'tag-overweight'; }
    else { grade = 'F (Fail)'; gradeClass = 'tag-obese'; }

    document.getElementById('percentValue').textContent = pct.toFixed(2) + '%';
    const gradeEl = document.getElementById('percentGrade');
    gradeEl.textContent = grade;
    gradeEl.className = 'result-category ' + gradeClass;

    const remaining = total - obtained;
    document.getElementById('percentObtained').textContent  = obtained;
    document.getElementById('percentTotal').textContent     = total;
    document.getElementById('percentRemaining').textContent = remaining;

    showResult(result);
  });

  form.addEventListener('reset', () => result.classList.remove('show'));
}

/* ===========================
   PROFIT MARGIN CALCULATOR
=========================== */
export function initProfitMargin() {
  const form   = document.getElementById('profitForm');
  const result = document.getElementById('profitResult');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const costEl    = document.getElementById('costPrice');
    const sellingEl = document.getElementById('sellingPrice');
    const cost    = validateNumber(costEl, 0);
    const selling = validateNumber(sellingEl, 0);
    if (!cost || !selling) return;

    const profit = selling - cost;
    const profitMargin  = (profit / selling) * 100;
    const markupPercent = (profit / cost) * 100;

    let statusClass, statusText;
    if (profit > 0) {
      statusClass = 'tag-profit'; statusText = '📈 Profitable';
    } else if (profit === 0) {
      statusClass = 'tag-break-even'; statusText = '⚖️ Break Even';
    } else {
      statusClass = 'tag-loss'; statusText = '📉 Loss';
    }

    document.getElementById('profitMarginValue').textContent = Math.abs(profitMargin).toFixed(2) + '%';
    document.getElementById('profitAmount').textContent  = fmtCurrency(Math.abs(profit));
    document.getElementById('profitMarkup').textContent  = Math.abs(markupPercent).toFixed(2) + '%';
    document.getElementById('profitRevenue').textContent = fmtCurrency(selling);

    const statusEl = document.getElementById('profitStatus');
    statusEl.textContent = statusText;
    statusEl.className = 'result-category ' + statusClass;

    showResult(result);
  });

  form.addEventListener('reset', () => result.classList.remove('show'));
}

/* ===========================
   DISCOUNT CALCULATOR
=========================== */
export function initDiscount() {
  const form   = document.getElementById('discountForm');
  const result = document.getElementById('discountResult');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const priceEl    = document.getElementById('originalPrice');
    const discountEl = document.getElementById('discountPercent');
    const price    = validateNumber(priceEl, 0);
    const discount = validateNumber(discountEl, -1);
    if (!price || discount === null || discount > 100) return;

    const savings    = (price * discount) / 100;
    const finalPrice = price - savings;

    document.getElementById('discountFinal').textContent   = fmtCurrency(finalPrice);
    document.getElementById('discountSavings').textContent = fmtCurrency(savings);
    document.getElementById('discountOriginal').textContent = fmtCurrency(price);
    document.getElementById('discountPct').textContent     = discount + '%';

    showResult(result);
  });

  form.addEventListener('reset', () => result.classList.remove('show'));
}
