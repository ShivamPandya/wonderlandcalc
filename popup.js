let url = "https://api.coingecko.com/api/v3/simple/price?ids=wonderland&vs_currencies=usd"


let today = new Date((new Date()).valueOf() + 1000*3600*24).toISOString().split('T')[0];
document.getElementsByName("date")[0].setAttribute('min', today);
document.getElementsByName("date")[0].value = today;

const address = document.querySelector(".fox");

address.addEventListener('click', () => {
  let copied = '0xB9950136EeE0404ff354D76ebD1cf147Fa426BD4'
  navigator.clipboard.writeText(copied);
  setTimeout(function(){
    document.querySelector(".address").innerHTML = "If you like my work, you can donate here:";
    document.querySelector(".fox").innerHTML = "🦊";
  }, 3000);
  document.querySelector(".address").innerHTML = "Wallet address is copied!";
  document.querySelector(".fox").innerHTML = "";
})

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
  let url = tabs[0].url;
  if (url !=  "https://app.wonderland.money/#/stake"){
    warning = `
    <h2> This extension requires you to be on Wonderland's staking page! </h2>
    <h3> Please go to 
      <a href='https://app.wonderland.money/#/stake' target='_blank'>Wonderland</a> 
      to access this calculator
    </h3>
    `
    document.querySelector(".main").innerHTML = warning;
  }
  else{
    getData()
  }
});

async function getData(){

  let res = await fetch(url);
  let data = await res.json();
  price = data.wonderland.usd

  document.querySelector(".price").innerHTML = "<h3>Current Price: $" + price + "</h3>";

  // CURRENT HOLDINGS
  function current(results){   
      totalHoldings = results[0][1]*price
      document.querySelector(".current").innerHTML = "<h3>Current Holding: $" + totalHoldings.toFixed(2) + "</h3>";
    }

  chrome.tabs.query({active: true}, function(tabs) {
    let tab = tabs[0];
    chrome.tabs.executeScript(tab.id, {
      file: "data.js"
    }, current);
  });

  // DAILY INCOME
  function daily (results){
    yld = results[0][0]
    staked = results[0][1]
    dailyPercent = (((1+yld/100)**3)-1)
    dailyDollars = dailyPercent*staked*price 
    document.querySelector(".income").innerHTML = "<h3>Daily Income: $" + dailyDollars.toFixed(2) + "</h3>";
  }

  chrome.tabs.query({active: true}, function(tabs) {
    let tab = tabs[0];
    chrome.tabs.executeScript(tab.id, {
      file: "data.js"
    }, daily);
  });

  // ON SPECIFIC DATE
  document.getElementById("calc").addEventListener("click", wrapper);

  function wrapper(){

    selected = new Date(document.getElementsByName("date")[0].value);
    todayRaw = new Date();
    diffTime = Math.abs(selected.getTime() - todayRaw.getTime());
    diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));  

    function onDate(results){   
        yld = results[0][0];
        staked = results[0][1];
        totalEarned = (((1+yld/100)**(diffDays*3))-1)*staked
        totalMemos = Number(staked) + Number(totalEarned) 
        html = `
        <ul>
          <li>` + totalMemos.toFixed(4) + ` MEMOs </l1>
          <li> $` + (totalMemos*price).toFixed(2) +`</li>
        </ul>`
        document.querySelector(".ondate").innerHTML = html;
      }

    chrome.tabs.query({active: true}, function(tabs) {
      let tab = tabs[0];
      chrome.tabs.executeScript(tab.id, {
        file: "data.js",
    }, onDate);
  });

  }

}