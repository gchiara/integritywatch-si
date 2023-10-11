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
  page: 'tabC',
  loader: true,
  readMore: false,
  showInfo: true,
  showShare: true,
  showAllCharts: true,
  chartMargin: 40,
  instFilter: 'all',
  relevantOrgs: ["državni zbor republike slovenije", "državni svet republike slovenije", "kabinet predsednika vlade", "generalni sekretariat vlade", "ministrstvo za delo, družino, socialne zadeve in enake možnosti", "ministrstvo za finance", "ministrstvo za gospodarski razvoj in tehnologijo", "ministrstvo za infrastrukturo", "ministrstvo za izobraževanje, znanost in šport", "ministrstvo za javno upravo", "ministrstvo za kmetijstvo, gozdarstvo in prehrano", "ministrstvo za kulturo", "ministrstvo za notranje zadeve", "ministrstvo za obrambo", "ministrstvo za okolje in prostor", "ministrstvo za pravosodje", "ministrstvo za zdravje", "ministrstvo za zunanje zadeve", "služba vlade republike slovenije za razvoj in evropsko kohezijsko politiko", "urad vlade republike slovenije za slovence v zamejstvu in po svetu", "služba vlade republike slovenije za digitalno preobrazbo"],
  charts: {
    institutions: {
      title: 'Število omejitev na institucijo',
      info: 'Prikaz porazdelitve vpisanih omejitev poslovanja po posameznih organizacijah javnega sektorja. S poslovnimi subjekti z veljavnimi omejitvami poslovanja organizacije ne smejo poslovati. Omejitve ne veljajo za poslovanje na podlagi pogodb, ki so bile sklenjene, preden je funkcionar nastopil funkcijo.'
    },
    business: {
      title: 'Vrsta subjekta',
      info: 'Prikaz porazdelitve vpisanih omejitev poslovanja po vrstah subjektov. Subjekti se delijo v dve skupini: poslovne subjekte in kmetijska gospodarstva .'
    },
    limitations: {
      title: 'Časovna omejitev',
      info: 'Prikaz porazdelitve omejitev poslovanja glede na njihovo časovno omejenost.'
    },
    mainTable: {
      chart: null,
      type: 'table',
      title: 'Omejitve',
      info: 'Podrobnejši podatki o omejitvah poslovanja.'
    }
  },
  selectedElement: { "P": "", "Sub": ""},
  modalShowTable: '',
  colors: {
    generic: ["#3b95d0", "#4081ae", "#406a95", "#395a75" ],
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
      window.open('./data/tab_b/parliament.csv');
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
  institutions: {
    chart: dc.rowChart("#institutions_chart"),
    type: 'row',
    divId: 'institutions_chart'
  },
  business: {
    chart: dc.pieChart("#business_chart"),
    type: 'pie',
    divId: 'business_chart'
  },
  limitations: {
    chart: dc.pieChart("#limitations_chart"),
    type: 'pie',
    divId: 'limitations_chart'
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
var recalcWidthWordcloud = function() {
  //Replace element if with wordcloud column id
  var width = document.getElementById("party_chart").offsetWidth - vuedata.chartMargin*2;
  return [width, 550];
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
      charts[c].chart.size(recalcWidthWordcloud());
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
var lobbyist_typeList = {}
json('./data/tab_c/omejitve.json?' + randomPar, (err, entries) => {
  //Filter data by relevant orgs
  //vuedata.relevantOrgs
  entries = entries.filter(function(d) { 
    return vuedata.relevantOrgs.indexOf(d.organ.toLowerCase().trim()) > -1;
  });
  //Loop through data to aply fixes and calculations
  _.each(entries, function (d) {
    d.organ = d.organ.charAt(0).toUpperCase() + d.organ.slice(1).toLowerCase();
    d.organ = d.organ.replace("republike slovenije", "Republike Slovenije");
    d.organ = d.organ.replace("vlade republike slovenije", "Vlade Republike Slovenije");
    d.organ = d.organ.replace("Svrk", "Služba vlade za razvoj in kohezijsko evropsko kohezijsko politiko");
    d.organ = d.organ.replace("Urad vlade rs za slovence v zamejstvu in po svetu", "Urad vlade za Slovence v zamejstvu in po svetu");
    d.organ = d.organ.replace("9999-12-30", "Do preklica");
    d.organ = d.organ.replace("Služba vlade za razvoj in evropsko kohezijsko politiko","Služba vlade za razvoj in Evropsko kohezijsko politiko");
    d.organ = d.organ.replace("Urad vlade za slovence v zamejstvu in po svetu","Urad vlade za Slovence v zamejstvu in po svetu");
    //Clean d.tip_omejitve
    if(d.tip_omejitve == "ps") {d.tip_omejitve = "Poslovni subjekt"}
    if(d.tip_omejitve == "kg") {d.tip_omejitve = "Kmetijsko gospodarstvo"}
  });

  //Set dc main vars. The second crossfilter is used to handle the travels stacked bar chart.
  var ndx = crossfilter(entries);
  var searchDimension = ndx.dimension(function (d) {
      var entryString = ' ' + d.organ.toLowerCase() + ' ' + d.tip_omejitve + ' ' + d.ps_naziv;
      return entryString.toLowerCase();
  });

  //CHART 1
  var createInstitutionsChart = function() {
    var chart = charts.institutions.chart;
    var dimension = ndx.dimension(function (d) {
      return d.organ;
    });
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var width = recalcWidth(charts.institutions.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(700)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(group)
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
  }

  //CHART 2
  var createBusinessChart = function() {
    var chart = charts.business.chart;
    var dimension = ndx.dimension(function (d) {
      return d.tip_omejitve; 
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.business.divId);
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
      .colorCalculator(function(d, i) {
        return vuedata.colors.pie1[d.key];
      })
      .group(group);

    chart.render();
  }

  //CHART 3
  var createLimitationsChart = function() {
    var chart = charts.limitations.chart;
    var dimension = ndx.dimension(function (d) {
      if(d.datum_do == "9999-12-30") {
        return "Neomejeno";
      } else {
        return "Omejeno";
      }
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.limitations.divId);
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
      .colorCalculator(function(d, i) {
        return vuedata.colors.pie2[d.key];
      })
      .group(group);

    chart.render();
  }
  
  //TABLE
  var createTable = function() {
    var count=0;
    charts.mainTable.chart = $("#dc-data-table").dataTable({
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
            //id,function,party,institution,date,contact_type,org_name,lobbyist_type,purpose,purpose_details
            return d.organ;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 2,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.tip_omejitve;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 3,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.ps_naziv;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 4,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.datum_od;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 5,
          "defaultContent":"N/A",
          "data": function(d) {
            if(d.datum_do == "9999-12-30") {
              return "Do preklica";
            }
            return d.datum_do;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 6,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.Limited;
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

    /*
    $('#dc-data-table tbody').on('click', 'tr', function () {
      var data = datatable.DataTable().row( this ).data();
      vuedata.selectedElement = data;
      $('#detailsModal').modal();
    });
    */
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

  //Reset charts
  var resetGraphs = function() {
    for (var c in charts) {
      if(charts[c].type !== 'table' && charts[c].chart.hasFilter()){
        charts[c].chart.filterAll();
      }
    }
    searchDimension.filter(null);
    $('#search-input').val('');
    dc.redrawAll();
  }
  $('.reset-btn').click(function(){
    resetGraphs();
  })
  
  //Render charts
  createInstitutionsChart();
  createBusinessChart();
  createLimitationsChart();
  createTable();

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
