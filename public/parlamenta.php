<html lang="en">
<head>
    <?php include 'gtag.php' ?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Varuh integritete – Lobistični stiki parlamenta</title>
    <!-- Add twitter and og meta here -->
    <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
    <link rel="stylesheet" href="static/tab_b.css">
    <meta property="og:title" content="Varuh integritete – Lobistični stiki parlamenta" />
    <meta property="og:description" content="To je uporabnikom prijazna interaktivna zbirka podatkov, ki vam omogoča edinstven pregled poročanih lobističnih stikov Vlade Republike Slovenije." />
</head>
<body>
    <div id="app" class="tabB">   
      <?php include 'header.php' ?>
      <div class="container-fluid dashboard-container-outer">
        <div class="row dashboard-container">
          <!-- ROW FOR INFO AND SHARE -->
          <div class="col-md-12">
            <div class="row">
              <!-- INFO -->
              <div class="col-md-8 chart-col" v-if="showInfo">
                <div class="boxed-container description-container">
                  <h1>Varuh integritete – Lobistični stiki parlamenta</h1>
                  <p>To je uporabnikom prijazna interaktivna zbirka podatkov, ki vam omogoča edinstven pregled lobističnih stikov opravljenih  v Državnem zboru in Državnem svetu Republike Slovenije. <a href="#" @click="readMore = true">Preberi več</a>.</p>
                  <p v-show="readMore">
                    Upoštevani so poročani lobistični stiki funkcionarjev in javnih uslužbencev Državnega zbora in Državnega sveta Republike Slovenije z lobisti.<br /><br />
                    S preprostim klikom na pasice, grafe ali sezname spodaj lahko uporabniki razvrščajo in filtrirajo podatke o lobističnih stikih obeh domov parlamenta.  
                  </p>  
                  <i class="material-icons close-btn" @click="showInfo = false">close</i>
                </div>
              </div>
            </div>
          </div>
          <!-- CHARTS - FIRST ROW - LEFT -->
          <div class="col-md-6 chart-subrow">
            <div class="row chart-subrow-row">
              <div class="col-md-12 subrow-title-container">
                <div class="subrow-title">PARLAMENT</div>
              </div>
              <div class="col-md-12 chart-col">
                <div class="boxed-container institution-filter-container">
                  <button class="institution-filter-btn inst2" :class="{ active: instFilter == 'inst2' }">Državni zbor Republike Slovenije</button>
                  <button class="institution-filter-btn inst1" :class="{ active: instFilter == 'inst1' }">Državni svet Republike Slovenije</button>
                </div>
              </div>
              <div class="col-md-12 chart-col">
                <div class="boxed-container chart-container tab_b_1">
                  <chart-header :title="charts.party.title" :info="charts.party.info" ></chart-header>
                  <div class="chart-inner" id="party_chart"></div>
                </div>
              </div>
              <div class="col-md-6 chart-col">
                <div class="boxed-container chart-container tab_b_2">
                  <chart-header :title="charts.officialType.title" :info="charts.officialType.info" ></chart-header>
                  <div class="chart-inner" id="officialtype_chart"></div>
                </div>
              </div>
            </div>
          </div>
          <!-- CHARTS - FIRST ROW - RIGHT -->
          <div class="col-md-6 chart-subrow">
            <div class="row chart-subrow-row">
              <div class="col-md-12 subrow-title-container subrow-title-container-right">
                <div class="subrow-title subrow-title-right">LOBISTI</div>
              </div>
              <div class="col-md-6 chart-col">
                <div class="boxed-container chart-container tab_b_3">
                  <chart-header :title="charts.topLobbyists.title" :info="charts.topLobbyists.info" ></chart-header>
                  <div class="chart-inner" id="toplobbyists_chart"></div>
                </div>
              </div>
              <div class="col-md-6 chart-col">
                <div class="boxed-container chart-container tab_b_4">
                  <chart-header :title="charts.lobbyistCategory.title" :info="charts.lobbyistCategory.info" ></chart-header>
                  <div class="chart-inner" id="lobbyistcategory_chart"></div>
                </div>
              </div>
              <div class="col-md-6 chart-col">
                <div class="boxed-container chart-container tab_b_5">
                  <chart-header :title="charts.purposeType.title" :info="charts.purposeType.info" ></chart-header>
                  <div class="chart-inner" id="purposetype_chart"></div>
                </div>
              </div>
              <div class="col-md-6 chart-col">
                <div class="boxed-container chart-container tab_b_6">
                  <chart-header :title="charts.contactType.title" :info="charts.contactType.info" ></chart-header>
                  <div class="chart-inner" id="contacttype_chart"></div>
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
                      <th class="header">Št. stika</th>
                      <th class="header">Funkcija/položaj lobiranca</th>
                      <th class="header">Poslanska/interesna skupina</th>
                      <th class="header">Institucija</th>
                      <th class="header">Datum</th>
                      <th class="header">Način lobiranja</th>
                      <th class="header">Organizacija</th> 
                      <th class="header">Status lobista</th>
                      <th class="header">Namen in cilj lobiranja</th> 
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
                <div>{{ selectedElement.date }}</div>
              </div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <div class="col-md-6 details-left">
                    <div class="details-title details-title-left">JAVNA INSTITUCIJA</div>
                    <div class="details-line"><span class="details-line-title">Institucija:</span> {{ selectedElement.institution }}</div>
                    <div class="details-line"><span class="details-line-title">Poslanska/interesna skupina:</span> {{ selectedElement.party }}</div>
                    <div class="details-line"><span class="details-line-title">Funkcija/položaj lobiranca:</span> {{ selectedElement.function }}</div>
                    <div class="details-line"><span class="details-line-title">Skupno število poročanih lobističnih stikov:</span> {{ institutionEntries[selectedElement.institution] }}</div>
                  </div>
                  <div class="col-md-6 details-right">
                    <div class="details-title details-title-right">LOBIST</div>
                    <div class="details-line"><span class="details-line-title">Organizacija:</span> {{ selectedElement.org_name }}</div>
                    <div class="details-line"><span class="details-line-title">Status lobista:</span> {{ selectedElement.lobbyist_type }}</div>
                    <div class="details-line"><span class="details-line-title">Namen in cilj lobiranja:</span> {{ selectedElement.purpose }}</div>
                    <div class="details-line"><span class="details-line-title">Skupno število poročanih lobističnih stikov:</span> {{ orgEntries[selectedElement.org_name] }}</div>
                    <div class="details-line" v-if="selectedElement.purpose && selectedElement.purpose.length > 0"><span class="details-line-title">Podrobnejši podatki o namenu in cilju lobiranja:</span> {{ selectedElement.purpose_details }} </div>
                    <div class="details-line" v-else><span class="details-line-title">Podrobnejši podatki o namenu in cilju lobiranja:</span> Dodatne informacije niso na voljo</div>
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
              <div class="filter-count">0</div>od <strong class="total-count">0</strong> stikov
            </div>
            <div class="count-box count-box-institutions">
              <div class="filter-count nbinstitutions">0</div>od <strong class="total-count">0</strong> institucij
            </div>
            <div class="count-box count-box-lobbyists">
              <div class="filter-count nblobbyists">0</div>od <strong class="total-count">0</strong> lobistov
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
      <loader v-if="loader" :text="'To je uporabnikom prijazna interaktivna zbirka podatkov, ki vam omogoča edinstven pregled poročanih lobističnih stikov Državnega zbora in Državnega sveta Republike Slovenije.'" />
    </div>

    <script type="text/javascript" src="vendor/js/d3.v5.min.js"></script>
    <script type="text/javascript" src="vendor/js/d3.layout.cloud.js"></script>
    <script type="text/javascript" src="vendor/js/crossfilter.min.js"></script>
    <script type="text/javascript" src="vendor/js/dc.js"></script>
    <script type="text/javascript" src="vendor/js/dc.cloud.js"></script>
    <script src="static/tab_b.js"></script>

 
</body>
</html>