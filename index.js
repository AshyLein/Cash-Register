let price = 1.87;

let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];

const currencyUnit = {
  "PENNY": 0.01,
  "NICKEL": 0.05,
  "DIME": 0.1,
  "QUARTER": 0.25,
  "ONE": 1,
  "FIVE": 5,
  "TEN": 10,
  "TWENTY": 20,
  "ONE HUNDRED": 100
};

const cashInput = document.getElementById("cash");
const changeDueElement = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");
const statusChange = document.getElementById("status-change");

purchaseBtn.addEventListener("click", checkRegister);

function checkRegister() {
  const cash = parseFloat(cashInput.value);
  let change = parseFloat((cash - price).toFixed(2));

  // Input validation
  if (isNaN(cash) || cash < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  } else if (cash === price) {
    changeDueElement.textContent = "No change due - customer paid with exact cash";
    statusChange.textContent = "Status: CLOSED";
    return;
  }

  // Calculate total cash in drawer
  let totalCid = parseFloat(cid.reduce((sum, denom) => sum + denom[1], 0).toFixed(2));

  // Check if cash in drawer is less than the change due
  if (totalCid < change) {
    changeDueElement.textContent = "Status: INSUFFICIENT_FUNDS";
    statusChange.textContent = "Status: INSUFFICIENT_FUNDS";
    return;
  }

  // If cash in drawer is exactly the change due, return all of it and close
  if (totalCid === change) {
    changeDueElement.textContent = "Status: CLOSED " + formatChange(cid);
    statusChange.textContent = "Status: CLOSED";
    cid = cid.map(denom => [denom[0], 0]); // Set all values to zero
    return;
  }

  // Calculate change to return
  const changeArray = [];
  let cidCopy = JSON.parse(JSON.stringify(cid)); // Deep copy to avoid mutating original cid

  for (let i = cidCopy.length - 1; i >= 0; i--) {
    let denomName = cidCopy[i][0];
    let denomTotal = cidCopy[i][1];
    let denomValue = currencyUnit[denomName];
    let denomAmount = 0;

    while (change >= denomValue && denomTotal > 0) {
      change = parseFloat((change - denomValue).toFixed(2));
      denomTotal = parseFloat((denomTotal - denomValue).toFixed(2));
      denomAmount += denomValue;
    }

    if (denomAmount > 0) {
      changeArray.push([denomName, parseFloat(denomAmount.toFixed(2))]);
    }
  }

  // If we can't provide exact change, return insufficient funds
  if (change > 0) {
    changeDueElement.textContent = "Status: INSUFFICIENT_FUNDS";
    statusChange.textContent = "Status: INSUFFICIENT_FUNDS";
    return;
  }

  // If there is remaining money in drawer after giving change, status is open
  statusChange.textContent = "Status: OPEN";
  changeDueElement.textContent = "Status: OPEN " + formatChange(changeArray);
  updateCid(changeArray);
}

// Helper function to format the change array into a string
const formatChange = (changeArray) => changeArray.filter(([unit, amount]) => amount > 0).map(([unit, amount]) => `${unit}: $${amount.toFixed(2)}`).join(" ");

// Helper function to update cid
function updateCid(changeArray) {
  changeArray.forEach(([denom, amount]) => {
    let idx = cid.findIndex(([name]) => name === denom);
    cid[idx][1] = parseFloat((cid[idx][1] - amount).toFixed(2));
  });
}