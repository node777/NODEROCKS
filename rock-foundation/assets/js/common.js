let bitcoinPrice=-1
let fee_res={};
let block_height = -1;

async function startup() {
    if (document.getElementById('countdown')) {
        // Call updateCountdown every second to keep the countdown accurate
        setInterval(updateCountdown, 1000);
    }

    await loadTickers();
    loadTickers("menu_");

    addOnClicks();
    addWalletConnect();

    await bitprint.load();

    checkForSecret();
}

function checkForSecret() {
  // a key map of allowed keys
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    65: 'a',
    66: 'b',
    13: 'enter',
  };

  // the 'official' Konami Code sequence
  var konamiCode = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a', 'enter'];

  // a variable to remember the 'position' the user has reached so far.
  var konamiCodePosition = 0;

  // add keydown event listener
  document.addEventListener('keydown', function(e) {
    // get the value of the key code from the key map
    var key = allowedKeys[e.keyCode];
    // get the value of the required key from the konami code
    var requiredKey = konamiCode[konamiCodePosition];

    // compare the key with the required key
    if (key == requiredKey) {

      // move to the next key in the konami code sequence
      konamiCodePosition++;

      // if the last key is reached, activate cheats
      if (konamiCodePosition == konamiCode.length) {
        secretbounce();
        konamiCodePosition = 0;
      }
    } else {
      konamiCodePosition = 0;
    }
  });
}

function secretbounce() {
  let add = "";
  for (let rockIndex = 0; rockIndex < myRocks.length; rockIndex++) {
    let img = '';
    if (myRocks[rockIndex].id) {
      img = `./rocks/${myRocks[rockIndex].id}.png`;
    } else {
      img = `./rocks/${myRocks[rockIndex]}.png`;
    }
    let color = 
    add += `<div class='bouncyrock' style="position: absolute; 
            top: 20px;
            left: 20px;
            image-rendering: pixelated;
            border: 5px solid;
            border-color: hsl(${Math.floor(Math.random() * 360)},${Math.floor(Math.random() * 30) + 70}%,${Math.floor(Math.random() * 20) + 40}%);
            z-index: 10000;
            width: 100px;
            height: 100px;
            background: url(${img});
            background-size: 100% 100%;" ></div>`;
  }
  document.body.innerHTML = add + document.body.innerHTML;

  var MR = function (X) { return Math.random() * X }, TwL = TweenLite, G = document.querySelectorAll('.bouncyrock');

  function BTweens() {
      var W = window.innerWidth, H = window.innerHeight, C = 40;
      TwL.killDelayedCallsTo(BTweens); 
      TwL.delayedCall(C * 4, BTweens);
      for (var i = G.length; i--;) {
          var c = C, BA = [], GWidth = G[i].offsetWidth, GHeight = G[i].offsetHeight;
          while (c--) { 
              var SO = MR(1); 
              BA.push({ x: MR(W - GWidth), y: MR(H - GHeight)}); 
          };
          if (G[i].T) { 
              G[i].T.kill() 
          }
          G[i].T = TweenMax.to(G[i], C * 4, { bezier: { timeResolution: 0, type: "soft", values: BA }, delay: i * 0.35, ease: Linear.easeNone });
      }
  };
  BTweens();
  window.onresize = function () {
      TwL.killDelayedCallsTo(BTweens); 
      TwL.delayedCall(0.4, BTweens);
  };
}

async function loadTickers(prefix = "") {
    if (bitcoinPrice == -1) {// load BTC
        let res = await fetch("https://mempool.space/api/v1/prices")
        res = await res.json()
        
        bitcoinPrice = res.USD
        document.getElementById(prefix + "btc_price").innerHTML=bitcoinPrice
    
        fee_res = await fetch("https://mempool.space/api/v1/fees/recommended")
        fee_res = await fee_res.json()

        let height_res = await fetch("https://mempool.space/api/blocks/tip/height")
        block_height = await height_res.text()
    }
    
    document.getElementById(prefix + "fee_1").innerHTML=`${fee_res.minimumFee} sat/VB`
    document.getElementById(prefix + "fee_2").innerHTML=`${fee_res.economyFee} sat/VB`
    document.getElementById(prefix + "fee_3").innerHTML=`${fee_res.fastestFee} sat/VB`

    document.getElementById(prefix + "fee_usd_1").innerHTML=`$${(0.000001*bitcoinPrice*fee_res.minimumFee).toFixed(2)}`
    document.getElementById(prefix + "fee_usd_2").innerHTML=`$${(0.000001*bitcoinPrice*fee_res.economyFee).toFixed(2)}`
    document.getElementById(prefix + "fee_usd_3").innerHTML=`$${(0.000001*bitcoinPrice*fee_res.fastestFee).toFixed(2)}`

    document.getElementById(prefix + "next_block_num").innerHTML=`${block_height+1}`;
  }

function updateCountdown() {
    // Get the current time in UTC
    const now = new Date();
    const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

    // Calculate the time until 48 hours later (midnight UTC, two days later)
    const nextUTC48Hour = new Date(utcNow);
    nextUTC48Hour.setUTCDate(utcNow.getUTCDate() + 2); // Move to two days ahead
    nextUTC48Hour.setUTCHours(0, 0, 0, 0); // Set to midnight

    const diff = nextUTC48Hour - utcNow; // Difference in milliseconds

    // Convert difference to hours, minutes, and seconds
    let hours = Math.floor(diff / (1000 * 60 * 60));
    let minutes = Math.floor((diff / (1000 * 60)) % 60);
    let seconds = Math.floor((diff / 1000) % 60);

    // Pad with zeros to ensure two digits
    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');

    // Update the innerHTML of the countdown element
    let countdown = document.getElementById('countdown');
    if (countdown)
        countdown.innerHTML = `${hours}:${minutes}:${seconds}`;

    // Update the innerHTML of the mobile countdown element
    let mobileCountdown = document.getElementById('mobile-countdown');
    if (mobileCountdown)
        mobileCountdown.innerHTML = `${hours}:${minutes}:${seconds}`;
}

let buttonConnectMain = {};
let buttonConnectInMenu = {};

let isConnected = false;

function onClickConnect() {
    if (isConnected) {
        bitprint.disconnect();
    }
    else {
        open_popup();
    }
}

function shortenString(str) {
    if (str.length <= 8) {
        return str; // No need to shorten if the string is 8 characters or less
    }
    
    // Extract the first and last four characters
    let firstFour = str.substring(0, 4);
    let lastFour = str.substring(str.length - 4);
    
    // Concatenate with "..." in the middle
    return firstFour + "..." + lastFour;
}

function setConnected(addr) {
    let title = "";
    let text = "";
    
    if (addr) {
        let shortaddr = shortenString(addr);
        text = "Disconnect<div class='mb-0 fw-bold fs_xsm text_md text_warning text-nowrap'>" + shortaddr + "</div>";
        title = "Connected to: " + addr;
        isConnected = true;
    }
    else {
        text = "Connect";
        title = "Click to connect";
        isConnected = false;
    }

    buttonConnectMain = document.getElementById('connectMain');
    buttonConnectInMenu = document.getElementById('connectInMenu');

    buttonConnectMain.setAttribute('title', title);
    buttonConnectInMenu.setAttribute('title', title);

    //console.log(text);
    buttonConnectMain.innerHTML = text;
    buttonConnectInMenu.innerHTML = text;
}

function addOnClicks() {
    buttonConnectMain = document.getElementById('connectMain');
    buttonConnectInMenu = document.getElementById('connectInMenu');

    buttonConnectMain.setAttribute('onClick', 'onClickConnect()');
    buttonConnectInMenu.setAttribute('onClick', 'onClickConnect()');
}

function open_popup() {
    document.getElementById("connect_wallet_popup").style.display = "block";
}

function closed_popup() {
    document.getElementById("connect_wallet_popup").style.display = "none";
}

async function connectButtonAsync(providerName) {
    await bitprint.connect(providerName);

    if (bitprint.isConnectedHasWallet()) {
        if (window.location.toString().includes('staking.html')) {
            window.location = "./staking-dashboard.html";
        }
    }
}
let pageLogElementId = "logger";
let count = 0;
function setPageLogger(newid) {
    count++;
    console.log(count);
    if (count >= 3) {
        document.getElementById(newid).innerHTML = "<p id='logger' style='color:white'>Log initialized.<br><br></p>" + document.getElementById(newid).innerHTML;
    }
}

function pagelog(msg) {
    let logel = document.getElementById(pageLogElementId);
    if (logel) logel.innerHTML += msg + "<br><br>";
    console.log(msg);
}

function addWalletConnect() {
    let sectionText = 
    `
    <section class="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
    <div class="custom_container">
      <div id="connect_wallet_popup" class="connect_wallet_popup_open h-100 top-0 start-0 w-100 px-2">
        <span onclick="closed_popup()" class="w-100 opacity-25 h-100 position-absolute bg_secondary"></span>
        <div
          class="wallet_box bg-black p-2 p-sm-4 w-100 d-flex flex-column gap-2 position-relative top-50 start-50 access_popup z-2">
          <div class="d-flex justify-content-between align-items-center py-2">
            <h3 class="text-white fs_lg fw-bold my-1">Connect wallet</h3>
            <img onclick="closed_popup()" class="cusor_pointer" src="./assets/images/svg/cross-img.svg"
              alt="cross-img" />
          </div>
          <div class="d-flex justify-content-between align-items-center bg_secondary p-3 ps-md-4" id='connect-leather'>
            <div class="d-flex align-items-center my-md-2 gap-3 gap-md-4">
              <img class="wallet_icons" height="36" width="36" src="./assets/images/png/leather-logo.png"
                alt="images" />
              <p class="text-white fs_lg fw-bold mb-0">Leather</p>
            </div>
            <span
              class="bg_warning fs_md connect_btn text-decoration-none connect_btn_wallet transition_03 text-white my-md-2">
              Connect
            </a>
          </div>
          <div class="d-flex justify-content-between align-items-center bg_secondary p-3 ps-md-4" id='connect-xverse'>
            <div class="d-flex align-items-center my-md-2 gap-3 gap-md-4">
              <img class="wallet_icons" height="36" width="36" src="./assets/images/png/xverse-logo.png"
                alt="images" />
              <p class="text-white fs_lg fw-bold mb-0">Xverse</p>
            </div>
            <span
              class="bg_warning fs_md connect_btn connect_btn_wallet transition_03 text-white my-md-2 text-decoration-none">
              Connect
            </a>
          </div>
          <div class="d-flex justify-content-between align-items-center bg_secondary p-3 ps-md-4" id='connect-okx'>
            <div class="d-flex align-items-center my-md-2 gap-3 gap-md-4">
              <img class="wallet_icons" height="36" width="36" src="./assets/images/png/okx-logo.png" alt="images" />
              <p class="text-white fs_lg fw-bold mb-0">OKX</p>
            </div>
            <span
              class="bg_warning fs_md connect_btn text-decoration-none connect_btn_wallet transition_03 text-white my-md-2">
              Connect
            </a>
          </div>
          <div class="d-flex justify-content-between align-items-center bg_secondary p-3 ps-md-4" id='connect-unisat'>
            <div class="d-flex align-items-center my-md-2 gap-3 gap-md-4">
              <img class="wallet_icons" height="36" width="36" src="./assets/images/png/unisat.png" alt="unisat" />
              <p class="text-white fs_lg fw-bold mb-0">UniSat</p>
            </div>
            <span
              class="bg_warning fs_md connect_btn text-decoration-none connect_btn_wallet transition_03 text-white my-md-2">
              Connect
            </a>
          </div>
        </div>
      </div>
      `;

      let section = document.createElement('template');
      section.innerHTML = sectionText;

      document.body.append(section.content.children[0]);
      closed_popup();
      document.getElementById('connect-unisat').onclick = async() => {await connectButtonAsync('unisat')};
      document.getElementById('connect-okx').onclick = async() => {await connectButtonAsync('okx')};
      document.getElementById('connect-xverse').onclick = async() => {await connectButtonAsync('xverse')};
      document.getElementById('connect-leather').onclick = async() => {await connectButtonAsync('leather')};
    }