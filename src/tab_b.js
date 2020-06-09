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
  page: 'tabB',
  loader: true,
  readMore: false,
  showInfo: true,
  showShare: true,
  showAllCharts: true,
  chartMargin: 40,
  instFilter: 'all',
  charts: {
    topLobbyists: {
      title: 'Lobisti – Top 10',
      info: 'Organizacije, ki so z institucijo opravile največ poročanih lobističnih stikov.<br />Razporeditev se spreminja glede na vsakokratno izbiro filtrov.'
    },
    lobbyistCategory: {
      title: 'Status lobista',
      info: 'Diagram prikazuje porazdelitev poročanih lobističnih stikov institucije z lobisti glede na njihov status.'
    },
    party: {
      title: 'Lobistični stiki – poslanske/interesne skupine',
      info: 'Prikaz razdelitve poročanih lobističnih stikov po političnih strankah v instituciji. Vključeni so poročani lobistični stiki funkcionarjev in javnih uslužbencev.<br />Lobiranec mora o vsakem stiku z lobistom, ki ima namen lobirati, sestaviti zapis in ga v roku treh dni posredovati v vednost svojemu predstojniku in Komisiji za preprečevanje korupcije.<br />Opozorilo: Delež neznanih lobističnih stikov je nesorazmerno visok zaradi slabe kakovosti podatkov oziroma zaradi nedoslednega poročanja v zapisih o lobističnih stikih.'
    },
    officialType: {
      title: 'Funkcija/položaj lobiranca',
      info: 'Pravila o poročanju lobističnih stikov veljajo tako za funkcionarje kot javne uslužbence. Diagram odraža porazdelitev števila poročanih stikov glede na funkcijo oziroma položaj lobiranca.'
    },
    purposeType: {
      title: 'Namen lobiranja',
      info: 'Diagram prikazuje porazdelitev poročanih lobističnih stikov glede na namen lobiranja. Možna sta dva namena: vpliv na sprejem predpisov in drugih splošnih aktov in vpliv na odločanje v drugih zadevah. Poimenovanje obeh namenov je skrajšano.'
    },
    contactType: {
      title: 'Način lobiranja',
      info: 'Diagram prikazuje porazdelitev poročanih lobističnih stikov glede na način lobiranja.'
    },
    mainTable: {
      chart: null,
      type: 'table',
      title: 'Stiki',
      info: 'Za dodatne informacije o posameznem lobističnem stiku kliknite nanj.'
    }
  },
  lobbyistTypeCategories: {
    "Lobist je izvoljeni predstavnik interesne organizacije za katero lobira": "Izvoljeni predstavnik interesne organizacije",
    "Lobist je vpisan v register lobistov v RS": "Vpisan v register lobistov",
    "Lobist je zakoniti zastopnik interesne organizacije za katero lobira": "Zakoniti zastopnik interesne organizacije",
    "Lobist lobira za interesno organizacijo v kateri je zaposlen": "Zaposlen v interesni organizaciji",
  },
  purposeCategories: {
    "vpliv na sprejem predpisov in drugih splošnih aktov": "Sprejem predpisov",
    "vpliv na odločanje v drugih zadevah": "Odločanje v drugih zadevah"
  },
  institutionEntries: {},
  orgEntries: {},
  selectedElement: { "P": "", "Sub": ""},
  modalShowTable: '',
  colors: {
    generic: ["#3b95d0", "#4081ae", "#406a95", "#395a75" ],
    default1: "#2b90b8",
    function: {
      "Javni uslužbenec": "#0d506b",
      "Funkcionar": "#1d7598"
    },
    default2: "#449188",
    lobbyistType: {
      "Izvoljeni predstavnik organizacije": "#449188",
      "Registrirani lobist": "#41ab9f",
      "Zakoniti zastopnik organizacije": "#39c0b0",
      "Zaposlen v organizaciji": "#30cfbd",
    },
    /*
    lobbyistType: {
      "Lobist je izvoljeni predstavnik interesne organizacije za katero lobira": "#449188",
      "Lobist je vpisan v register lobistov v RS": "#41ab9f",
      "Lobist je zakoniti zastopnik interesne organizacije za katero lobira": "#39c0b0",
      "Lobist lobira za interesno organizacijo v kateri je zaposlen": "#30cfbd",
    },
    lobbyistTypeCategory: {
      "Izvoljeni predstavnik interesne organizacije": "#449188",
      "Vpisan v register lobistov": "#41ab9f",
      "Zakoniti zastopnik interesne organizacije": "#39c0b0",
      "Zaposlen v interesni organizaciji": "#30cfbd",
    },
    */
    contactType: {
      "Osebno": "#449188",
      "Po e-pošti": "#41ab9f",
      "Po pošti": "#39c0b0",
      "Po telefonu": "#30cfbd",
      "Drugo": "#63eddd",
    },
    purpose: {
      "Sprejem predpisov": "#449188",
      "Odločanje v drugih zadevah": "#39c0b0"
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
        var shareText = 'Share text here ' + thisPage;
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
  topLobbyists: {
    chart: dc.rowChart("#toplobbyists_chart"),
    type: 'row',
    divId: 'toplobbyists_chart'
  },
  lobbyistCategory: {
    chart: dc.pieChart("#lobbyistcategory_chart"),
    type: 'pie',
    divId: 'lobbyistcategory_chart'
  },
  party: {
    chart: dc.rowChart("#party_chart"),
    type: 'row',
    divId: 'party_chart'
  },
  officialType: {
    chart: dc.pieChart("#officialtype_chart"),
    type: 'pie',
    divId: 'officialtype_chart'
  },
  purposeType: {
    chart: dc.pieChart("#purposetype_chart"),
    type: 'pie',
    divId: 'purposetype_chart'
  },
  contactType: {
    chart: dc.pieChart("#contacttype_chart"),
    type: 'pie',
    divId: 'contacttype_chart'
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
csv('./data/tab_b/parliament.csv?' + randomPar, (err, contacts) => {
  //Loop through data to aply fixes and calculations
  _.each(contacts, function (d) {
    //Count entries per insitution
    if(vuedata.institutionEntries[d.institution]) {
      vuedata.institutionEntries[d.institution] ++;
    } else {
      vuedata.institutionEntries[d.institution] = 1;
    }
    //Count entries per organization
    if(vuedata.orgEntries[d.org_name]) {
      vuedata.orgEntries[d.org_name] ++;
    } else {
      vuedata.orgEntries[d.org_name] = 1;
    }
    //Change caps of contact_type and institution
    d.contact_type = d.contact_type.toLowerCase();
    d.contact_type = d.contact_type.charAt(0).toUpperCase() + d.contact_type.slice(1);
    d.institution_lowerCase = d.institution.toLowerCase();
    d.institution_lowerCase = d.institution_lowerCase.charAt(0).toUpperCase() + d.institution_lowerCase.slice(1);
    d.institution_lowerCase = d.institution_lowerCase.replace("republike slovenije", "Republike Slovenije");
    //Streamline Purpose
    d.purposeStreamlined = vuedata.purposeCategories[d.purpose.toLowerCase()];
  });

  //Set dc main vars. The second crossfilter is used to handle the travels stacked bar chart.
  var ndx = crossfilter(contacts);
  var searchDimension = ndx.dimension(function (d) {
      var entryString = ' ' + d.institution.toLowerCase();
      return entryString.toLowerCase();
  });

  //CHART 1
  var createPartyChart = function() {
    var chart = charts.party.chart;
    var dimension = ndx.dimension(function (d) {
      if(d.party.length < 1) {
        return "Ni podatka";
      }
      return d.party;
    });
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    //Filter entries with 0 and show extra committees if no filters are applied
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          var entriesToAdd = ["Interesna skupina delodajalcev","Interesna skupina delojemalcev","Interesna skupina kmetov, obrtnikov in samostojnih poklicev","Interesna skupina negospodarskih dejavnosti","Interesna skupina lokalnih interesov"];
          var data = source_group.all().filter(function(d) {
            return true;
          });
          if(vuedata.instFilter == 'inst1') {
            data = source_group.all().filter(function(d) {
              return (d.value != 0);
            });
            _.each(entriesToAdd, function (entry) {
              var hasEntry = _.find(data, function (x) { return x.key == entry });
              if(!hasEntry) {
                data.push({key: entry, value: 0});
              }
            });
          }
          return data;
        }
      };
    })(group);
    var width = recalcWidth(charts.party.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(415)
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
  }

  //CHART 2
  var createOfficialTypeChart = function() {
    var chart = charts.officialType.chart;
    var dimension = ndx.dimension(function (d) {
      return d.function; 
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.officialType.divId);
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
        return vuedata.colors.function[d.key];
      })
      .group(group);

    chart.render();
  }

  //CHART 3
  var createTopLobbyistsChart = function() {
    function getLobbyistType(org) {
      var c = _.find(contacts, function (x) { return x.org_name == org });
      if(c) {
        return c.lobbyist_type;
      }
      return ""; 
    }
    var chart = charts.topLobbyists.chart;
    var dimension = ndx.dimension(function (d) {
      return d.org_name;
    });
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(10).filter(function(d) {
            return (d.value != 0);
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.topLobbyists.divId);
    var charsLength = recalcCharsLength(width);
    
    chart
      .width(width)
      .height(510)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        var type = getLobbyistType(d.key);
        return vuedata.colors.lobbyistType[type];
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

  //CHART 4
  var createLobbyistCategoryChart = function() {
    var chart = charts.lobbyistCategory.chart;
    var dimension = ndx.dimension(function (d) {
      return d.lobbyist_type; 
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.lobbyistCategory.divId);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .cap(5)
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
        return vuedata.colors.lobbyistType[d.key];
      })
      .group(group);

    chart.render();
  }

  //CHART 5
  var createPurposeTypeChart = function() {
    var chart = charts.purposeType.chart;
    var dimension = ndx.dimension(function (d) {
      return d.purposeStreamlined; 
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.purposeType.divId);
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
        return vuedata.colors.purpose[d.key];
      })
      .group(group);

    chart.render();
  }

  //CHART 6
  var createContactTypeChart = function() {
    var chart = charts.contactType.chart;
    var dimension = ndx.dimension(function (d) {
      return d.contact_type; 
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.contactType.divId);
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
        return vuedata.colors.contactType[d.key];
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
          "orderable": true,
          "targets": 0,
          "defaultContent":"N/A",
          "data": function(d) {
            //id,function,party,institution,date,contact_type,org_name,lobbyist_type,purpose,purpose_details
            return d.id;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 1,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.function;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 2,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.party;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 3,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.institution;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 4,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.date;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 5,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.contact_type;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 6,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.org_name;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 7,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.lobbyist_type;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 8,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.purpose;
          }
        }
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
        /*
        datatable.DataTable().column(0, { page: 'current' }).nodes().each( function (cell, i) {
            cell.innerHTML = i + 1 + PageInfo.start;
        });
        */
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

  //Institution filters
  $('.institution-filter-btn').click(function(){
    var filter = 'all';
    if($(this).hasClass('inst1')){
      filter = 'Državni Svet Republike Slovenije';
      vuedata.instFilter = 'inst1';
    } else if($(this).hasClass('inst2')){
      filter = 'Državni Zbor Republike Slovenije';
      vuedata.instFilter = 'inst2';
    } else {
      vuedata.instFilter = 'all';
    }
    searchDimension.filter(function(d) { 
      if(filter == 'all') {
        return true;
      } else {
        return d.indexOf(filter.toLowerCase()) !== -1;
      }
    });
    dc.redrawAll();
  });

  //Reset charts
  var resetGraphs = function() {
    for (var c in charts) {
      if(charts[c].type !== 'table' && charts[c].chart.hasFilter()){
        charts[c].chart.filterAll();
      }
    }
    searchDimension.filter(null);
    $('#search-input').val('');
    $('.institution-filter-btn.inst2').click();
    dc.redrawAll();
  }
  $('.reset-btn').click(function(){
    resetGraphs();
  })
  
  //Render charts
  createTopLobbyistsChart();
  createLobbyistCategoryChart();
  createPartyChart();
  createOfficialTypeChart();
  createPurposeTypeChart();
  createContactTypeChart();
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

  //Institutions counter
  function drawInstitutionsCounter() {
    var dim = ndx.dimension (function(d) {
      if (!d.institution) {
        return "";
      } else {
        return d.institution;
      }
    });
    var group = dim.group().reduce(
      function(p,d) {  
        p.nb +=1;
        if (!d.institution) {
          return p;
        }
        return p;
      },
      function(p,d) {  
        p.nb -=1;
        if (!d.Id) {
          return p;
        }
        return p;
      },
      function(p,d) {  
        return {nb: 0}; 
      }
    );
    group.order(function(p){ return p.nb });
    var counter = dc.dataCount(".count-box-institutions")
    .dimension(group)
    .group({value: function() {
      return group.all().filter(function(kv) {
        if (kv.value.nb >0) {
        }
        return kv.value.nb > 0; 
      }).length;
    }})
    .renderlet(function (chart) {
    });
    counter.render();
  }

  //Lobbyists counter
  function drawLobbyistsCounter() {
    var dim = ndx.dimension (function(d) {
      if (!d.org_name) {
        return "";
      } else {
        return d.org_name;
      }
    });
    var group = dim.group().reduce(
      function(p,d) {  
        p.nb +=1;
        if (!d.org_name) {
          return p;
        }
        return p;
      },
      function(p,d) {  
        p.nb -=1;
        if (!d.Id) {
          return p;
        }
        return p;
      },
      function(p,d) {  
        return {nb: 0}; 
      }
    );
    group.order(function(p){ return p.nb });
    var counter = dc.dataCount(".count-box-lobbyists")
    .dimension(group)
    .group({value: function() {
      return group.all().filter(function(kv) {
        if (kv.value.nb >0) {
        }
        return kv.value.nb > 0; 
      }).length;
    }})
    .renderlet(function (chart) {
    });
    counter.render();
  }
  drawInstitutionsCounter();
  drawLobbyistsCounter();
  $('.institution-filter-btn.inst2').click();

  //Window resize function
  window.onresize = function(event) {
    resizeGraphs();
  };
})
