Highcharts.setOptions({
  credits: {
    enabled: false
  }
  ,legend: {
    enabled: false
  }
  ,colors: ['#6cc573', '#71a9df', '#ffc809', '#fd7394']
  ,tooltip: {
    useHTML: true,
    borderWidth: 0,
    shadow: false,
    backgroundColor: null
  }
});
var donutsChartsStyle = {
  colors: {
    buyerLevel: ['#ffdd58', '#ffc809', '#f79a02', '#eb8200', '#ff6f42', '#d05126', '#9c3d1c', '#c12b14'],
    consumeLevel: ['#82e3ff', '#69c8ff', '#55b0ff', '#37a0f6', '#167dd4', '#1d6bbb', '#1160aa', '#16508c'],
    buyerAge: ['#ffc809', '#65c008', '#13dac0', '#ff6f42', '#2794ee', '#ff4489', '#8825ff', '#ccd6de'],
    sex: ['#2794ee', '#fd7394']
  }
};
 
$.fn.scharts = function(type, opt){
 
  $('.J_spending').highcharts({
    chart: {
      marginTop: 50
    },
    colors: ["#6cc573"],
    title: {
      text: '月均消费额',
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        color: '#000'
      }
    },
    tooltip: {
      formatter: function() {
        var bg, date;
        bg = this.point.series.color;
        date = ret.lineData.xDate[ret.lineData.xAxis.indexOf(this.x)];
        return buildTooltip(bg, this.y, date);
      }
    },
    xAxis: {
      categories: ret.lineData.xAxis
    },
    yAxis: {
      gridLineColor: '#eee',
      title: {
        text: ''
      }
    },
    plotOptions: {
      line: {
        lineWidth: 1,
        marker: {
          fillColor: "#fff",
          lineColor: null,
          lineWidth: 3,
          states: {
            hover: {
              radius: 3.5,
              lineWidth: 7
            }
          }
        }
      }
    },
    series: [
      {
        name: 'sss',
        data: ret.lineData.seriesData
      }
    ]
  });

}
