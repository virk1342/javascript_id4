//calling variables
const container = document.getElementById("crypto-container");


// a) Use fetch() to get crypto prices
// Fetch:
// * Bitcoin
// * Ethereum
// * Solana








const coins = ["bitcoin", "ethereum", "solana", "litecoin", "ripple", "cardano", "dogecoin", "polkadot", "bitcoincash", "chainlink"];


//function to get the data from API
const url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,litecoin,ripple,cardano,dogecoin,polkadot,bitcoincash,chainlink&vs_currencies=usd&include_24hr_change=true";
const apiKey = 'CG-29CCzmXMshiW8ixwkMxP4H1U';



// c) Use async/await
// Your fetch function MUST use:

// async function getPrices() {}


async function getPrices(){

const response = await fetch(url)
const data = await response.json()

coins.forEach(coin =>{
const div = document.createElement("div");
div.className = "coinsDiv";
div.innerHTML =`
      <h2>${coin}</h2>
      <p>Price: $${data[coin].usd}</p>
      <p>24h Change: ${data[coin].usd_24h_change.toFixed(2)}%</p>
    `;
container.appendChild(div);

})


}

getPrices();







// e) Show these on screen
// * Coin name
// * Current price
// * 24h change
