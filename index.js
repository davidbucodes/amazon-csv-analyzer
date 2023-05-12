const fs = require("fs");
const { argv } = require("process");

const content = fs.readFileSync(argv[2], {
  encoding: "utf-8",
});

const lines = content.split("\n");
lines.pop(); // remove empty last line
const headers = lines.shift().split(",");

const jsons = [];
lines.forEach((line) => {
  const cells = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
  jsons.push(
    cells.reduce((reducer, currCell, currIndex) => {
      reducer[headers[currIndex]] = currCell;
      return reducer;
    }, {})
  );
});

console.log(JSON.stringify(jsons, null, 4));
const allPrices = jsons
  .map((json) => json["Item Total"])
  .map((price) => Number(price.replace(/[^0-9.-]+/g, "")));
console.log(JSON.stringify(allPrices, null, 4));
console.log(allPrices.reduce((reducer, curr) => reducer + curr, 0));

const allPricesByProduct = jsons
  .map((json) => [json["Title"], json["Item Total"]])
  .map(([title, price]) => [title, Number(price.replace(/[^0-9.-]+/g, ""))])
  .sort(([title1, price1], [title2, price2]) => price2 - price1)
  .map(([title, price]) => [title, price, (price * 3.24).toFixed(2)]);
console.table(allPricesByProduct);
// console.log(JSON.stringify(allPricesByProduct, null, 4));
