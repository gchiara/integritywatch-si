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
  selectedMandate: 'all',
  charts: {
    mandateSelector: {
      title: 'Izberite mandat',
      info: ''
    },
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
    cloud: {
      title: ' ',
      info: 'Besedni oblak prikazuje besede, uporabljene v podrobnih opisih namena in cilja lobiranja. S klikom na posamezne besede se vam prikažejo stiki, pri katerih je beseda vsebovana v podrobnem opisu stika.'
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
  partiesStreamlining: {
    "PS SD": "SD",
    "PS SVOBODA": "SVOBODA",
    "SVOBODA": "SVOBODA",
    "NSI": "NSi",
    "PS NSI": "NSi",
    "PS IMNS": "IMNS",
    "SD": "SD",
    "SDS": "SDS",
    "IMNS": "IMNS",
    "PS SDS": "SDS",
    "NSi": "NSi",
    "LEVICA": "LEVICA",
    "LMS": "LMŠ",
    "SAB": "SAB",
    "OMS": "OMS",
    "Levica": "LEVICA",
    "NEP": "NEP",
    "DESUS": "DeSUS",
    "SMC": "SMC",
    "LMŠ": "LMŠ",
    "Predlog zakona o nacionalnem demografskem skladu": "IMNS",
    "SNS": "SNS",
    "SLS": "SNS",
    "PS SMC": "SMC",
    "PS LMŠ": "LMŠ",
    "PS MSC": "MSC",
    "PS SNS": "SNS",
    "PS SAB": "SAB",
    "DZ RS": "RS",
    "LNŠ": "LNŠ",
    "DeSUS": "DeSUS",
    "Predstavnik madžarske narodne skupnosti": "IMNS",
    "Predstavnik italijanske narodne skupnosti": "IMNS",
    "javna uslužbenka PS IMNS": "IMNS",
    "NP": "NP",
    "javna uslužbenka PS IMN": "IMNS",
    "predstavnik madžarske narodne skupnosti": "IMNS",
    "predstavnik italijanske narodne skupnosti": "IMNS",
    "javna uslužbenka IMNS": "IMNS",
    "javni uslužbenec PS IMNS": "IMNS",
    "PS DeSUS": "DeSUS",
    "desus": "DeSUS",
    "levica": "LEVICA",
    "nsi": "NSi",
    "sd": "SD",
    "NEPOVEZANI POSLANEC": "Nepovezani poslanec",
    "Združena levica": "LEVICA",
    "Nepovezani poslanec": "Nepovezani poslanec",
    "nepovezani poslanec": "Nepovezani poslanec"
  },
  colors: {
    generic: ["#3b95d0", "#4081ae", "#406a95", "#395a75" ],
    genericGreen: ["#449188", "#449188", "#41ab9f", "#39c0b0", "#30cfbd"],
    default1: "#2b90b8",
    function: {
      "Javni uslužbenec": "#0d506b",
      "Funkcionar": "#1d7598"
    },
    default2: "#449188",
    lobbyistType: {
      "Izvoljeni predstavnik": "#449188",
      "Voljeni predstavnik": "#449188",
      "Registrirani lobist": "#41ab9f",
      "Zakoniti zastopnik": "#39c0b0",
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
        var shareText = 'Kdo lobira v parlamentu? Katere poslanske skupine so poročale o največ lobističnih stikih? Odkrijte na spletni strani @TransparencySi #VaruhIntegritete ' + thisPage;
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
csv('./data/tab_b/parliament.csv?' + randomPar, (err, contacts) => {
  //Loop through data to aply fixes and calculations
   var cutOffDate = 20180622;
   var parties = [];
   //Filter out "Državni svet Republike Slovenije" data entries that had the SD or SMC party names
   contacts = _.filter(contacts, function (x) { 
    if(x.institution == "DRŽAVNI SVET REPUBLIKE SLOVENIJE" && (x.party == "SD" || x.party == "SMC")) {
      console.log(x);
      return false;
    }
    return true;
  });
  _.each(contacts, function (d) {
    //Tidy party name
    d.party = d.party.trim();
    if(vuedata.partiesStreamlining[d.party]) {
      d.party = vuedata.partiesStreamlining[d.party]
    }
    if(d.party == "smc" || d.party == "sds" || d.party == "lmš" || d.party == "Svoboda") {
      d.party = d.party.toUpperCase();
    }
    if(d.party == "PS LEVICA") {
      d.party = "LEVICA";
    }
    if(parties.indexOf(d.party) == -1) {
      parties.push(d.party);
    }
    //Change caps of contact_type and institution
    d.contact_type = d.contact_type.toLowerCase();
    d.contact_type = d.contact_type.charAt(0).toUpperCase() + d.contact_type.slice(1);
    d.institution_lowerCase = d.institution.toLowerCase();
    d.institution_lowerCase = d.institution_lowerCase.charAt(0).toUpperCase() + d.institution_lowerCase.slice(1);
    d.institution_lowerCase = d.institution_lowerCase.replace("republike slovenije", "Republike Slovenije");
    //Streamline Purpose
    d.purposeStreamlined = vuedata.purposeCategories[d.purpose.toLowerCase()];
    //Date format
    if(d.date) {
      var splitdate = d.date.split('-');
      d.dateToInt = splitdate[0] + splitdate[1] + splitdate[2];
      d.dateToInt = parseInt(d.dateToInt);
      d.date = splitdate[2] + '-' + splitdate[1] + '-' + splitdate[0];
    }
    if(d.dateToInt >= cutOffDate) {
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
    }
  });
  //console.log(parties);
  //Filter data with cutoff date 22.6.2018
  contacts = _.filter(contacts, function(d, index) {
    return d.dateToInt >= cutOffDate;
  });

  //Set dc main vars. The second crossfilter is used to handle the travels stacked bar chart.
  var ndx = crossfilter(contacts);
  var searchDimension = ndx.dimension(function (d) {
      //var entryString = ' ' + d.institution.toLowerCase();
      var entryString = d.id + ' ' + d.function + ' ' + d.party + ' ' + d.institution + ' ' + d.contact_type + ' ' + d.org_name + ' ' + d.lobbyist_type + ' ' + d.purpose + ' ' + d.purpose_details;
      return entryString.toLowerCase();
  });
  var institutionDimension = ndx.dimension(function (d) {
    var institution = d.institution.toLowerCase();
    return institution.toLowerCase();
  });
  var dateDimension = ndx.dimension(function (d) {
    return d.dateToInt;
  });

  //CHART 1
  var createPartyChart = function() {
    var chart = charts.party.chart;
    var dimension = ndx.dimension(function (d) {
      if(d.party.trim().length < 1 || !d.party) {
        return "Ni podatka";
      }
      /*
      if(d.party.includes("Predstavnik")) {
        return "Predstavnik";
      }
      */
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
          var m8Parties = ["SDS", "NSi", "SMC", "SNS", "DeSUS", "IMNS", "NP", "SAB", "LMŠ", "SD", "LEVICA","NEP","Ni podatka"];
          var m9Parties = ["SVOBODA", "SDS", "NSi", "IMNS", "SD", "LEVICA", "Ni podatka"];
          var allPartiesToRemove = ["RS", "LNŠ", "MSC", "OMS"];
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
          } else {
            if(vuedata.selectedMandate == 'zbor-m8') {
              data = source_group.all().filter(function(d) {
                return (d.value != 0 && m8Parties.indexOf(d.key) > -1);
              });
            } else if(vuedata.selectedMandate == 'zbor-m9') {
              data = source_group.all().filter(function(d) {
                return (d.value != 0 && m9Parties.indexOf(d.key) > -1);
              });
            } else {
              data = source_group.all().filter(function(d) {
                return (d.value != 0 && allPartiesToRemove.indexOf(d.key) == -1);
              });
            }
          }
          return data;
        }
      };
    })(group);
    var width = recalcWidth(charts.party.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(380)
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
      .height(590)
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

  //CHART 7
  var createWordCloud = function() {
    var chart = charts.cloud.chart;
    var dimension = ndx.dimension(function(d) {
      return d.purpose_details || "";
    })
    var group = dimension.group().reduceSum(function(d) { return 1; });
    chart
    .dimension(dimension)
    .group(group)
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .maxWords(50)
    .timeInterval(10)
    .duration(200)
    .ordinalColors(vuedata.colors.genericGreen)
    .size([recalcWidth(charts.cloud.divId),350])
    .font("Impact")
    .scale(d3.scaleLinear().domain([10,700]).range([8, 23]))
    .stopWords(/^(V|a|zvezi|med|kateri|ali|and|april|avgust|b|bi|bil|bila|bile|bili|bilo|biti|blizu|bo|bodo|bojo|bolj|bom|bomo|boš|boste|bova|brez|c|č|če|cel|cela|celi|celo|često|četrta|četrtek|četrti|četrto|čez|čigav|člen|člena|d|da|daleč|dan|danes|datum|december|deset|deseta|deseti|deseto|devet|deveta|deveti|deveto|do|dober|dobra|dobri|dobro|dokler|dol|dolg|dolga|dolgi|dolgotrajni|dopolnitev|dopolnitvah|dopolnitve|dovolj|drug|druga|drugi|drugo|dva|dve|e|eden|en|ena|ene|eni|enkrat|eno|etc.|f|februar|g|g.|ga|ga.|glede|gor|gospa|gospod|h|halo|i|idr.|ii|iii|in|iv|ix|iz|j|januar|jaz|je|ji|jih|jim|jo|julij|junij|jutri|k|kadarkoli|kaj|kajti|kako|kakor|kamor|kamorkoli|kar|karkoli|katerikoli|kdaj|kdo|kdorkoli|ker|ki|kje|kjer|kjerkoli|ko|koder|koderkoli|koga|komu|kot|kratek|kratka|kratke|kratki|l|lahka|lahke|lahki|lahko|le|lep|lepa|lepe|lepi|lepo|let|leto|ljubljana|m|maj|majhen|majhna|majhni|malce|malo|manj|marec|me|med|medtem|mene|mesec|mi|midva|midve|mnogo|moj|moja|moje|mora|morajo|moram|moramo|moraš|morate|morem|motiv|motivi|motivom|mu|n|na|nad|naj|najina|najino|najmanj|naju|največ|nam|narobe|nas|naš|naša|naše|nato|nazaj|ne|nedavno|nedelja|nek|neka|nekaj|nekatere|nekateri|nekatero|nekdo|neke|nekega|neki|nekje|neko|nekoč|nekoga|ni|nič|nikamor|nikdar|nikjer|nikoli|nje|njega|njegov|njegova|njegovo|njej|njemu|njen|njena|njeno|nji|njih|njihov|njihova|njihovo|njiju|njim|njo|njun|njuna|njuno|no|nocoj|novele|november|novo|npr.|o|ob|oba|obe|oboje|od|odprt|odprta|odprti|of|okoli|oktober|on|onadva|one|oni|onidve|osem|osma|osmi|osmo|oz.|p|pa|pet|peta|petek|peti|peto|po|pod|pogosto|poleg|poln|polna|polni|polno|ponavadi|ponedeljek|ponovno|potem|povsod|pozdravljen|pozdravljeni|prav|prava|prave|pravi|pravo|prazen|prazna|prazno|prbl.|precej|pred|predlog|predloga|predlogom|predstavitev|prej|preko|pri|pribl.|približno|primer|pripravljen|pripravljena|pripravljeni|problematike|proti|prva|prvi|prvo|r|ravno|reč|redko|res|s|š|saj|sam|sama|same|sami|samo|se|sebe|sebi|sedaj|sedem|sedma|sedmi|sedmo|sem|september|šest|šesta|šesti|šesto|seveda|si|sicer|skoraj|skozi|slab|Slovenije|smo|so|sobota|spet|sprememb|spremembo|sreda|srednja|srednji|sta|ste|štiri|stran|stvar|sva|t|ta|tak|taka|take|taki|tako|takoj|tam|te|tebe|tebi|tega|ter|težak|težka|težki|težko|ti|tista|tiste|tisti|tisto|tj.|tja|to|toda|torek|tretja|tretje|tretji|tri|tu|tudi|tukaj|tvoj|tvoja|tvoje|u|ukrep|ukrepi|ukrepih|v|vaju|vam|vas|vaš|vaša|vaše|včasih|včeraj|ve|več|vedno|velik|velika|veliki|veliko|vendar|ves|vi|vidva|vii|viii|visok|visoka|visoke|visoki|vsa|vsaj|vsak|vsaka|vsakdo|vsake|vsaki|vsakomur|vse|vsega|vsi|vso|X|x|z|ž|za|zadaj|zadnji|zakaj|zakon|zakoni|zakonih|zakonu|zaprta|zaprti|zaprto|zdaj|že|zelo|zunaj)$/)
    .onClick(function(d){setword(d.key);})
    .textAccessor(function(d) {return d.purpose_details;});
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
          "type": "date-eu",
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
  }

  //Institution filters
  $('.institution-filter-btn').click(function(){
    resetGraphs();
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
    institutionDimension.filter(function(d) { 
      if(filter == 'all') {
        return true;
      } else {
        return d.indexOf(filter.toLowerCase()) !== -1;
      }
    });
    dc.redrawAll();
  });

  //Mandate selector
  $( "#mandateSelector" ).change(function() {
    dateDimension.filter(function(d) { 
      if(vuedata.selectedMandate == 'all') {
        return true;dateDimension
      } else if(vuedata.selectedMandate == 'zbor-m8') {
        return d >= 20180622 && d < 20220513;
      } else if(vuedata.selectedMandate == 'zbor-m9') {
        return d >= 20220513;
      } else if(vuedata.selectedMandate == 'svet-m6') {
        return d >= 20171212;
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
    institutionDimension.filter(null);
    dateDimension.filter(null);
    vuedata.selectedMandate = 'all';
    $('#search-input').val('');
    dc.redrawAll();
  }
  $('.reset-btn').click(function(){
    resetGraphs();
    $('.institution-filter-btn.inst2').click();
  })
  
  //Render charts
  createTopLobbyistsChart();
  createLobbyistCategoryChart();
  createPartyChart();
  createOfficialTypeChart();
  createPurposeTypeChart();
  createContactTypeChart();
  createWordCloud();
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
