let url = "https://api.coingecko.com/api/v3/simple/price?ids=wonderland&vs_currencies=usd"


let today = new Date((new Date()).valueOf() + 1000*3600*24).toISOString().split('T')[0];
document.getElementsByName("date")[0].setAttribute('min', today);
document.getElementsByName("date")[0].value = today;

const address = document.querySelector(".address");

address.addEventListener('click', () => {
  let copied = address.innerText
  navigator.clipboard.writeText(copied);
  setTimeout(function(){
    document.querySelector(".holder").innerHTML = "If you like my work, you can donate here:";
    }, 3000);
  document.querySelector(".holder").innerHTML = "Address Copied!";;
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

  function current(results){   
      totalHoldings = results[0][1]*price
      console.log('Script is running')
      document.querySelector(".current").innerHTML = "<h3>Current Holding: $" + totalHoldings.toFixed(2) + "</h3>";
    }

  chrome.tabs.query({active: true}, function(tabs) {
    let tab = tabs[0];
    chrome.tabs.executeScript(tab.id, {
      file: "data.js"
    }, current);
  });

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
        document.querySelector(".ondate").innerHTML = totalMemos.toFixed(4) + ' MEMOs or $'+(totalMemos*price).toFixed(2);
      }

    chrome.tabs.query({active: true}, function(tabs) {
      let tab = tabs[0];
      chrome.tabs.executeScript(tab.id, {
        file: "data.js",
    }, onDate);
  });

  }

}