const data = require("./2-input.json");

const getMonthYear = (iso) => {
  let monthYearStr = iso.slice(0, 4) + iso.slice(5, 7);
  return Number(monthYearStr);
};

const findRange = (objData) => {
  let max = 0;
  let min = 10000000;
  let revenueMap = new Map();
  const expenseData = objData.expenseData;
  const revenueData = objData.revenueData;

  for (let i of revenueData) {
    const dateYear = getMonthYear(i.startDate);
    if (!revenueMap.has(dateYear)) {
      revenueMap.set(dateYear, i.amount);
    } else {
      revenueMap.set(dateYear, revenueMap.get(dateYear) + i.amount);
    }
    if (dateYear < min) {
      min = dateYear;
    }
    if (dateYear > max) {
      max = dateYear;
    }
  }
  for (let i of expenseData) {
    const dateYear = getMonthYear(i.startDate);
    if (!revenueMap.has(dateYear)) {
      revenueMap.set(dateYear, -1 * i.amount);
    } else {
      revenueMap.set(dateYear, revenueMap.get(dateYear) - i.amount);
    }

    if (dateYear < min) {
      min = dateYear;
    }
    if (dateYear > max) {
      max = dateYear;
    }
  }
  return { revenueMap, min, max };
};

const balanceFinder = (range) => {
  let yearMonth = range.min;
  let balance = [];
  while (yearMonth <= range.max) {
    if (range.revenueMap.has(yearMonth)) {
      balance.push({
        amount: range.revenueMap.get(yearMonth),
        startDate: `${parseInt(yearMonth / 100)}-${
          yearMonth % 100 <= 9 ? "0" : ""
        }${yearMonth % 100}-01T00:00:00.000Z`,
      });
    } else {
      balance.push({
        amount: 0,
        startDate: `${parseInt(yearMonth / 100)}-${
          yearMonth % 100 <= 9 ? "0" : ""
        }${yearMonth % 100}-01T00:00:00.000Z`,
      });
    }
    if (yearMonth % 100 === 12) {
      yearMonth += 100;
      yearMonth -= 11;
    } else {
      yearMonth++;
    }
  }
  return { balance };
};

const range = findRange(data);
const result = balanceFinder(range);
console.log(result);
