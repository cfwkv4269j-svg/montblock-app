/*************************************************
 * MONTBLOCK LEDGER – CORE LOGIC
 * Backdating supported (NO UI CHANGE)
 *************************************************/

/* ===== BACKDATE SUPPORT ===== */
let selectedTxnDate = null;

// Set manually when you want to backdate
// Example: setTxnDate("2026-01-08")
function setTxnDate(dateString) {
  selectedTxnDate = dateString;
}

// Always returns a date (today if none selected)
function getTxnDate() {
  return selectedTxnDate || new Date().toISOString().split("T")[0];
}

// Reset back to today
function resetTxnDate() {
  selectedTxnDate = null;
}

/* ===== INITIAL DATA ===== */
let ledger = JSON.parse(localStorage.getItem("ledger")) || {
  capital: 9000000,
  cash: 0,
  companyDebt: 0,
  outside: 0,
  expenses: 0,
  history: []
};

/* ===== SAVE & RENDER ===== */
function save() {
  localStorage.setItem("ledger", JSON.stringify(ledger));
  render();
}

function render() {
  capital.innerText = ledger.capital.toLocaleString();
  cash.innerText = ledger.cash.toLocaleString();
  companyDebt.innerText = ledger.companyDebt.toLocaleString();
  outside.innerText = ledger.outside.toLocaleString();
  expenses.innerText = ledger.expenses.toLocaleString();

  historyList.innerHTML = "";
  ledger.history.slice().reverse().forEach(h => {
    let li = document.createElement("li");
    li.innerText = `${h.date} | ${h.type} | ${h.amount.toLocaleString()}${h.note ? " - " + h.note : ""}`;
    historyList.appendChild(li);
  });
}

/* ===== CASH IN ===== */
function addCashIn() {
  let amt = +cashInAmount.value;
  if (!amt) return;

  ledger.cash += amt;

  ledger.history.push({
    type: "Cash In",
    amount: amt,
    date: getTxnDate()
  });

  cashInAmount.value = "";
  save();
}

/* ===== EXPENSE (PAID) ===== */
function addExpense() {
  let amt = +expenseAmount.value;
  if (!amt) return;

  ledger.cash -= amt;
  ledger.expenses += amt;

  ledger.history.push({
    type: "Expense Paid",
    amount: amt,
    date: getTxnDate()
  });

  expenseAmount.value = "";
  save();
}

/* ===== ADD COMPANY DEBT ===== */
function addCompanyDebt() {
  let amt = +debtAmount.value;
  if (!amt) return;

  ledger.companyDebt += amt;

  ledger.history.push({
    type: "Company Debt Added",
    amount: amt,
    note: debtNote.value || "",
    date: getTxnDate()
  });

  debtAmount.value = "";
  debtNote.value = "";
  save();
}

/* ===== PAY COMPANY DEBT ===== */
function payCompanyDebt() {
  let amt = +payDebtAmount.value;
  if (!amt) return;
  if (amt > ledger.companyDebt) {
    alert("Amount is greater than company debt");
    return;
  }

  ledger.companyDebt -= amt;
  ledger.cash -= amt;
  ledger.expenses += amt;

  ledger.history.push({
    type: "Company Debt Paid",
    amount: amt,
    date: getTxnDate()
  });

  payDebtAmount.value = "";
  save();
}

/* ===== COMPANY MONEY OUTSIDE ===== */
function addOutside() {
  let amt = +outsideAmount.value;
  if (!amt) return;

  ledger.cash -= amt;
  ledger.outside += amt;

  ledger.history.push({
    type: "Money Given Outside",
    amount: amt,
    date: getTxnDate()
  });

  outsideAmount.value = "";
  save();
}

/* ===== DELETE LAST TRANSACTION ===== */
function deleteLast() {
  if (!ledger.history.length) {
    alert("No transactions to delete");
    return;
  }

  ledger.history.pop();
  alert("Last transaction removed (totals unchanged)");
  save();
}

/* ===== RESET ALL DATA ===== */
function resetAll() {
  if (!confirm("Reset ALL data? This cannot be undone.")) return;
  localStorage.removeItem("ledger");
  location.reload();
}

/* ===== INITIAL RENDER ===== */
render();