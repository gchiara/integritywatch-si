<html lang="en">
<head>
    <?php include 'gtag.php' ?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Varuh integritete – Omejitve poslovanja</title>
    <!-- Add twitter and og meta here -->
    <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
    <link rel="stylesheet" href="static/tab_c.css">
    <meta property="og:title" content="Varuh integritete – Omejitve poslovanja" />
    <meta property="og:description" content="To je uporabnikom prijazna interaktivna zbirka podatkov, ki vam omogoča edinstven pregled poročanih lobističnih stikov Vlade Republike Slovenije." />
</head>
<body>
    <div id="app" class="tabC">   
      <?php include 'header.php' ?>
      <div class="container-fluid dashboard-container-outer">
        <div class="row dashboard-container">
          <!-- ROW FOR INFO AND SHARE -->
          <div class="col-md-12">
            <div class="row">
              <!-- INFO -->
              <div class="col-md-8 chart-col" v-if="showInfo">
                <div class="boxed-container description-container">
                  <h1>Varuh integritete – Omejitve poslovanja</h1>
                  <p>To je uporabnikom prijazna interaktivna zbirka podatkov, ki vam omogoča edinstven pregled omejitev poslovanja parlamenta in vlade. <a href="#" @click="readMore = !readMore">Preberi več</a>.</p>
                  <p v-show="readMore">V zbirko so vključene veljavne in pretekle omejitve poslovanja Državnega zbora, Državnega sveta, Kabineta predsednika vlade, Generalnega sekretariata vlade, vseh ministrstev brez organov v sestavi ter Službe vlade za razvoj in evropsko kohezijsko politiko ter Urada vlade za Slovence v zamejstvu in po svetu. Seznam je informativne narave.</p>
                  <p v-show="readMore">Seznam subjektov, s katerimi veljajo omejitve poslovanja, vsebuje podatke, ki jih Komisija za preprečevanje korupcije prejme od organizacij javnega sektorja. Tem morajo funkcionarji v mesecu dni po nastopu funkcije sporočiti podatke o povezanih subjektih, morebitne spremembe pa v osmih dneh od nastanka. Organi so dolžni prejete podatke sporočiti Komisiji za preprečevanje korupcije v 15 dneh od prejema. Seznam, ki vsebuje le trenutno veljavne omejitve poslovanja, je objavljen <a href="https://registri.kpk-rs.si/registri/omejitve_poslovanja/seznam/" target="_blank">tu</a>.</p>
                  <i class="material-icons close-btn" @click="showInfo = false">close</i>
                </div>
              </div>
            </div>
          </div>
          <!-- CHARTS - FIRST ROW - LEFT -->
          <div class="col-md-6 chart-subrow">
            <div class="row chart-subrow-row">
              <div class="col-md-12 chart-col">
                <div class="boxed-container chart-container tab_c_1">
                  <chart-header :title="charts.institutions.title" :info="charts.institutions.info" ></chart-header>
                  <div class="chart-inner" id="institutions_chart"></div>
                </div>
              </div>
            </div>
          </div>
          <!-- CHARTS - FIRST ROW - RIGHT -->
          <div class="col-md-6 chart-subrow">
            <div class="row chart-subrow-row">
              <div class="col-md-12 chart-col">
                <div class="boxed-container chart-container tab_c_2">
                  <chart-header :title="charts.business.title" :info="charts.business.info" ></chart-header>
                  <div class="chart-inner" id="business_chart"></div>
                </div>
              </div>
              <div class="col-md-12 chart-col">
                <div class="boxed-container chart-container tab_c_3">
                  <chart-header :title="charts.limitations.title" :info="charts.limitations.info" ></chart-header>
                  <div class="chart-inner" id="limitations_chart"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- TABLE -->
          <div class="col-12 chart-col">
            <div class="boxed-container chart-container chart-container-table">
              <chart-header :title="charts.mainTable.title" :info="charts.mainTable.info" ></chart-header>
              <div class="chart-inner chart-table">
                <table class="table table-hover dc-data-table" id="dc-data-table">
                  <thead>
                    <tr class="header">
                      <th class="header">Nr</th> 
                      <th class="header">Organizacija</th>
                      <th class="header">Omejitev do</th>
                      <th class="header">Subjekt</th>
                      <th class="header">Velja od</th>
                      <th class="header">Velja do</th>
                      <th class="header">Št. transakcij v času veljavnosti omejitve poslovanja</th> 
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- DETAILS MODAL -->
      <div class="modal" id="detailsModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
              <div class="modal-title">
                <div>Title</div>
              </div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <div class="col-md-12">
                    {{ selectedElement }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Bottom bar -->
      <div class="container-fluid footer-bar">
        <div class="row">
          <div class="footer-col col-12 col-sm-12 footer-counts">
            <div class="dc-data-count count-box">
              <div class="filter-count">0</div>od <strong class="total-count">0</strong> omejitev
            </div>
            <div class="footer-input">
              <input type="text" id="search-input" placeholder="Iskanje">
              <i class="material-icons">search</i>
            </div>
          </div>
        </div>
        <!-- Reset filters -->
        <button class="reset-btn"><i class="material-icons">settings_backup_restore</i><span class="reset-btn-text">Ponastavite</span></button>
        <div class="footer-buttons-right">
          <button @click="downloadDataset"><i class="material-icons">cloud_download</i></button>
          <button class="btn-twitter" @click="share('twitter')"><img src="./images/twitter.png" /></button>
          <button class="btn-fb" @click="share('facebook')"><img src="./images/facebook.png" /></button>
        </div>
      </div>
      <!-- Loader -->
      <loader v-if="loader" :text="'To je uporabnikom prijazna interaktivna zbirka podatkov, ki vam omogoča edinstven pregled evidence subjektov, s katerimi organ ne sme poslovati zaradi omejitev poslovanja.'" />
    </div>

    <script type="text/javascript" src="vendor/js/d3.v5.min.js"></script>
    <script type="text/javascript" src="vendor/js/d3.layout.cloud.js"></script>
    <script type="text/javascript" src="vendor/js/crossfilter.min.js"></script>
    <script type="text/javascript" src="vendor/js/dc.js"></script>
    <script type="text/javascript" src="vendor/js/dc.cloud.js"></script>
    <script src="static/tab_c.js"></script>

 
</body>
</html>