/* ===== DATE ===== */
let selectedTxnDate = null;
function setTxnDate(d) {
  selectedTxnDate = d;
}
function getTxnDate() {
  return selectedTxnDate || new Date().toISOString().split("T")[0];
}

/* ===== FORMAT ===== */
function fmt(n) {
  return Number(n || 0).toLocaleString("en-US");
}

/* ===== STORAGE ===== */
let ledger = JSON.parse(localStorage.getItem("ledger")) || {
  capital: 9000000,
  cash: 0,
  companyDebt: 0,
  outside: 0,
  expenses: 0,
  history: []
};

function save() {
  localStorage.setItem("ledger", JSON.stringify(ledger));
  renderHistory(ledger.history);
  renderDashboard();
}

/* ===== RENDER ===== */
function renderDashboard() {
  capital.innerText = fmt(ledger.capital);
  cash.innerText = fmt(ledger.cash);
  companyDebt.innerText = fmt(ledger.companyDebt);
  outside.innerText = fmt(ledger.outside);
  expenses.innerText = fmt(ledger.expenses);
}

function renderHistory(list) {
  historyList.innerHTML = "";
  list.slice().reverse().forEach(h => {
    const li = document.createElement("li");
    li.textContent =
      `${h.date} | ${h.type} | ${fmt(h.amount)}${h.note ? " | " + h.note : ""}`;
    historyList.appendChild(li);
  });
}

/* ===== FILTER ===== */
function filterHistory() {
  const from = fromDate.value;
  const to = toDate.value;

  const filtered = ledger.history.filter(h => {
    if (from && h.date < from) return false;
    if (to && h.date > to) return false;
    return true;
  });

  renderHistory(filtered);
}

/* ===== PRINT ===== */
function printHistory() {
  window.print();
}

/* ===== TRANSACTIONS ===== */
function addCashIn() {
  const a = +cashInAmount.value;
  if (!a) return;
  ledger.cash += a;
  ledger.history.push({ type: "Cash In", amount: a, date: getTxnDate() });
  cashInAmount.value = "";
  save();
}

function addExpense() {
  const a = +expenseAmount.value;
  if (!a) return;
  ledger.cash -= a;
  ledger.expenses += a;
  ledger.history.push({ type: "Expense", amount: a, date: getTxnDate() });
  expenseAmount.value = "";
  save();
}

function addCompanyDebt() {
  const a = +debtAmount.value;
  if (!a) return;
  ledger.companyDebt += a;
  ledger.history.push({
    type: "Company Debt Added",
    amount: a,
    note: debtNote.value,
    date: getTxnDate()
  });
  debtAmount.value = "";
  debtNote.value = "";
  save();
}

function payCompanyDebt() {
  const a = +payDebtAmount.value;
  if (!a || a > ledger.companyDebt) return;
  ledger.companyDebt -= a;
  ledger.cash -= a;
  ledger.expenses += a;
  ledger.history.push({
    type: "Company Debt Paid",
    amount: a,
    date: getTxnDate()
  });
  payDebtAmount.value = "";
  save();
}

function addOutside() {
  const a = +outsideAmount.value;
  if (!a) return;
  ledger.cash -= a;
  ledger.outside += a;
  ledger.history.push({
    type: "Money Outside",
    amount: a,
    date: getTxnDate()
  });
  outsideAmount.value = "";
  save();
}

/* ===== DELETE / RESET ===== */
function deleteLast() {
  if (!ledger.history.length) return alert("No transactions");
  ledger.history.pop();
  save();
}

function resetAll() {
  if (!confirm("RESET ALL DATA?")) return;
  localStorage.removeItem("ledger");
  location.reload();
}

/* ===== INIT ===== */
renderDashboard();
renderHistory(ledger.history);