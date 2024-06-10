

var lux = {
  displayUsername(){
    //if(document.getElementById("account") && bitprint.wallet?.address){
    //  document.getElementById("account").innerHTML=`<div class="mb-0 fw-bold text_md text_warning text-nowrap" id="address" onclick="bitprint.disconnect()">${bitprint.wallet.address}</div>`
    //}else if(window){}
  }
}
var bitprint = {
    account:{},
    //called on app load get acc data
    load:async()=>{
      if(localStorage.account){
        console.log(`has local storage account: ${localStorage.account}`);
        bitprint.account={};
        bitprint.account=JSON.parse(localStorage.account);
        if(bitprint.account.type=="web3"){
          await window.ethereum.enable()
          //get provider
          bitprint.provider = await new ethers.providers.Web3Provider(window.ethereum);
          //get signer
          bitprint.signer = await bitprint.provider.getSigner();
          bitprint.wallet={}
          bitprint.wallet.address=bitprint.provider.provider.selectedAddress
          
        }else if(bitprint.account.type=="torus"){
          lux.load();
          bitprint.connect("torus").then(()=>{lux.changePage()})
            torus = new Torus();
            await torus.init();
            torus.login().then(()=>{
                web3 = new Web3(torus.provider);
                bitprint.provider = new ethers.providers.Web3Provider(torus.provider);
                bitprint.provider.provider.selectedAddress=torus.provider.selectedAddress;

                bitprint.signer = bitprint.provider.getSigner();
            });
        }else if(bitprint.account.type=="email"){

          // bitprint.getUser()
        }else if(bitprint.account.type=="unisat"){
          
          try {
            let accounts = await window.unisat.requestAccounts();
            // console.trace('connect success', accounts);
            let pubKey=await unisat.getPublicKey();
            bitprint.wallet={"type":"btc", "address":accounts[0], pubKey:pubKey}
            
          } catch (e) {
            console.trace('connect failed');
          }
        }else if(bitprint.account.type=="xverse"||bitprint.account.type=="magicEden"){
          
          bitprint.provider = window.XverseProviders?.BitcoinProvider || window.BitcoinProvider;

          try {
            if (localStorage.waladr) {
              console.log('using saved creds');
              var addr = CryptoJS.AES.decrypt(localStorage.waladr, 'GetSecretPassphrase()').toString(CryptoJS.enc.Utf8);
              var pky = CryptoJS.AES.decrypt(localStorage.pky, 'GetSecretPassphrase()').toString(CryptoJS.enc.Utf8);
              bitprint.wallet={"pubKey":pky, "address":addr, "type": undefined}
            }
            else {
              console.log('getting new creds');
              let satsAddress=await bitprint.satsAddress();
              satsAddress = satsAddress.addresses;
              console.log(satsAddress)
              let address=satsAddress[0].address||"NONE"
              let pubKey=satsAddress[0].publicKey||"NONE"
              bitprint.wallet={"pubKey":pubKey, "address":address, "type": satsAddress.type}

              localStorage.waladr = CryptoJS.AES.encrypt(address, 'GetSecretPassphrase()');
              localStorage.pky = CryptoJS.AES.encrypt(pubKey, 'GetSecretPassphrase()');
            }
          } catch (e) {
            console.trace('connect failed: ', e);
          }
        }else if(bitprint.account.type=="leather"){
          
          try {
            let accounts = await window.btc?.request('getAddresses');
            bitprint.wallet={"type":"btc", "address":accounts.result.addresses[1].address, pubKey:accounts.result.addresses[1].publicKey}

            console.log(bitprint.wallet)
            
          } catch (e) {
            console.trace('connect failed');
          }
        }else if(bitprint.account.type=="okx"){
          
          try {
            if (typeof window.okxwallet !== 'undefined') {
              const result = await okxwallet.bitcoin.connect()
              bitprint.wallet={
                address:result.address,
                pubKey:result.publicKey
              }
              
            }else{
              lux.popup("<h1>SIKE!</h1>OKX is not installed")
            }
            
          } catch (e) {
            console.trace('connect failed');
          }
        }

        if(bitprint.account?.wallet?.privateKey){
          //set wallet
          bitprint.wallet = new ethers.Wallet(bitprint.account.wallet.privateKey)
          //set provider if there is none
          if(!bitprint.provider){bitprint.provider=new ethers.providers.EtherscanProvider("homestead");}
          bitprint.signer = bitprint.wallet
          
        }

        if (bitprint.wallet?.address) { 
          //display add
          lux.displayUsername()
          console.log("connected: " + bitprint.wallet?.address)
        }
        else {
          bitprint.disconnect();
        }

        setConnected(bitprint.wallet?.address);
      }
      else {
        console.log("no local storage.");
      }
    },
    //save acc data to localstorage
    save:()=>{
      if(bitprint.account.type){
        localStorage.account=JSON.stringify(bitprint.account);
      }
    },
    isConnected(){
      return (bitprint.account && JSON.stringify(bitprint.account) != "{}")
    },
    isConnectedHasWallet(){
      return (bitprint.account && bitprint.account.type && bitprint.account.type != '') && (bitprint.wallet && bitprint.wallet.address);
    },
    //connect to an account
    connect:async(t)=>{
        if(t=="web3"){
            if(!bitprint.account.type){
              bitprint.account={
                  type:"web3"
              }
              bitprint.save();
            }
            lux.changeAccounts()
        }else if(t=="torus"){
        
            bitprint.account={
                type:"torus"
            }
        
        }else if(t=="create"){
            bitprint.account={
                type:"key"
            }    
            let wallet = ethers.Wallet.createRandom();
            localStorage.privateKey=wallet.privateKey;
        }else if(t=="email"){
            window.name = "ByteTrade";
            //get email
            let email=document.getElementById("accountData").value
            //generate wallet
            bitprint.wallet = await ethers.Wallet.createRandom();

            bitprint.account={
                type:"email",
                email:email,
                wallet:{
                  privateKey:bitprint.wallet.privateKey
                }
            }
            //setup post req params 
            let p={
                "account":email,
                "address":bitprint.wallet.address,
                "connect":1
            }
            console.log(JSON.stringify(p))
            let res=await fetch("auth/user",{
              method:"post",
              body:JSON.stringify(p)
            })
        }else{
          
          if(!bitprint.account.type){
            bitprint.account={
                type:t
            }
            bitprint.save();

          }
        }
        await bitprint.load();
        //lux.connect();
    },
    //disconnect acc
    disconnect(){
      if(bitprint.account.type=="torus"){
        torus.logout();
      }
      localStorage.clear();
      bitprint.account = null;
      bitprint.wallet = null;

      localStorage.removeItem('waladr');
      localStorage.removeItem('pky');
      
      location.reload();

      setConnected(bitprint.wallet?.address);
    },
    //check if user exists
    async getAccountStatus(){
      if(bitprint.account.type=="email"){

        // alert(accountData)
        let body={
                request:"exists",
                account:accountData
            }
        let res = await fetch("user", {
            method:"post",
            body:JSON.stringify(body)
        })
        res = await res.json()
        return res

      }
      
    },
    //fetch acc key, prompt sig on key, populate bitprint.account.data with acc data returned from server if this is EMAIL ACC
    async getUser(callback){
        if(bitprint.account.type){
            //get user to query
            let body={
                type:bitprint.account.type,
                address:bitprint.wallet.address
            }
            
            let accountStatus=await bitprint.getAccountStatus()
            console.log(accountStatus);
            
            if(accountStatus.exists=="true"){
              //get auth token
              p.tokenRequest=true;
              let res = await fetch('/auth/user',{
                method:"post",
                body:JSON.stringify(body)
              });
              res = await res.json()

              //sign auth token
              let token=res;
              p.sig=await bitprint.sign(`Login ${token}`);
              //console.log(res,p)
              console.log(p)
              //make reqest for data
              let dataRes = await fetch('/auth/user',{
                method:"post",
                body:JSON.stringify(body)
              });
              dataRes = await dataRes.json()

              if(dataRes!=false&&dataRes!="false"){
                  bitprint.account.data=JSON.parse(dataRes)
                  bitprint.save();
              }
              callback(dataRes)
                  
            }else{
              return false
            }
        }else{
            
        }
    },
    //read User Data
    async loadAccount(){
        bitprint.getUser((res)=>{
            console.log(bitprint.account.data, res)
            if(bitprint.account.data==undefined){
                lux.popup(elements.createAccount)
            }else{
                document.getElementById("accountData").innerHTML=elements.accountData();
            }
        })
        
    },
    //write user data
    editAccount:(info)=>{
        bitprint.account.data={...bitprint.account.data, ...info};
        bitprint.save();
        //setup XML
        let ip= `/auth/user`;
        let tokenReqParams={
            "address":bitprint.provider.provider.selectedAddress,
            "tokenRequest":true
        }
        var authTokenReq=new XMLHttpRequest();
        authTokenReq.onreadystatechange =async function() {
            if(this.readyState == 4 && this.status == 200) {
            //get auth token
            console.log(this.responseText);
            let authToken=this.responseText;

            //sign auth token
            //info.timestamp=Date.now();
            let sig= await bitprint.sign(`Account edit ${authToken}`);
            


            //setup req data
            
            let reqData={
                data:info,
                sig:sig,
                address:bitprint.provider.provider.selectedAddress,
                type:bitprint.account.type,
                authToken:authToken
            }

            //setup xml
            var x = new XMLHttpRequest();
            x.onreadystatechange = function() {
                if(this.readyState == 4 && this.status == 200) {
                    console.log(this.responseText)
                }
            };
            
            x.open("POST", ip, true);
            x.setRequestHeader("Content-type", "text/plain");
            x.send(JSON.stringify(reqData));
            }
        };
        authTokenReq.open("POST", ip, true);
        authTokenReq.setRequestHeader("Content-type", "text/plain");
        authTokenReq.send(JSON.stringify(tokenReqParams));
    
    },
    verify(type, v){
      let p = {
        address:bitprint.wallet?.address||bitprint.provider.provider.selectedAddress
      }
      p.type=type;
      p.code=v;
      var x = new XMLHttpRequest();
      x.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          alert(x.responseText);
        }
      }
      x.open("POST", '/auth/verify');
      x.setRequestHeader("Content-type", "text/plain");
      x.send(JSON.stringify(p));
    },
    //sign msg
    sign:async(msg)=>{
      //if web3
      if(bitprint.account.type=="web3"){
        try{
          if(bitprint.signer["_address"]==null){
            
          }
          let signature = await bitprint.signer.signMessage(msg);
          console.log(signature);
          return signature;
        }
        catch(e){
          console.log(e);
          alert(`Could not sign message \n Got Error ${e}`)
          return "unsigned"
        }
      }
      else if(bitprint.account.type=="torus"){
        try{
            console.log(msg, "HI")
          let signature = await web3.eth.personal.sign(msg, bitprint.provider.provider.selectedAddress);
          return signature;
        }
        catch(e){
          console.log(e);
          alert(`Could not sign message`);
        }
      }
      else if(bitprint.account.type=="key"||bitprint.account.type=="email"){
        //console.log("key",k);
        console.trace(msg);
        let signature = await bitprint.wallet.signMessage(msg);
        return signature;
      
      }else if(bitprint.account.type=="unisat"){
        try {
          
          let res = await window.unisat.signMessage(msg,"bip322-simple");
          console.log(res)
          return (res)
        } catch (e) {
          console.log(e);
          throw e
        }
      }else if(bitprint.account.type=="leather"){
        try {
          const res = await window.btc.request('signMessage', { 
            message: msg, 
            paymentType: 'p2wpkh'
          });
          return (res.result.signature)
        } catch (e) {
          console.log(e);
          throw e
        }
      }else if(bitprint.account.type=="okx"){
        try {
          let res = await window.okxwallet.bitcoin.signMessage(msg);
          return (res)
        } catch (e) {
          console.log(e);
          throw e
        }
      }else if(bitprint.account.type=="xverse"||bitprint.account.type=="magicEden"){
        try {
          if (window.BitcoinProvider.request) {
            const res = await window.BitcoinProvider.request('signMessage', { 

              network: "mainnet",
              address: bitprint.wallet.address,
              message: msg
            });
            console.log(res.result)
            return (res.result.signature)
          }
          else {
            pagelog("starting signing");
            const signMessageOptions = {
              payload: {
                address: bitprint.wallet.address,
                message: msg,
                /*network: {
                  type:'Mainnet'
                },*/
              }
            }
            pagelog(`payload: ${JSON.stringify(signMessageOptions.payload)}`);
            let req = await fetch("https://bitscape.io/api/signToken",{
              method:"POST",
              body:JSON.stringify(signMessageOptions.payload)
            })
            req = await req.text()
            pagelog(`req: ${req}`);
            const res = await window.BitcoinProvider.signMessage(req);
            pagelog(`res: ${res}`);
            return (res);
          }
        } catch (e) {
          pagelog(`error: ${e}`);
          throw e
        }
      }
      else{
        this.log(`invalid sig`);
        throw "Invalid Sig"
      }
    },
    //send phone?
    sendVerification(type, v){
      let p = {
        address:bitprint.wallet?.address||bitprint.provider.provider.selectedAddress
      }
      p[type]=v;
      console.log(p);
      var x = new XMLHttpRequest();
      x.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          console.log(x.responseText);
        }
      }
      x.open("POST", '/auth/sendVerification');
      x.setRequestHeader("Content-type", "text/plain");
      x.send(JSON.stringify(p));
    },
    async claimAddress(){
      let data=Date.now().toString(16)
      let sig=await bitprint.sign(data)
      let res = await fetch("/exchange/claimKey",{
        method: "POST",
        body:JSON.stringify({
          data:data,
          sig, sig
        })
      })
      let resText=await res.text()
      console.log(resText)
    },
    async getAddress(){
      await bitprint.load()
      return bitprint.wallet.address
    },
    async satsAddress(){

      const getAddressOptions = {
        payload: {
          purposes: ['ordinals', 'payment'],
          message: 'Address for receiving Ordinals and payments',
          network: {
            type:'Mainnet'
          },
        }
      }
      let req = await fetch("https://bitscape.io/api/signToken",{
        method:"POST",
        body:JSON.stringify(getAddressOptions.payload)
      })
      req = await req.text()
      console.log('req: ' + req)
      const response = await bitprint.provider.connect(req);
      console.log('final response: ');
      console.log(response)
      return response
    }
}