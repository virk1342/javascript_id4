Assignment
Assignment 1 — Crypto Price Tracker (Easy)
Goal
Build an app that shows live crypto prices.
API
Use: CoinGecko API



Requirements
a) Use fetch() to get crypto prices
Fetch:
* Bitcoin
* Ethereum
* Solana




-
b) Use an array to store crypto names
Example:

const coins = ["bitcoin", "ethereum", "solana"]

Loop through the array to build your API request.




c) Use async/await
Your fetch function MUST use:

async function getPrices() {}





d) Use try/catch
Handle:
* Internet failure
* Invalid response



e) Show these on screen
* Coin name
* Current price
* 24h change




f) Use .map()
Use .map() to create HTML cards.

Bonus
* Refresh every 10 seconds
* Green if price up
* Red if price down
