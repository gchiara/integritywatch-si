import jquery from 'jquery';
window.jQuery = jquery;
window.$ = jquery;
require( 'datatables.net' )( window, $ )
require( 'datatables.net-dt' )( window, $ )

import underscore from 'underscore';
window.underscore = underscore;
window._ = underscore;

import '../public/vendor/js/popper.min.js'
import '../public/vendor/js/bootstrap.min.js'
import { csv } from 'd3-request'
import { json } from 'd3-request'

import '../public/vendor/css/bootstrap.min.css'
import '../public/vendor/css/dc.css'
import '/scss/main.scss';

import Vue from 'vue';
import Loader from './components/Loader.vue';
import ChartHeader from './components/ChartHeader.vue';


// Data object - is also used by Vue

var vuedata = {
  page: 'tabD',
  loader: true,
  readMore: false,
  showInfo: true,
  showShare: true,
  showAllCharts: true,
  chartMargin: 40,
  maxGiftValue: 0,
  avgGiftValue: 0,
  charts: {
    years: {
      title: 'Število daril po letih',
      info: 'Seštevek daril, ki so jih funkcionarji in državni organi prejeli v določenem koledarskem letu. '
    },
    valRange: {
      title: 'Vrednost daril',
      info: 'Prikaz porazdelitve ocenjene vrednosti daril po vrednostnih razredih'
    },
    topOrgsNum: {
      title: 'Najpogostejši prejemniki - Top 10',
      info: 'Prikaz najpogostejših prejemnikov daril. Na abscisi je grafično prikazano še število prejetih daril.'
    },
    topOrgsVal: {
      title: 'Prejemniki - Top 10 po vrednosti daril ',
      info: 'Prikaz najpogostejših prejemnikov po vrednosti daril. Na abscisi je grafično prikazana še kumulativna vrednost daril, ki jih je prejel posamezen prejemnik.'
    },
    topDonors: {
      title: 'Darovalci - Top 10',
      info: ' Prikaz posameznikov in organizacij, ki so funkcionarje in državne organe najpogosteje obdarovale. Na abscisi je grafično prikazano še število darovanih daril. '
    },
    type: {
      title: 'Tip darila',
      info: 'Diagram prikazuje porazdelitev poročanih daril glede na tip. Možna sta dva tipa: priložnostno in protokolarno. '
    },
    method: {
      title: 'Način izročitve',
      info: 'Diagram prikazuje porazdelitev poročanih daril glede na način izročitve. Možna sta dva tipa: neposredno in posredno. '
    },
    occasion: {
      title: 'Priložnost darovanja',
      info: 'Razvrstitev daril po priložnosti obdarovanja.  Na abscisi je grafično prikazano še število prejetih daril ob posamezni priložnosti.'
    },
    cloud: {
      title: 'Opis darila',
      info: 'Besedni oblak prikazuje besede, uporabljene v podrobnih opisih daril. S klikom na posamezne besede se vam prikažejo obdarovanja, pri katerih je beseda vsebovana v podrobnem opisu stika.'
    },
    mainTable: {
      chart: null,
      type: 'table',
      title: 'Darila',
      info: ''
    }
  },
  selectedElement: { "P": "", "Sub": ""},
  modalShowTable: '',
  colors: {
    //generic: ["#3b95d0", "#4081ae", "#406a95", "#395a75" ],
    generic: ["#2b90b8", "#0d506b", "#03678f"],
    default1: "#2b90b8",
    pie1: {
      "Poslovni subjekt": "#0d506b",
      "Kmetijsko gospodarstvo": "#1d7598"
    },
    pie2: {
      "Neomejeno": "#0d506b",
      "Omejeno": "#1d7598"
    }
  }
}



//Set vue components and Vue app

Vue.component('chart-header', ChartHeader);
Vue.component('loader', Loader);

new Vue({
  el: '#app',
  data: vuedata,
  methods: {
    //Share
    downloadDataset: function () {
      window.open('./data/tab_d/gifts.csv');
    },
    share: function (platform) {
      if(platform == 'twitter'){
        var thisPage = window.location.href.split('?')[0];
        var shareText = 'Za katere institucije vlade in parlamenta veljajo omejitve poslovanja zaradi zasebnih interesov funkcionarjev? Odkrijte na spletni strani @TransparencySi #VaruhIntegritete ' + thisPage;
        var shareURL = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText);
        window.open(shareURL, '_blank');
        return;
      }
      if(platform == 'facebook'){
        var toShareUrl = 'https://integritywatch.si';
        var shareURL = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(toShareUrl);
        window.open(shareURL, '_blank', 'toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=250,top=300,left=300');
        return;
      }
    }
  }
});

//Initialize info popovers
$(function () {
  $('[data-toggle="popover"]').popover()
})

//Charts
var charts = {
  years: {
    chart: dc.barChart("#years_chart"),
    type: 'bar',
    divId: 'years_chart'
  },
  valRange: {
    chart: dc.rowChart("#valrange_chart"),
    type: 'row',
    divId: 'valrange_chart'
  },
  topOrgsNum: {
    chart: dc.rowChart("#toporgsnum_chart"),
    type: 'row',
    divId: 'toporgsnum_chart'
  },
  topOrgsVal: {
    chart: dc.rowChart("#toporgsval_chart"),
    type: 'row',
    divId: 'toporgsval_chart'
  },
  topDonors: {
    chart: dc.rowChart("#topdonors_chart"),
    type: 'row',
    divId: 'topdonors_chart'
  },
  type: {
    chart: dc.pieChart("#type_chart"),
    type: 'pie',
    divId: 'type_chart'
  },
  method: {
    chart: dc.pieChart("#method_chart"),
    type: 'pie',
    divId: 'method_chart'
  },
  occasion: {
    chart: dc.rowChart("#occasion_chart"),
    type: 'row',
    divId: 'occasion_chart'
  },
  cloud: {
    chart: dc.wordCloud("#cloud_chart"),
    type: 'cloud',
    divId: 'cloud_chart'
  },
  mainTable: {
    chart: null,
    type: 'table',
    divId: 'dc-data-table'
  }
}

//Functions for responsivness
var recalcWidth = function(divId) {
  return document.getElementById(divId).offsetWidth - vuedata.chartMargin;
};
var recalcWidthWordcloud = function(divId) {
  //Replace element if with wordcloud column id
  var width = document.getElementById(divId).offsetWidth - vuedata.chartMargin;
  return [width, 400];
};
var recalcCharsLength = function(width) {
  return parseInt(width / 8);
};
var calcPieSize = function(divId) {
  var newWidth = recalcWidth(divId);
  if(newWidth > 400) {
    newWidth = 400;
  }
  var sizes = {
    'width': newWidth,
    'height': 0,
    'radius': 0,
    'innerRadius': 0,
    'cy': 0,
    'legendY': 0
  }
  if(newWidth < 300) { 
    sizes.height = newWidth + 170;
    sizes.radius = (newWidth)/2;
    sizes.innerRadius = (newWidth)/4;
    sizes.cy = (newWidth)/2;
    sizes.legendY = (newWidth) + 30;
  } else {
    sizes.height = newWidth*0.75 + 170;
    sizes.radius = (newWidth*0.75)/2;
    sizes.innerRadius = (newWidth*0.75)/4;
    sizes.cy = (newWidth*0.75)/2;
    sizes.legendY = (newWidth*0.75) + 30;
  }
  return sizes;
};
var resizeGraphs = function() {
  for (var c in charts) {
    var sizes = calcPieSize(charts[c].divId);
    var newWidth = recalcWidth(charts[c].divId);
    var charsLength = recalcCharsLength(newWidth);
    if(charts[c].type == 'row'){
      charts[c].chart.width(newWidth);
      charts[c].chart.label(function (d) {
        var thisKey = d.key;
        if(thisKey.indexOf('###') > -1){
          thisKey = thisKey.split('###')[0];
        }
        if(thisKey.length > charsLength){
          return thisKey.substring(0,charsLength) + '...';
        }
        return thisKey;
      })
      charts[c].chart.redraw();
    } else if(charts[c].type == 'bar') {
      charts[c].chart.width(newWidth);
      charts[c].chart.rescale();
      charts[c].chart.redraw();
    } else if(charts[c].type == 'pie') {
      charts[c].chart
        .width(sizes.width)
        .height(sizes.height)
        .cy(sizes.cy)
        .innerRadius(sizes.innerRadius)
        .radius(sizes.radius)
        .legend(dc.legend().x(0).y(sizes.legendY).gap(10).legendText(function(d) { 
          var thisKey = d.name;
          if(thisKey.length > charsLength){
            return thisKey.substring(0, charsLength) + '...';
          }
          return thisKey;
        }));
      charts[c].chart.redraw();
    } else if(charts[c].type == 'cloud') {
      charts[c].chart.size(recalcWidthWordcloud(charts[c].divId));
      charts[c].chart.redraw();
    }
  }
};

//Add commas to thousands
function addcommas(x){
  if(parseInt(x)){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return x;
}
//Custom date order for dataTables
var dmy = d3.timeParse("%d/%m/%Y");
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
  "date-eu-pre": function (date) {
    if(date.indexOf("Cancelled") > -1){
      date = date.split(" ")[0];
    }
      return dmy(date);
  },
  "date-eu-asc": function ( a, b ) {
      return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  },
  "date-eu-desc": function ( a, b ) {
      return ((a < b) ? 1 : ((a > b) ? -1 : 0));
  }
});

//Generate random parameter for dynamic dataset loading (to avoid caching)
var randomPar = '';
var randomCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
for ( var i = 0; i < 5; i++ ) {
  randomPar += randomCharacters.charAt(Math.floor(Math.random() * randomCharacters.length));
}
//Load data and generate charts
csv('./data/tab_d/gifts.csv?' + randomPar, (err, entries) => {
  //Filter data by relevant orgs
  entries = entries.filter(function(d) { 
    return true;
  });
  console.log(entries);
  //Loop through data to aply fixes and calculations
  _.each(entries, function (d) {
    console.log(d);
    var dateSplit = d.date.split('. ')
    d.date = dateSplit[2] + '-' + dateSplit[1] + '-' + dateSplit[0];
    d.year = dateSplit[2];
    d.valueClean = 0;
    if(d.value.indexOf(' EUR') > -1) {
      d.valueClean = parseFloat(d.value.replace(',','').replace(' EUR', ''));
    }
    d.valueRange = 'N/A';
    if(d.value == 'neocenjena vrednost') {
      d.valueRange = 'neocenjena vrednost';
    } else if(d.valueClean <= 50) {
      d.valueRange = '0 - 50';
    } else if(d.valueClean <= 100) {
      d.valueRange = '51 - 100';
    } else if(d.valueClean <= 500) {
      d.valueRange = '101 - 500';
    } else if(d.valueClean > 500) {
      d.valueRange = 'nad 500';
    }

    if(d.donor == '/') {
      d.donor = 'ni podatka';
    }
  });

  //Set dc main vars. The second crossfilter is used to handle the travels stacked bar chart.
  var ndx = crossfilter(entries);
  var searchDimension = ndx.dimension(function (d) {
      var entryString = ' ' + d.org + ' ' + d.recipient + ' ' + d.donor + ' ' + d.description;
      return entryString.toLowerCase();
  });

  //CHART 1 - Years
  var createYearsChart = function() {
    var chart = charts.years.chart;
    var dimension = ndx.dimension(function (d) {
      return d.year;
    });
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(Infinity).filter(function(d) {
            return d.key !== "2107" && d.key !== "2013";
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.years.divId);
    chart
      .width(width)
      .height(300)
      .group(filteredGroup)
      .dimension(dimension)
      .on("preRender",(function(chart,filter){
      }))
      .margins({top: 0, right: 10, bottom: 20, left: 70})
      .x(d3.scaleBand())
      .xUnits(dc.units.ordinal)
      .gap(20)
      .elasticY(true)
      .title(function(d){
        var thisKey = d.key;
        return thisKey + ': ' + d.value + ' daril';
      })
      .colorCalculator(function(d, i) {
        return vuedata.colors.default1;
      });
    chart.render();
    chart.on('filtered', function(c) { 
      getMaxAndAvgValues();
      dc.redrawAll();
    });
  }

  //CHART 1
  var createValRangeChart = function() {
    var chart = charts.valRange.chart;
    var dimension = ndx.dimension(function (d) {
      return d.valueRange;
    });
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(10).filter(function(d) {
            return true;
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.valRange.divId);
    var charsLength = recalcCharsLength(width);
    var order = ['0 - 50', '51 - 100', '101 - 500', 'nad 500', 'neocenjena vrednost'];
    chart
      .width(width)
      .height(300)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      //.gap(10)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default1;
      })
      .label(function (d) {
        if(d.key && d.key.length > charsLength){
          return d.key.substring(0,charsLength) + '...';
        }
        return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value + ' daril';
      })
      .ordering(function(d) { return order.indexOf(d.key)})
      .elasticX(true)
      .xAxis().ticks(4);
      //chart.xAxis().tickFormat(numberFormat);
      chart.render();
      chart.on('filtered', function(c) { 
        getMaxAndAvgValues();
        dc.redrawAll();
      });
  }

  //CHART 3
  var createTypeChart = function() {
    var chart = charts.type.chart;
    var dimension = ndx.dimension(function (d) {
      return d.gift_type;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.type.divId);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .legend(dc.legend().x(0).y(sizes.legendY).gap(10).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey.length > 40){
          return thisKey.substring(0,40) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        var thisKey = d.key;
        return thisKey + ': ' + d.value;
      })
      .dimension(dimension)
      .ordinalColors(vuedata.colors.generic)
      .group(group);

    chart.render();
    chart.on('filtered', function(c) { 
      getMaxAndAvgValues();
      dc.redrawAll();
    });
  }

  //CHART 1
  var createTopOrgsNumChart = function() {
    var chart = charts.topOrgsNum.chart;
    var dimension = ndx.dimension(function (d) {
      return d.org;
    });
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(10).filter(function(d) {
            return true;
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.topOrgsNum.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(400)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default1;
      })
      .label(function (d) {
        if(d.key && d.key.length > charsLength){
          return d.key.substring(0,charsLength) + '...';
        }
        return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value;
      })
      .elasticX(true)
      .xAxis().ticks(4);
      //chart.xAxis().tickFormat(numberFormat);
      chart.render();
      chart.on('filtered', function(c) { 
        getMaxAndAvgValues();
        dc.redrawAll();
      });
  }

  //CHART 2
  var createTopOrgsValChart = function() {
    var chart = charts.topOrgsVal.chart;
    var dimension = ndx.dimension(function (d) {
      return d.org;
    });
    var group = dimension.group().reduceSum(function (d) {
        return d.valueClean;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(10).filter(function(d) {
            return true;
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.topOrgsVal.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(400)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default1;
      })
      .label(function (d) {
        if(d.key && d.key.length > charsLength){
          return d.key.substring(0,charsLength) + '...';
        }
        return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value;
      })
      .elasticX(true)
      .xAxis().ticks(4);
      //chart.xAxis().tickFormat(numberFormat);
      chart.render();
      chart.on('filtered', function(c) { 
        getMaxAndAvgValues();
        dc.redrawAll();
      });
  }

  //CHART 2
  var createTopDonorsChart = function() {
    var chart = charts.topDonors.chart;
    var dimension = ndx.dimension(function (d) {
      return d.donor;
    });
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(10).filter(function(d) {
            return true;
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.topDonors.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(400)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default1;
      })
      .label(function (d) {
        if(d.key && d.key.length > charsLength){
          return d.key.substring(0,charsLength) + '...';
        }
        return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value;
      })
      .elasticX(true)
      .xAxis().ticks(4);
      //chart.xAxis().tickFormat(numberFormat);
      chart.render();
      chart.on('filtered', function(c) { 
        getMaxAndAvgValues();
        dc.redrawAll();
      });
  }

  //CHART 3
  var createMethodChart = function() {
    var chart = charts.method.chart;
    var dimension = ndx.dimension(function (d) {
      return d.delivery_method;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.method.divId);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .legend(dc.legend().x(0).y(sizes.legendY).gap(10).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey.length > 40){
          return thisKey.substring(0,40) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        var thisKey = d.key;
        return thisKey + ': ' + d.value;
      })
      .dimension(dimension)
      .ordinalColors(vuedata.colors.generic)
      .group(group);

    chart.render();
    chart.on('filtered', function(c) { 
      getMaxAndAvgValues();
      dc.redrawAll();
    });
  }

  //CHART 2
  var createOccasionChart = function() {
    var chart = charts.occasion.chart;
    var dimension = ndx.dimension(function (d) {
      return d.delivery_occasion;
    });
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(10).filter(function(d) {
            return true;
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.occasion.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(400)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default1;
      })
      .label(function (d) {
        if(d.key && d.key.length > charsLength){
          return d.key.substring(0,charsLength) + '...';
        }
        return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value;
      })
      .elasticX(true)
      .xAxis().ticks(4);
      //chart.xAxis().tickFormat(numberFormat);
      chart.render();
      chart.on('filtered', function(c) { 
        getMaxAndAvgValues();
        dc.redrawAll();
      });
  }

  //CHART 7
  var createWordCloud = function() {
    var chart = charts.cloud.chart;
    var dimension = ndx.dimension(function(d) {
      return d.description || "";
    })
    var group = dimension.group().reduceSum(function(d) { return 1; });
    chart
    .dimension(dimension)
    .group(group)
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .maxWords(60)
    .timeInterval(10)
    .duration(200)
    .ordinalColors(vuedata.colors.generic)
    .size([recalcWidth(charts.cloud.divId),350])
    .font("Impact")
    .scale(d3.scaleLinear().domain([2,70]).range([9, 26]))
    .stopWords(/^(V|a|zvezi|kateri|med|ali|and|april|avgust|b|bi|bil|bila|bile|bili|bilo|biti|blizu|bo|bodo|bojo|bolj|bom|bomo|boš|boste|bova|brez|c|č|če|cel|cela|celi|celo|često|četrta|četrtek|četrti|četrto|čez|čigav|člen|člena|d|da|daleč|dan|danes|datum|december|deset|deseta|deseti|deseto|devet|deveta|deveti|deveto|do|dober|dobra|dobri|dobro|dokler|dol|dolg|dolga|dolgi|dolgotrajni|dopolnitev|dopolnitvah|dopolnitve|dovolj|drug|druga|drugi|drugo|dva|dve|e|eden|en|ena|ene|eni|enkrat|eno|etc.|f|februar|g|g.|ga|ga.|glede|gor|gospa|gospod|h|halo|i|idr.|ii|iii|in|iv|ix|iz|j|januar|jaz|je|ji|jih|jim|jo|julij|junij|jutri|k|kadarkoli|kaj|kajti|kako|kakor|kamor|kamorkoli|kar|karkoli|katerikoli|kdaj|kdo|kdorkoli|ker|ki|kje|kjer|kjerkoli|ko|koder|koderkoli|koga|komu|kot|kratek|kratka|kratke|kratki|l|lahka|lahke|lahki|lahko|le|lep|lepa|lepe|lepi|lepo|let|leto|ljubljana|m|maj|majhen|majhna|majhni|malce|malo|manj|marec|me|med|medtem|mene|mesec|mi|midva|midve|mnogo|moj|moja|moje|mora|morajo|moram|moramo|moraš|morate|morem|motiv|motivi|motivom|mu|n|na|nad|naj|najina|najino|najmanj|naju|največ|nam|narobe|nas|naš|naša|naše|nato|nazaj|ne|nedavno|nedelja|nek|neka|nekaj|nekatere|nekateri|nekatero|nekdo|neke|nekega|neki|nekje|neko|nekoč|nekoga|ni|nič|nikamor|nikdar|nikjer|nikoli|nje|njega|njegov|njegova|njegovo|njej|njemu|njen|njena|njeno|nji|njih|njihov|njihova|njihovo|njiju|njim|njo|njun|njuna|njuno|no|nocoj|novele|november|novo|npr.|o|ob|oba|obe|oboje|od|odprt|odprta|odprti|of|okoli|oktober|on|onadva|one|oni|onidve|osem|osma|osmi|osmo|oz.|p|pa|pet|peta|petek|peti|peto|po|pod|pogosto|poleg|poln|polna|polni|polno|ponavadi|ponedeljek|ponovno|potem|povsod|pozdravljen|pozdravljeni|prav|prava|prave|pravi|pravo|prazen|prazna|prazno|prbl.|precej|pred|predlog|predloga|predlogom|predstavitev|prej|preko|pri|pribl.|približno|primer|pripravljen|pripravljena|pripravljeni|problematike|proti|prva|prvi|prvo|r|ravno|reč|redko|res|s|š|saj|sam|sama|same|sami|samo|se|sebe|sebi|sedaj|sedem|sedma|sedmi|sedmo|sem|september|šest|šesta|šesti|šesto|seveda|si|sicer|skoraj|skozi|slab|Slovenije|smo|so|sobota|spet|sprememb|spremembo|sreda|srednja|srednji|sta|ste|štiri|stran|stvar|sva|t|ta|tak|taka|take|taki|tako|takoj|tam|te|tebe|tebi|tega|ter|težak|težka|težki|težko|ti|tista|tiste|tisti|tisto|tj.|tja|to|toda|torek|tretja|tretje|tretji|tri|tu|tudi|tukaj|tvoj|tvoja|tvoje|u|ukrep|ukrepi|ukrepih|v|vaju|vam|vas|vaš|vaša|vaše|včasih|včeraj|ve|več|vedno|velik|velika|veliki|veliko|vendar|ves|vi|vidva|vii|viii|visok|visoka|visoke|visoki|vsa|vsaj|vsak|vsaka|vsakdo|vsake|vsaki|vsakomur|vse|vsega|vsi|vso|X|x|z|ž|za|zadaj|zadnji|zakaj|zakon|zakoni|zakonih|zakonu|zaprta|zaprti|zaprto|zdaj|že|zelo|zunaj)$/)
    .onClick(function(d){setword(d.key);})
    .textAccessor(function(d) {return d.description;});
    chart.size(recalcWidthWordcloud(charts.cloud.divId));
    chart.render();
  }
  
  //TABLE
  var createTable = function() {
    var count=0;
    charts.mainTable.chart = $("#dc-data-table").dataTable({
      "language": {
        "info": "Prikazujem _START_ do _END_ od _TOTAL_ vnosov",
        "lengthMenu": "Prikaži _MENU_ vnosov",
        "search": "Keresés",
        "paginate": {
          "first":      "First",
          "last":       "Last",
          "next":       "Naslednja",
          "previous":   "Prejšnja"
        }
      },
      "columnDefs": [
        {
          "searchable": false,
          "orderable": false,
          "targets": 0,   
          data: function ( row, type, val, meta ) {
            return count;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 1,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.date;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 2,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.org;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 3,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.recipient;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 4,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.donor;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 5,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.description;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 6,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.value;
          }
        },
      ],
      "iDisplayLength" : 25,
      "bPaginate": true,
      "bLengthChange": true,
      "bFilter": false,
      "order": [[ 1, "desc" ]],
      "bSort": true,
      "bInfo": true,
      "bAutoWidth": false,
      "bDeferRender": true,
      "aaData": searchDimension.top(Infinity),
      "bDestroy": true,
    });
    var datatable = charts.mainTable.chart;
    datatable.on( 'draw.dt', function () {
      var PageInfo = $('#dc-data-table').DataTable().page.info();
        datatable.DataTable().column(0, { page: 'current' }).nodes().each( function (cell, i) {
            cell.innerHTML = i + 1 + PageInfo.start;
        });
      });
      datatable.DataTable().draw();

    $('#dc-data-table tbody').on('click', 'tr', function () {
      var data = datatable.DataTable().row( this ).data();
      vuedata.selectedElement = data;
      $('#detailsModal').modal();
    });
  }
  //REFRESH TABLE
  function RefreshTable() {
    dc.events.trigger(function () {
      var alldata = searchDimension.top(Infinity);
      charts.mainTable.chart.fnClearTable();
      charts.mainTable.chart.fnAddData(alldata);
      charts.mainTable.chart.fnDraw();
    });
  }

  //SEARCH INPUT FUNCTIONALITY
  var typingTimer;
  var doneTypingInterval = 1000;
  var $input = $("#search-input");
  $input.on('keyup', function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  });
  $input.on('keydown', function () {
    clearTimeout(typingTimer);
  });
  function doneTyping () {
    var s = $input.val().toLowerCase();
    searchDimension.filter(function(d) { 
      return d.indexOf(s) !== -1;
    });
    throttle();
    var throttleTimer;
    function throttle() {
      window.clearTimeout(throttleTimer);
      throttleTimer = window.setTimeout(function() {
          dc.redrawAll();
      }, 250);
    }
  }

  //Set word for wordcloud
  var setword = function(wd) {
    //console.log(charts.subject.chart);
    $("#search-input").val(wd);
    var s = wd.toLowerCase();
    searchDimension.filter(function(d) { 
      return d.indexOf(s) !== -1;
    });
    throttle();
    var throttleTimer;
    function throttle() {
      window.clearTimeout(throttleTimer);
      throttleTimer = window.setTimeout(function() {
          dc.redrawAll();
      }, 250);
    }
    getMaxAndAvgValues();
  }

  var getMaxAndAvgValues = function() {
    var maxVal = 0;
    var valuesArray = [];
    var filteredData = searchDimension.top(Infinity);
    _.each(filteredData, function (d) {
      if(d.valueClean > maxVal) { maxVal = d.valueClean; }
      if(d.value !== 'neocenjena vrednost') {valuesArray.push(d.valueClean); }
    });
    var valSum = valuesArray.reduce((a, b) => a + b, 0);
    vuedata.maxGiftValue = maxVal;
    if(valuesArray.length > 0) {
      vuedata.avgGiftValue = valSum / valuesArray.length;
    } else {
      vuedata.avgGiftValue = 0;
    }
  }

  //Reset charts
  var resetGraphs = function() {
    for (var c in charts) {
      if(charts[c].type !== 'table' && charts[c].chart.hasFilter()){
        charts[c].chart.filterAll();
      }
    }
    searchDimension.filter(null);
    $('#search-input').val('');
    getMaxAndAvgValues();
    dc.redrawAll();
  }
  $('.reset-btn').click(function(){
    resetGraphs();
  })
  
  //Render charts
  createYearsChart();
  createValRangeChart();
  createTopOrgsNumChart();
  createTopOrgsValChart();
  createTopDonorsChart();
  createTypeChart();
  createMethodChart();
  createOccasionChart();
  createWordCloud();
  createTable();
  getMaxAndAvgValues();

  $('.dataTables_wrapper').append($('.dataTables_length'));

  //Hide loader
  vuedata.loader = false;

  //COUNTERS
  //Main counter
  var all = ndx.groupAll();
  var counter = dc.dataCount('.dc-data-count')
    .dimension(ndx)
    .group(all);
  counter.render();
  //Update datatables
  counter.on("renderlet.resetall", function(c) {
    RefreshTable();
  });

  //Window resize function
  window.onresize = function(event) {
    resizeGraphs();
  };
})
