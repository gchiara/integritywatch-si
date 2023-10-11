<html lang="en">
<head>
    <?php include 'gtag.php' ?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Varuh integritete – Gifts</title>
    <!-- Add twitter and og meta here -->
    <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
    <link rel="stylesheet" href="static/tab_d.css?v=5">
    <meta property="og:title" content="Varuh integritete – Gifts" />
    <meta property="og:description" content="" />
</head>
<body>
    <div id="app" class="tabD">   
      <?php include 'header.php' ?>
      <div class="container-fluid dashboard-container-outer">
        <div class="row dashboard-container">
          <!-- ROW FOR INFO AND SHARE -->
          <div class="col-md-12">
            <div class="row">
              <!-- INFO -->
              <div class="col-md-8 chart-col" v-if="showInfo">
                <div class="boxed-container description-container">
                  <h1>Varuh integritete – darila</h1>
                  <p>To je uporabnikom prijazna interaktivna zbirka podatkov, ki vam omogoča pregled obdarovanja javnih funkcionarjev in organov. <a href="#" @click="readMore = !readMore">Preberi več</a>.</p>
                  <p v-show="readMore">Državni in drugi organi ter organizacije, ki so dolžne voditi sezname daril, kopije teh seznamov za preteklo leto posredujejo komisiji do 31. marca tekočega leta. O prejetih darilih morajo poročati v primeru, da vrednost darila presega 50€.</p>
                  <p v-show="readMore">Na seznamu boste poleg naziva darovalca in obdarovanca našli tudi podatke o priložnosti obdarovanja, tipu darila, načinu izročitve darila, o (ocenjeni) vrednosti darila, o načinu določitve vrednosti, pa tudi o tem, kdo bo darilo obdržal, torej kdo je njegov lastnik.</p>
                  <p v-show="readMore">Nekateri izmed teh podatkov so za večjo preglednost prikazani tudi grafično, s klikom na določene vrednosti v grafičnih prikazih pa lahko dobite še bolj podrobne prikaze zapisov.</p>  
                  <p v-show="readMore">Originalna baza podatkov je dostopna na portalu Erar.<br />Seznam je informativne narave.</p>
                  <i class="material-icons close-btn" @click="showInfo = false">close</i>
                </div>
              </div>
            </div>
          </div>
          <!-- CHARTS -->
          <div class="col-md-8 chart-col">
            <div class="boxed-container chart-container gifts_1">
              <chart-header :title="charts.years.title" :info="charts.years.info" ></chart-header>
              <div class="chart-inner" id="years_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container gifts_2">
              <chart-header :title="charts.valRange.title" :info="charts.valRange.info" ></chart-header>
              <div class="chart-inner" id="valrange_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container gifts_3">
              <chart-header :title="charts.topOrgsNum.title" :info="charts.topOrgsNum.info" ></chart-header>
              <div class="chart-inner" id="toporgsnum_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container gifts_4">
              <chart-header :title="charts.topOrgsVal.title" :info="charts.topOrgsVal.info" ></chart-header>
              <div class="chart-inner" id="toporgsval_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container gifts_5">
              <chart-header :title="charts.topDonors.title" :info="charts.topDonors.info" ></chart-header>
              <div class="chart-inner" id="topdonors_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container gifts_6">
              <chart-header :title="charts.type.title" :info="charts.type.info" ></chart-header>
              <div class="chart-inner" id="type_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container gifts_7">
              <chart-header :title="charts.method.title" :info="charts.method.info" ></chart-header>
              <div class="chart-inner" id="method_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container gifts_8">
              <chart-header :title="charts.occasion.title" :info="charts.occasion.info" ></chart-header>
              <div class="chart-inner" id="occasion_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container gifts_9">
              <chart-header :title="charts.cloud.title" :info="charts.cloud.info" ></chart-header>
              <div class="chart-inner" id="cloud_chart"></div>
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
                      <th class="header">Datum</th>
                      <th class="header gifts_naziv">Naziv</th>
                      <th class="header gifts_prejemnik">Prejemnik</th>
                      <th class="header">Darovalec</th>
                      <th class="header gifts_opis">Opis</th>
                      <th class="header">Vrednost</th> 
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>
          <!-- LAST MODIFIED -->
          <div class="col-12 chart-col">
            <?php
            $filename = './data/tab_d/gifts.csv';
            if (file_exists($filename)) {
              echo "Zadnja posodobitev podatkov: " . date ("d. F Y", filemtime($filename));
            }
            ?>
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
                <div>{{ selectedElement.date }} | {{ selectedElement.org}}</div>
              </div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <div class="col-md-12">
                    <div class="details-line"><span class="details-line-title">Datum:</span> {{ selectedElement.date }}</div>
                    <div class="details-line"><span class="details-line-title">Naziv:</span> {{ selectedElement.org}}</div>
                    <div class="details-line"><span class="details-line-title">Prejemnik:</span> {{ selectedElement.recipient }}</div>
                    <div class="details-line"><span class="details-line-title">Darovalec:</span> {{ selectedElement.donor }}</div>
                    <div class="details-line"><span class="details-line-title">Tip darila:</span> {{ selectedElement.gift_type }}</div>
                    <div class="details-line"><span class="details-line-title">Način izročitve:</span> {{ selectedElement.delivery_method }}</div>
                    <div class="details-line"><span class="details-line-title">Opis:</span> {{ selectedElement.description }}</div>
                    <div class="details-line"><span class="details-line-title">Vrednost:</span> {{ selectedElement.value }}</div>
                    <div class="details-line"><span class="details-line-title">Način določitve vrednosti:</span> {{ selectedElement.value_method }}</div>
                    <div class="details-line"><span class="details-line-title">Priložnost za izročitev:</span> {{ selectedElement.delivery_occasion }}</div>
                    <div class="details-line"><span class="details-line-title">Razlog za izročitev:</span> {{ selectedElement.reason }}</div>
                    <div class="details-line"><span class="details-line-title">Lastnik darila:</span> {{ selectedElement.gift_owner}}</div>
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
              <div class="filter-count">0</div>od <strong class="total-count">0</strong> daril
            </div>
            <div class="count-box count-box-maxavg">
              <div class="filter-count nblobbyists">€ {{ maxGiftValue }}</div>Max vrednost darila
            </div>
            <div class="count-box count-box-maxavg">
              <div class="filter-count nblobbyists">€ {{ parseInt(avgGiftValue) }}</div>Povprečna vrednost
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
    <script src="static/tab_d.js?v=5"></script>

 
</body>
</html>