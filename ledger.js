// INITIAL CAPITAL
if (!localStorage.capital) {
  localStorage.capital = 9000000;
}

// helpers
function get(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}
function set(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// update dashboard numbers
function updateDashboard() {
  const sales = get("sales");
  const expenses = get("expenses");
  const outside = get("outside");
  const wages = get("wages");

  let cash = 0;
  let debts = 0;

  sales.forEach(s => {
    cash += s.paid;
    debts += s.balance;
  });

  const totalExpenses = expenses.reduce((a, b) => a + b, 0);
  const outsideTotal = outside.reduce((a, b) => a + b, 0);
  const wagesTotal = wages.reduce((a, b) => a + b, 0);

  document.getElementById("capital").innerText =
    Number(localStorage.capital).toLocaleString();

  document.getElementById("cash").innerText = cash.toLocaleString();
  document.getElementById("debts").innerText = debts.toLocaleString();
  document.getElementById("outside").innerText = outsideTotal.toLocaleString();
  document.getElementById("wages").innerText = wagesTotal.toLocaleString();
  document.getElementById("expenses").innerText = totalExpenses.toLocaleString();
}

// SALES
function addSale() {
  const total = Number(document.getElementById("saleTotal").value);
  const paid = Number(document.getElementById("salePaid").value);

  if (!total) return alert("Enter sale total");

  const balance = total - paid;
  const sales = get("sales");

  sales.push({ total, paid, balance });
  set("sales", sales);

  // PROFIT added to capital
  localStorage.capital = Number(localStorage.capital) + total;

  updateDashboard();
}

// EXPENSES
function addExpense() {
  const amount = Number(document.getElementById("expenseAmount").value);
  if (!amount) return alert("Enter expense amount");

  const expenses = get("expenses");
  expenses.push(amount);
  set("expenses", expenses);

  localStorage.capital = Number(localStorage.capital) - amount;

  updateDashboard();
}

// COMPANY MONEY OUTSIDE
function addOutside() {
  const amount = Number(document.getElementById("outsideAmount").value);
  if (!amount) return alert("Enter amount");

  const outside = get("outside");
  outside.push(amount);
  set("outside", outside);

  updateDashboard();
}

// UNPAID WAGES
function addWage() {
  const amount = Number(document.getElementById("wageAmount").value);
  if (!amount) return alert("Enter wage amount");

  const wages = get("wages");
  wages.push(amount);
  set("wages", wages);

  updateDashboard();
}

// load on start
updateDashboard();