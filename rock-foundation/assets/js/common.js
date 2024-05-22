
let bitcoinPrice=69420


async function startup() {
    if (document.getElementById('countdown')) {
        // Call updateCountdown every second to keep the countdown accurate
        setInterval(updateCountdown, 1000);
    }

    loadTickers();

    addOnClicks();
    addWalletConnect();

    await bitprint.load();
}

let mempoolres = {};
async function loadTickers() {
    // load BTC
    let res= await fetch("https://mempool.space/api/v1/prices")
    res= await res.json()
    // console.log(res)
    bitcoinPrice=res.USD
    document.getElementById("btc_price").innerHTML=bitcoinPrice

    let fee_res= await fetch("https://mempool.space/api/v1/fees/recommended")
    fee_res= await fee_res.json()
    // console.log(fee_res)
    document.getElementById("fee_1").innerHTML=`${fee_res.minimumFee} sat/VB`
    document.getElementById("fee_2").innerHTML=`${fee_res.economyFee} sat/VB`
    document.getElementById("fee_3").innerHTML=`${fee_res.fastestFee} sat/VB`

    document.getElementById("fee_usd_1").innerHTML=`$${(0.000001*bitcoinPrice*fee_res.minimumFee).toFixed(2)}`
    document.getElementById("fee_usd_2").innerHTML=`$${(0.000001*bitcoinPrice*fee_res.economyFee).toFixed(2)}`
    document.getElementById("fee_usd_3").innerHTML=`$${(0.000001*bitcoinPrice*fee_res.fastestFee).toFixed(2)}`

    let height_res= await fetch("https://mempool.space/api/blocks/tip/height")
    height= await height_res.text()
    // console.log(fee_res)
    document.getElementById("next_block_num").innerHTML=`${height+1}`;
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

    console.log(text);
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
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
}

function closed_popup() {
    document.getElementById("connect_wallet_popup").style.display = "none";
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
}

function addWalletConnect() {
    let section = 
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
          <div class="d-flex justify-content-between align-items-center bg_secondary p-3 ps-md-4" onclick="bitprint.connect('leather')">
            <div class="d-flex align-items-center my-md-2 gap-3 gap-md-4">
              <img class="wallet_icons" height="36" width="36" src="./assets/images/png/leather-logo.png"
                alt="images" />
              <p class="text-white fs_lg fw-bold mb-0">Leather</p>
            </div>
            <a href="./staking-dashboard.html"
              class="bg_warning fs_md connect_btn text-decoration-none connect_btn_wallet transition_03 text-white my-md-2">
              Connect
            </a>
          </div>
          <div class="d-flex justify-content-between align-items-center bg_secondary p-3 ps-md-4" onclick="bitprint.connect('xverse')">
            <div class="d-flex align-items-center my-md-2 gap-3 gap-md-4">
              <img class="wallet_icons" height="36" width="36" src="./assets/images/png/xverse-logo.png"
                alt="images" />
              <p class="text-white fs_lg fw-bold mb-0">Xverse</p>
            </div>
            <a href="./staking-dashboard.html" onclick="closed_popup()"
              class="bg_warning fs_md connect_btn connect_btn_wallet transition_03 text-white my-md-2 text-decoration-none">
              Connect
            </a>
          </div>
          <div class="d-flex justify-content-between align-items-center bg_secondary p-3 ps-md-4" onclick="bitprint.connect('okx')">
            <div class="d-flex align-items-center my-md-2 gap-3 gap-md-4">
              <img class="wallet_icons" height="36" width="36" src="./assets/images/png/okx-logo.png" alt="images" />
              <p class="text-white fs_lg fw-bold mb-0">OKX</p>
            </div>
            <a href="./staking-dashboard.html"
              class="bg_warning fs_md connect_btn text-decoration-none connect_btn_wallet transition_03 text-white my-md-2">
              Connect
            </a>
          </div>
          <div class="d-flex justify-content-between align-items-center bg_secondary p-3 ps-md-4" onclick="bitprint.connect('unisat')">
            <div class="d-flex align-items-center my-md-2 gap-3 gap-md-4">
              <img class="wallet_icons" height="36" width="36" src="./assets/images/png/unisat.png" alt="unisat" />
              <p class="text-white fs_lg fw-bold mb-0">UniSat</p>
            </div>
            <a href="./staking-dashboard.html"
              class="bg_warning fs_md connect_btn text-decoration-none connect_btn_wallet transition_03 text-white my-md-2">
              Connect
            </a>
          </div>
        </div>
      </div>
      `;

      document.body.innerHTML += section;
      closed_popup();
    }