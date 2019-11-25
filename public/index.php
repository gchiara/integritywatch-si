<html lang="en">
<head>
    <?php include 'gtag.php' ?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>IW SI</title>
    <!-- Add twitter and og meta here -->
    <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
    <link rel="stylesheet" href="static/meps.css">
</head>
<body>
    <div id="app" class="tabA">   
      <?php include 'header.php' ?>
      <div class="container-fluid dashboard-container-outer">
        <div class="row dashboard-container">
          <!-- ROW FOR INFO AND SHARE -->
          <div class="col-md-12">
            <div class="row">
              <!-- INFO -->
              <div class="col-md-8 chart-col" v-if="showInfo">
                <div class="boxed-container description-container">
                  <h1>Integrity Watch Slovenia</h1>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nec quam fringilla, mollis lectus in, tincidunt turpis. Mauris nec nunc non urna tempor luctus dignissim eu massa.</p> 
                  <i class="material-icons close-btn" @click="showInfo = false">close</i>
                </div>
              </div>
              <!-- SHARE -->
              <div class="col-md-4 chart-col" v-if="showShare">
                <div class="boxed-container share-container">
                  <button class="twitter-btn" @click="share('twitter')">Share on Twitter</button>
                  <button class="facebook-btn" @click="share('facebook')">Share on Facebook</button>
                  <i class="material-icons close-btn" @click="showShare = false">close</i>
                </div>
              </div>
            </div>
          </div>
          <!-- CHARTS - FIRST ROW - LEFT -->
          <div class="col-md-6 chart-subrow">
            <div class="row chart-subrow-row">
              <div class="col-md-12 subrow-title-container">
                <div class="subrow-title">VLADNA INSTITUCIJA</div>
              </div>
              <div class="col-md-6 chart-col">
                <div class="boxed-container chart-container donazioni_1">
                  <chart-header :title="charts.institutionType.title" :info="charts.institutionType.info" ></chart-header>
                  <div class="chart-inner" id="institutiontype_chart"></div>
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
                      <th class="header">Zap. Št.</th>
                      <th class="header">Funkcija/Položaj Lobiranca</th>
                      <th class="header">Institucija</th>
                      <th class="header">Datum</th>
                      <th class="header">Organizacija</th> 
                      <th class="header">Namen In Cilj Lobiranja</th>
                      <th class="header">Dodatne informa-cije?</th> 
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
                    <div class="details-title details-title-left">JAVNI ORGAN</div>
                    <div class="details-line"><span class="details-line-title">Institucija:</span> {{ selectedElement.institution }}</div>
                    <div class="details-line"><span class="details-line-title">Funkcija/Položaj Lobiranca:</span> {{ selectedElement.function }}</div>
                    <div class="details-line"><span class="details-line-title">Skupno število lobističnih stikov:</span> {{ institutionEntries[selectedElement.institution] }}</div>
                  </div>
                  <div class="col-md-6 details-right">
                    <div class="details-title details-title-right">LOBIST</div>
                    <div class="details-line"><span class="details-line-title">Organizacija:</span> {{ selectedElement.contact_type }}</div>
                    <div class="details-line"><span class="details-line-title">Statusi lobista:</span> {{ selectedElement.org_name }}</div>
                    <div class="details-line"><span class="details-line-title">Namen in cilj lobirankja:</span> {{ selectedElement.lobbyist_type }}</div>
                    <div class="details-line"><span class="details-line-title">Skupno število lobističnih stikov:</span> {{ selectedElement.donation_year }}</div>
                    <div class="details-line" v-if="selectedElement.purpose && selectedElement.purpose.length > 0"><span class="details-line-title">Dodatne informacije o namenu srečanja lobiranja:</span> {{ selectedElement.purpose }} </div>
                    <div class="details-line" v-else><span class="details-line-title">Dodatne informacije o namenu srečanja lobiranja:</span> Dodatne informacije niso na voljo</div>
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
          <div class="footer-col col-8 col-sm-4">
            <div class="footer-input">
              <input type="text" id="search-input" placeholder="Filter per lid of partij">
              <i class="material-icons">search</i>
            </div>
          </div>
          <div class="footer-col col-4 col-sm-8 footer-counts">
            <div class="dc-data-count count-box">
              <div class="filter-count">0</div>od <strong class="total-count">0</strong> stikov
            </div>
            <div class="count-box count-box-institutions">
              <div class="filter-count nbinstitutions">0</div>od <strong class="total-count">0</strong> instituticji
            </div>
            <div class="count-box count-box-lobbyists">
              <div class="filter-count nblobbyists">0</div>od <strong class="total-count">0</strong> lobistu
            </div>
          </div>
        </div>
        <!-- Reset filters -->
        <button class="reset-btn"><i class="material-icons">settings_backup_restore</i><span class="reset-btn-text">Reset filters</span></button>
      </div>
      <!-- Loader -->
      <loader v-if="loader" :text="'Loading ...'" />
    </div>

    <script type="text/javascript" src="vendor/js/d3.v5.min.js"></script>
    <script type="text/javascript" src="vendor/js/d3.layout.cloud.js"></script>
    <script type="text/javascript" src="vendor/js/crossfilter.min.js"></script>
    <script type="text/javascript" src="vendor/js/dc.js"></script>
    <script type="text/javascript" src="vendor/js/dc.cloud.js"></script>
    <script src="static/meps.js"></script>

 
</body>
</html>