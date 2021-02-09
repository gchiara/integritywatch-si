<nav class="navbar navbar-expand-lg navbar-light bg-light" id="iw-nav">
  <a class="navbar-brand" href="https://www.transparency.si/" target="_blank"><img src="./images/ti_si_logo.png" alt="" /> </a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <a href="./" class="nav-link" :class="{active: page == 'tabA'}">Lobiranje vlade</a>
      </li>
      <li class="nav-item">
        <a href="./parlamenta.php" class="nav-link" :class="{active: page == 'tabB'}">Lobiranje parlamenta</a>
      </li>
      <li class="nav-item">
        <a href="./limitations.php" class="nav-link" :class="{active: page == 'tabC'}">Omejitve poslovanja</a>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Druge različice
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
			<a class="dropdown-item" href="https://www.integritywatch.eu/" target="_blank">Evropska unija</a>
			<a class="dropdown-item" href="https://www.integritywatch.fr/" target="_blank">Francija</a>
			<a class="dropdown-item" href="https://www.integritywatch.gr/" target="_blank">Grčija</a>
			<a class="dropdown-item" href="http://www.soldiepolitica.it/" target="_blank">Italija</a>
			<a class="dropdown-item" href="https://deputatiuzdelnas.lv/" target="_blank">Latvija</a>
			<a class="dropdown-item" href="https://manoseimas.lt/" target="_blank">Litva</a>
			<a class="dropdown-item" href="https://www.integritywatch.nl/" target="_blank">Nizozemska</a>
			<a class="dropdown-item" href="https://integritywatch.es/" target="_blank">Španija</a>
			<a class="dropdown-item" href="https://openaccess.transparency.org.uk/" target="_blank">Velika Britanija</a>
			<a class="dropdown-item" href="https://integritywatch.cl/" target="_blank">Čile</a>
        </div>
      </li>
    </ul>
    <ul class="navbar-nav ml-auto">
      <li class="nav-item">
        <a href="./about.php" class="nav-link">O Varuhu integritete</a>
      </li>
      <li class="nav-item">
        <i class="material-icons nav-link icon-btn info-btn" @click="showInfo = !showInfo">info</i>
      </li>
    </ul>
  </div>
</nav>