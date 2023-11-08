<template>
  <div class="main">
    <div id="preloader">
      <div id="loader"></div>
    </div>

    <div class="header">
      <div class="header_wrap">
        <img class="wrap_logo" src="@/assets/logo_orange.png" alt="">
        <div class="wrap_connect">
          <div class="wrap_gal_name">
            <h1>{{ hostName }}</h1>
            <div id="signal" class="signal"></div>
          </div>
          <p v-if="serialNum">S/N: {{ serialNum }}</p>
        </div>

      </div>
      <nav class="menu_buttons" :class="{ 'show' : isShow }">
        <router-link class="menuPunkt" :to="{ name: 'Monitoring'}">Мониторинг</router-link>
        <router-link class="menuPunkt" v-if="this.user && this.user != 'guest'" :to="{ name: 'Administrations'}">Настройки</router-link>
        <router-link class="menuPunkt" v-if="!this.user || this.user == 'guest'" :to="{ name: 'Authorization'}" >Вoйти</router-link>
        <router-link class="menuPunkt" v-if="this.user && this.user != 'guest'" :to="{ name: 'Authorization'}" @click="exit()">Выйти</router-link>
      </nav>
      <div class="menuBurger"  @click="burger()">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M88 152h336M88 256h336M88 360h336" fill="none" stroke="#616161" stroke-linecap="round" stroke-miterlimit="10" stroke-width="48px" class="stroke-000000"/>
        </svg>
      </div>
    </div>

    <div class="contentRoute">
      <div class="wrap_content">
        <router-view 
          :monitoring="monitoring"
          :warning="warning" 
          :connect="connect"
          @func="exit" 
          @login="onLogin" 
          @buttons="resetOrPowerOff"
          @forms = "lockForms"
        />
      </div>
    </div>

    <footer class="footer">
      <p id="copy">&copy НПФ "Гранч", {{ new Date().getFullYear() }}</p>
    </footer>
  </div>
</template>

<script>
const urlHostName = window.location.hostname;

export default {
  name: 'App',
  data() {
    return {
      user: '',
      isShow: false,
      wsMonitoring: null,
      counterPong: 0,
      monitoring: [
        { header: {} },
        { sysmon: [] },
        { softConf: [] },
        { gal: [] },
        { sbgps: [] },
        { powermon: [] },
        { positioning: [] },
        { gpio: [] },
        { network: [] },
        { wifi: [] },
      ],
      connect: false,
      checked: true,
      warning: [],
      hostName: null,
      serialNum: null,
      socketState: false,
      flagConnect: '',
    }
  },
  mounted() {
    setInterval( () => {
      this.user = localStorage.user;
      this.checkConnection();
    }, 1000);
    const _this = this; 
    document.addEventListener('click',function(){
      if (_this.debug === 1) {
        _this.debug = 0
        return
      }
      if (_this.debug === 0) {
        _this.isShow = false
      }
    });
  },
  methods: {
    burger() { 
      this.isShow = !this.isShow;
      if (this.isShow) {
        this.debug = 1
      } else {
        this.debug = 0
      }
    },

    onLogin(params) {
      var auth_admin = JSON.stringify({ "name":"Login","data": params });
      this.wsMonitoring.send(auth_admin);
    },

    resetOrPowerOff(params) {
      if (params.func == 'reboot') {
        var request_reboot = JSON.stringify({ "name":"Reboot","data": {} });
        this.wsMonitoring.send(request_reboot);
      } else {
        if (params.func == 'powerOff') {
          var request_off = JSON.stringify({ "name":"PowerOff","data": {} });
          this.wsMonitoring.send(request_off);
        }
      }
    },

    lockForms(params) {
      if (this.socketState) {
        this.funcLockUnlock(params, false);
        if (this.flagConnect == 'wasTheConnectionLost') {
          window.location.reload();
        } 
      } else {
        this.funcLockUnlock(params, true);
        setTimeout( () => {
          if (!this.socketState) {
            this.flagConnect = 'wasTheConnectionLost';
          }
        }, 2000)
      }
    },

    funcLockUnlock(item, val) {
      console.log(item + val);
      let n = 0;
      for ( let i = 0; i < item.length; i++ ) {
        item[n].disabled = val;
        n++;
      }
    },

    checkConnection() {
      const connection = document.getElementById('signal');
      var ping = JSON.stringify({ "name":"Ping","data": {"data": localStorage.access_token} });
      this.webSocketMonitoring();

      if (this.counterPong == 0) {
        connection.style.background = 'red';
        this.connect = false;
      }
      this.counterPong = 0;
      if (this.socketState) {
        this.wsMonitoring.send(ping);
      }
    }, 

    webSocketMonitoring() {
      const connection = document.getElementById('signal');
      var ping = JSON.stringify({ "name":"Ping","data": {"data": localStorage.access_token} });
      if (this.wsMonitoring === null || this.wsMonitoring.readyState !== WebSocket.OPEN) {
        if (this.wsMonitoring !== null) { this.wsMonitoring.close(); }
        this.wsMonitoring = new WebSocket(`ws://${urlHostName}:80/monitoring`);

        this.wsMonitoring.onopen = (event) => {
            console.log(`[open] Соединение установлено: ${event.code}`);
            this.wsMonitoring.send(ping);
        }

        this.wsMonitoring.onmessage = (event) => {
            const wsDataMonitoring = JSON.parse(event.data);
            if (wsDataMonitoring.name == 'Pong') {
              connection.style.background = '#00ff00';
              this.connect = true;
              this.counterPong++;
              this.socketState = true;
            }
            if (wsDataMonitoring.name == 'Auth') {
              console.log(wsDataMonitoring.data.status)
              if ( wsDataMonitoring.data.status ) {
                localStorage.access_token = wsDataMonitoring.data.token;
                localStorage.status = wsDataMonitoring.data.status
              }
              if ( !wsDataMonitoring.data.status ) {
                localStorage.user = 'guest';
                localStorage.access_token = 'guest';
              }
            }

            if (wsDataMonitoring.name == 'Header') {
              this.monitoring.header = wsDataMonitoring.data;
              this.serialNum = this.monitoring.header.serial;
            }
            if (wsDataMonitoring.name == 'Sys') {
              this.monitoring.sysmon = wsDataMonitoring.data;
              this.hostName = this.monitoring.sysmon.hostname;
              document.title = this.hostName; 
            }
            if (wsDataMonitoring.name == 'SoftConf') {this.monitoring.softConf = wsDataMonitoring.data}
            if (wsDataMonitoring.name == 'Gal' ) {this.monitoring.gal = wsDataMonitoring.data;}
            if (wsDataMonitoring.name == 'Sbgps' ) {this.monitoring.sbgps = wsDataMonitoring.data;}
            if (wsDataMonitoring.name == 'Power') {this.monitoring.powermon = wsDataMonitoring.data}
            if (wsDataMonitoring.name == 'Positioning') {this.monitoring.positioning = wsDataMonitoring.data}
            if (wsDataMonitoring.name == 'PowerGpio') {this.monitoring.gpio = wsDataMonitoring.data}
            if (wsDataMonitoring.name == 'Wifi') {this.monitoring.wifi = wsDataMonitoring.data}
            if (wsDataMonitoring.name == 'Network') {
              this.monitoring.network = wsDataMonitoring.data;
              let n = 0;
              for ( let i = 0; i<this.monitoring.network.length; i++ ) {
                let stats = this.monitoring.network[n].stats64;
                if (stats.tx_bps > 1000000) {stats.tx_bps = (Math.trunc(stats.tx_bps/1000000)) + 'M'};
                if (stats.tx_bps > 1000) {stats.tx_bps = (Math.trunc(stats.tx_bps/1000)) + 'K'};
                if (stats.rx_bps > 1000000) {stats.rx_bps = (Math.trunc(stats.rx_bps/1000000)) + 'M'};
                if (stats.rx_bps > 1000) {stats.rx_bps = (Math.trunc(stats.rx_bps/1000)) + 'K'};
                n++;
              }
            }
            if (wsDataMonitoring.name == 'Warning') {
              this.warning = wsDataMonitoring.data;
            }
            console.log('[message] Данные WebSocketMonitoring получены...');
          }
        
        this.wsMonitoring.onerror = (error) => {
            connection.style.background = 'red';
            this.connect = false;
            console.log('[error] WebSocketMonitoring Error: ' + error);
            this.wsMonitoring.close();
            this.socketState = false;
        }
        this.wsMonitoring.onclose = (event) => {
            connection.style.background = 'red';
            this.connect = false;
            if (event) {
              console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
            } else {
              console.log('Соединение прервано...');
              setInterval( () => {
                console.log("[reconnect] Попытка переподключения к серверу...")
                this.webSocketMonitoring();
              }, 2500)
            }
            this.socketState = false;
        }
      }
    },
    exit() {
      localStorage.user = 'guest';
      localStorage.status = 'false';
      localStorage.access_token = '';
    }

  }
}

</script>

<style>
body {
  margin: 0;
  padding: 0;
}
#preloader {
  display: block;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  z-index: 4;
  background: rgb(75, 74, 74);
} 
#loader {
  display: block;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  background-image: url('./assets/loader.gif');
  width: 64px;
  height: 64px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
}
.main {
  background: #828282;
}
.header {
  background: #333;
  color: #ffb300;
  width: 100%;
  height: max-content;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  z-index: 1;
  box-shadow: 0 2px 17px rgba(0,0,0,0.4);
  padding: 5px 3px;

}
.header_wrap {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.wrap_logo {
  width: 15em;
}
.wrap_connect {
  padding: 10px 0 0 12px;
}
.wrap_connect p {
  margin: 0;
  text-align: left;
}
.wrap_gal_name {
  display: flex;
  align-items: center;
  line-height: 1em;
}


#signal {
  background: red;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  margin: 0 5px;
}


nav {
  padding: 30px;
}
nav a {
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  padding: 15px;
  font-size: 25px;
}
nav a.router-link-exact-active {
  color: #ffb300
}
nav a:hover {
  color: #ffb300;
}
.contentRoute {
  display:flex;
  min-height: 55.7em;
  justify-content: center;
  width: 100%;
}

.wrap_content {
  width: 100%;
  margin: 200px 0 100px 0;
}
.wrap_warn {
  position: fixed;
  z-index: 2;
  top: 20%;
  left: 43%;
}
.warn {
  border: 4px solid green;
  padding: 30px 80px;
  font-size: 30px;
  color: green;
  background: #ddd;
}
.warn30 {
  border: 4px solid yellow;
  color: yellow;
}
.warn50 {
  border: 4px solid red;
  color: red;
}
.menuBurger {
  display: none;
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background: #333333;
  color: #ffb300;
  height: 80px;
}
.menu_buttons {
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  border: 0;
}

@media screen and (max-width: 1110px) {
  .wrap_logo {
    width: 12em;
  }
  .wrap_connect {
    padding: 0 0 0 12px;
  }
  .wrap_content {
    margin: 150px 0 60px 0;
  }
  .header_wrap h1 {
    font-size: 24px;
  }
  .wrap_connect p {
    font-size: 14px;
  }
  nav {
    padding: 10px;
  }
  nav a {
    padding: 7px;
    font-size: 22px;
  }
}
@media screen and (max-width: 759px) {
  .wrap_logo {
    width: 9em;;
  }
  nav a {
    font-size: 20px;
    padding: 5px;
  }
  .wrap_gal_name {
    line-height: 0.8em;
  }
  .header_wrap h1 {
    font-size: 22px;
  }
}
@media screen and (max-width: 650px) {
  .menuBurger {
    display: inline-block;
    width: 60px;
    align-self: center;
    justify-self: center;
    position: fixed;
    right: 0;
    padding-right: 12px;
    transition: all 0.3s ease 0s;
  }
  .menu_buttons {
    position: fixed;
    top: -100%;
    right: 0;
    width: 175px;
    flex-direction: column;
    z-index: 2;
    justify-content: center;
    margin-top: 63px;
    padding: 0;
    border: 1px solid #333;
  }
  .menuPunkt {
    text-decoration: none;
    background: #333;
    padding:19px;
    border-top: 1px solid #8c8c8c;
  }
  .wrap_logo {
    width: 8em;;
  }
  .header_wrap h1 {
    font-size: 22px;
  }
  #signal {
    width: 22px;
    height: 22px;
  }
  .wrap_connect p {
    font-size: 12px;
  }
  .wrap_gal_name {
    line-height: 0.2em;
  }
  .menu_buttons {
    transform: translateY(-100%);
    transition-timing-function: cubic-bezier(.68,-.55,.265,1.55);
    transition-duration: .1s;
  }
  .menu_buttons.show {
    top: 0;
    transform: translateY(0);
    transition-timing-function: cubic-bezier(0,0,0.58,1);
    transition-duration: .5s;
  }

}
@media screen and ( max-width: 570px ) {
  .wrap_content {
    margin: 120px 0 35px 0;
  }
}
@media screen and ( max-width: 428px ) {
  .wrap_connect p {
    font-size: 10px;
  }
  .header_wrap h1 {
    font-size: 20px;
  }
  .wrap_logo {
    width: 7em;
  }
  .wrap_connect {
    padding: 0 0 0 6px;
  }
  #signal {
    width: 18px;
    height: 18px;
  }
  .wrap_content {
    margin: 105px 0 35px 0;
  }
  .menu_buttons {
    margin-top: 57px;
  }
  .menuPunkt {
    padding: 16px;
  }
}
@media screen and ( max-width: 375px) {
  .wrap_logo {
    width: 6em;
  }
  .header_wrap h1 {
    font-size: 20px;
  }
  .menuBurger {
    width: 50px;
  }
  .wrap_content {
    margin: 90px 0 25px 0;
  }
  .menu_buttons {
    margin-top: 52px;
  }
  .menuPunkt {
    font-size: 17px;
  }
}

</style>
