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
  page: 'tabA',
  loader: true,
  readMore: false,
  showInfo: true,
  showShare: true,
  showAllCharts: true,
  chartMargin: 40,
  selectedMandate: 'all',
  charts: {
    mandateSelector: {
      title: 'Izberite mandat',
      info: 'Izberite obdobje pregledovanja poročanih lobističnih stikov po mandatih vlad. Z možnostjo "Vse" pregledujete vse poročane lobistične stike izbranih vladnih institucij od 13. 9. 2018 naprej'
    },
    institutionType: {
      title: 'Lobistični stiki vlade',
      info: 'Lobiranec mora o vsakem stiku z lobistom, ki ima namen lobirati, sestaviti zapis in ga v roku treh dni posredovati v vednost svojemu predstojniku in Komisiji za preprečevanje korupcije. Diagram odraža porazdelitev števila poročanih stikov glede na vrsto institucije (ministrstva, Kabinet predsednika vlade, Generalni sekretariat vlade).'
    },
    topLobbyists: {
      title: 'Lobisti – Top 10',
      info: ''
    },
    lobbyistCategory: {
      title: 'Status lobista',
      info: 'Diagram prikazuje porazdelitev poročanih lobističnih stikov vlade z lobisti glede na njihov status.'
    },
    institutionTypeRow: {
      title: 'Lobistični stiki vlade po resorjih',
      info: 'Prikaz razdelitve poročanih lobističnih stikov po področjih oziroma vladnih institucijah. Vključeni so ministrstva brez organov v sestavi, kabinet predsednika vlade in generalni sekretariat vlade.'
    },
    officialType: {
      title: 'Funkcija/položaj lobiranca',
      info: 'Organizacije, ki so z vlado opravile največ poročanih lobističnih stikov.   Razporeditev se spreminja glede na vsakokratno izbiro filtrov.'
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
  executiveCategories: {
    "generalni sekretariat vlade republike slovenije": "Generalni sekretariat vlade",
    "kabinet predsednika vlade republike slovenije": "Kabinet predsednika vlade",
    "služba vlade republike slovenije za razvoj in evropsko kohezijsko politiko": "Generalni sekretariat vlade"
  },
  lobbyistTypeCategories: {
    "Lobist je izvoljeni predstavnik interesne organizacije za katero lobira": "Izvoljeni predstavnik interesne organizacije",
    "Lobist je vpisan v register lobistov v RS": "Vpisan v register lobistov",
    "Lobist je zakoniti zastopnik interesne organizacije za katero lobira": "Zakoniti zastopnik interesne organizacije",
    "Lobist lobira za interesno organizacijo v kateri je zaposlen": "Zaposlen v interesni organizaciji",
  },
  purposeCategory: {
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
    institutionsTypes: {
      "Ministrstva": "#0d506b",
      "Kabinet predsednika vlade": "#1d7598",
      "Generalni sekretariat vlade": "#2b90b8",
      "": "#ccc"
    },
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
      window.open('./data/tab_a/executive.csv');
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
  institutionType: {
    chart: dc.pieChart("#institutiontype_chart"),
    type: 'pie',
    divId: 'institutiontype_chart'
  },
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
  institutionTypeRow: {
    chart: dc.rowChart("#institutiontyperow_chart"),
    type: 'row',
    divId: 'institutiontyperow_chart'
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
var dmy = d3.timeParse("%d-%m-%Y");
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
  "date-eu-pre": function (date) {
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
//var lobbyist_typeList = {}
csv('./data/tab_a/executive.csv?' + randomPar, (err, contacts) => {
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
    d.institution_lowerCase = d.institution_lowerCase.replace("vlade Republike Slovenije", "Vlade Republike Slovenije");
    //Streamline purpose
    d.purposeStreamlined = vuedata.purposeCategory[d.purpose.toLowerCase()];
    if(!d.purposeStreamlined) {
      console.log(d.purpose);
    }
    //Streamline executive category
    d.instituionStreamlined = "";
    if(d.institution.toLowerCase().indexOf("ministrstvo za") > -1) {
      d.instituionStreamlined = "Ministrstva";
    } else {
      d.instituionStreamlined = vuedata.executiveCategories[d.institution.toLowerCase()];
    }
    if(!d.instituionStreamlined) {
      console.log(d);
    }
    
    //Change date format and get int version for filtering

    d.dateToInt = null;
    if(d.date) {
      /*
      var splitdate = d.date.split('.');
      d.dateToInt = splitdate[2] + splitdate[1] + splitdate[0];
      */
      var splitdate = d.date.split('-');
      d.dateToInt = splitdate[0] + splitdate[1] + splitdate[2];
      d.dateToInt = parseInt(d.dateToInt);
      d.date = splitdate[2] + '-' + splitdate[1] + '-' + splitdate[0];
    } else {
      console.log(d);
    }
  });

  //Set dc main vars. The second crossfilter is used to handle the travels stacked bar chart.
  var ndx = crossfilter(contacts);
  var searchDimension = ndx.dimension(function (d) {
      var entryString = d.function + ' ' + d.party + ' ' + d.institution + ' ' + d.contact_type + ' ' + d.org_name + ' ' + d.lobbyist_type + ' ' + d.purpose + ' ' + d.purpose_details;
      return entryString.toLowerCase();
  });
  var dateDimension = ndx.dimension(function (d) {
    return d.dateToInt;
  });

  //CHART 1
  var createInstitutionTypeChart = function() {
    var chart = charts.institutionType.chart;
    var dimension = ndx.dimension(function (d) {
      return d.instituionStreamlined; 
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.institutionType.divId);
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
        return vuedata.colors.institutionsTypes[d.key];
      })
      .group(group);

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
      .height(500)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        var type = getLobbyistType(d.key);
        console.log(type);
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
      //return d.lobbyist_type_list; 
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
  var createInstitutionTypeRowChart = function() {
    var chart = charts.institutionTypeRow.chart;
    var dimension = ndx.dimension(function (d) {
      return d.institution_lowerCase;
    });
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var width = recalcWidth(charts.institutionTypeRow.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(500)
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

  //CHART 6
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

  //CHART 7
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
            return d.institution;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 3,
          "defaultContent":"N/A",
          "type": "date-eu",
          "data": function(d) {
            return d.date;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 4,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.contact_type;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 5,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.org_name;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 6,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.lobbyist_type;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 7,
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
      "order": [[ 0, "desc" ]],
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

  //Reset charts
  var resetGraphs = function() {
    for (var c in charts) {
      if(charts[c].type !== 'table' && charts[c].chart.hasFilter()){
        charts[c].chart.filterAll();
      }
    }
    searchDimension.filter(null);
    dateDimension.filter(null);
    vuedata.selectedMandate = 'all';
    $('#search-input').val('');
    dc.redrawAll();
  }
  $('.reset-btn').click(function(){
    resetGraphs();
  })

  //Mandate selector
  $( "#mandateSelector" ).change(function() {
    dateDimension.filter(function(d) { 
      if(vuedata.selectedMandate == 'all') {
        return true;
      } else if(vuedata.selectedMandate == 'm14') {
        return d >= 20200313;
      } else if(vuedata.selectedMandate == 'm13') {
        return d >= 20180913 && d < 20200313;
      }
    });
    dc.redrawAll();
  });
  
  //Render charts
  createInstitutionTypeChart();
  createTopLobbyistsChart();
  createLobbyistCategoryChart();
  createInstitutionTypeRowChart();
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

  //Window resize function
  window.onresize = function(event) {
    resizeGraphs();
  };
  
  //Show disclaimer modal
  $('#disclaimerModal').modal();
})
