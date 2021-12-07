xValues = [];
yValues = [];

chrome.storage.sync.get(null, function(db){
  for (let key in db){
    xValues.push(key);
    yValues.push(db[key]);
  }
  if (xValues.length > 4){
    graphType = 'line';
  }
  else{
    graphType = 'bar';
  }
})

setTimeout(function(){
  new Chart("myChart", {
    type: graphType,
    data: {
      labels: xValues,
      datasets: [{
        fill: false,
        lineTension: 0,
        backgroundColor: "rgb(39, 60, 117,1.0)",
        borderColor: "rgb(39, 60, 117,0.3)",
        data: yValues
      }]
    },

    options: {
      legend: {display: false},
      title: {
        display: true,
        text: "Your holdings: "
      },  
      scales: {
        yAxes: [
          {ticks: {
              beginAtZero: true,
              maxTicksLimit: 5,
          }}],
        xAxes: [
            {ticks: {
                display: false,
            }}],
      },
      tooltips: {
        yAlign: 'bottom',
        callbacks: {
          label: function(item, everything){
            return " $" + item.yLabel;
          }
        }
      }
    }
  }); 
}, 1000);