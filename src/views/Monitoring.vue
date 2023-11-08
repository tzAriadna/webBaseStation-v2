<template>
  <div class="home">
    <div class="blocks_top" v-if="this.monitoring.header"> 
      
      <MonitoringMainInf class="block_connection" :monitoring="monitoring"/>

      <div class="block block_power">
        <div class="wrap_h1"><h1>Питание</h1></div>
        <div class="table table_power">
          <div class="dataWs dataWs_border" v-for='(value, name) in this.monitoring.powermon' :key="name">
            <label for="" >{{ name }}</label> <span>{{ value }}</span>
          </div>
        </div>

        <div class = "table">
          <h3>Периферия</h3>
          <div class="dataWs dataWs_border" v-for="el in this.monitoring.gpio" :key="el">
              <label>{{ el.name }}</label>
              <div>
                <div v-if="el.status == true" class="load"></div>
                <div v-if="el.status == false" class="load load_red"></div>
              </div>
          </div>
        </div>
      </div>

      <div class="block block_wifi">
        <div class="wrap_h1"><h1>Wi-Fi</h1></div>
        <div class="table">
          <div v-for="el in this.monitoring.wifi" :key="el">
            <div class="wifi_inff" v-for="(val, item) in el" :key="item">
              <div class="wifi"><router-link class="link" :to="{ name: 'Wifi'}">{{ item }} <img style="width: 13px;" src="../assets/link.svg" alt="" ></router-link></div>
              <div class="dataWs dataWs_1" v-for="(value, name) in val.interface" :key="name">
                <label>{{ name }}</label> 
                <span>{{ value }}</span>
              </div>
              <div class="dataWs dataWs_2" v-for="(value, name) in val" :key="name">
                <label v-if="name != 'interface' && name != 'scan_data' ">{{ name }} </label>
                <span v-if="name != 'interface' && name != 'scan_data' "> {{ value }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class = "table table_pos">
          <h3>Точное позиционирование</h3>
          <div v-for="el in this.monitoring.positioning" :key="el" >
            <div class="dataWs" v-for='(value, name) in el' :key="name">
              <label>{{ name }}</label> <span>{{ value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="block block_monitoring" v-if="this.monitoring.network">
      <div class="wrap_h1"><h1>Сетевые интерфейсы</h1></div>
      <table class='table table_monitoring'>
        <tr class="hTable">
          <th>Статус</th>
          <th>Порт</th>
          <th>IP-адрес</th>
          <th>MAC-адрес</th>
          <th class="tx_rx">Tx, bits/s</th>
          <th class="tx_rx">Rx, bits/s</th>
          <th class="tx_rx_mobile">Tx/Rx, bits/s</th>
        </tr>
        <tr v-for='item in this.monitoring.network' :key="item">
          <td>
            <div v-show='item.operstate == "Up"' id="greenUp"></div>
            <div v-show='item.operstate == "Down" || item.operstate == "LOWERLAYERDOWN"' id="redDown"></div>
          </td>
          <td>{{ item.name }}</td>
          <td> <label v-for='items in item.ip_addr' :key="items"><tr>{{ items }}</tr></label> </td>
          <td>{{ item.mac_addr }}</td>
          <td class="tx_rx">{{ item.stats64.tx_bps }}</td>
          <td class="tx_rx">{{ item.stats64.rx_bps }}</td>
          <td class="tx_rx_mobile">{{ item.stats64.tx_bps }}/{{ item.stats64.rx_bps }}</td>
        </tr>
      </table>
      <div class="wrapLink">
        <router-link class="link" :to="{ name: 'Ospf'}"> Таблица OSPF-соседей <img style="width: 13px;" src="../assets/link.svg" alt="" ></router-link>
      </div>
    </div>
  </div>
</template>

<script>
import MonitoringMainInf from '../components/MonitoringMainInf.vue';

export default {
  name: 'Monitoring',
  components: {
    MonitoringMainInf
  },
  props: ['monitoring'],
  data() {
    return {
    }
  },
}
</script>

<style>
.home {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.blocks_top {
  display: grid;
  width: 90%;
  grid-template-areas: "main power wifi";
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 106px;
}
.block_connection {
  grid-area: main;
}
.block_power {
  grid-area: power;
}
.block_wifi {
  grid-area: wifi;
}

.block {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  box-shadow: 0 0px 12px rgb(0 0 0 / 20%);
  border-radius: 15px;
  padding: 10px 30px;
  margin: 20px;
}
.wrap_h1 {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 5px 0px;
}
.wrap_h1 h1 {
  color: #EFA53D;
  font-size: 28px;
  margin: 3px;
}
.table {
  border-top: 5px solid #5e5e5e;
  width: 100%;
  padding: 7px 0;
}
.dataWs {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  font-size: 22px;
  line-height: 1.5em;
}
.table_power div:nth-child(2n), 
.wifi_inff .dataWs_1:nth-child(2n),
.wifi_inff .dataWs_2:nth-child(2n+1),  
.table_monitoring tr:nth-child(2n),
.table_pos div div:nth-child(2n+1) {
  background-color: #7d7d7d
}

.dataWs label {
  text-align: left;
} 
.dataWs span {
  text-align: right;
}
.block_monitoring {
  max-width: 37%;
  align-self: center;
}
.table_monitoring > tr > td, .table_monitoring th {
  padding: 10px;
}
td:nth-child(3) {
  word-break: break-all;
}

#greenUp, #redDown {
  background: rgb(0, 255, 0);
  border-radius: 50%;
  width: 35px;
  height: 35px;
  border: 1px solid grey;
  margin-left: 23%;
}
#redDown {
  background: rgb(255, 0, 0);
}
.load {
  width: 30px;
  height: 30px;
  background: rgb(0, 255, 0);
  border: 1px solid grey;
  border-radius: 25%;
}

.load_red {
  background: rgb(255, 0, 0);
}
.wifi_val {
  display: flex;
  flex-direction: column;
}
.wifi {
  font-size: 20px;
  text-align: left;
  width: max-content;
  margin-top: 5px;
}
.wrapLink {
  margin-bottom: 7px;
}
.link {
  color: #EFA53D;
  font-size: 20px;
  text-decoration: none;
}
.link:hover {
  text-decoration: underline;
  text-decoration-color: #EFA53D;
}
h3 {
  font-size: 22px;
  font-weight: bold;
  margin: 5px;
  color: #EFA53D;
}
.tx_rx_mobile {
  display: none;
}
@media screen and (max-width: 1700px) {
  .block_monitoring {
    max-width: 700px;
  }
  .blocks_top {
    grid-column-gap: 10px;
  }
}
@media screen and (max-width: 1440px) {
  .blocks_top {
    width: 100%;
  }
}

@media screen and (max-width: 1100px) {
  .blocks_top {
    grid-template-areas: "main main" 
                         "power wifi";
    grid-template-columns: auto auto;
  }
  .block_connection {
    justify-self: center;
    min-width: 440px;
  }
  .block_power, .block_wifi {
    min-width: 278px;
  }
}

@media screen and (max-width: 759px) {
  .block_connection {
    margin-top: 0px;
  }
  .blocks_top {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .blocks_top .block {
    width: 70%;
    min-width: auto;
  }
  .block {
    padding: 6px 25px;
  }
  .table_monitoring > tr > td, .table_monitoring th {
    padding: 6px 3px;
  }
  .wrap_h1 h1 {
    font-size: 25px;
  }
}

@media screen and (max-width: 570px) {
  .dataWs {
    font-size: 20px;
  }
  .wrap_h1 h1 {
    font-size: 23px;
  }
  #greenUp, #redDown {
    width: 25px;
    height: 25px;
    margin-left: 10%;
  }
  .table_monitoring > tr > td, .table_monitoring th {
    font-size: 12px;
  }
  .block_monitoring {
    padding: 2px 10px;
  }
  .link {
    font-size: 18px;
  }
  .table {
    border-top: 4px solid #5e5e5e;
  }
}
@media screen and (max-width: 428px) {
  .wrap_h1 h1 {
    font-size: 20px;
  }
  .dataWs {
    font-size: 17px;
  }
  .block {
    margin: 15px;
  }
  .blocks_top .block {
    width: 75%;
    padding: 4px 18px;
  }
  .table_monitoring th, .table_monitoring > tr > td {
    font-size: 10px;
    padding: 5px 2px;
  }
  #greenUp, #redDown {
    width: 17px;
    height: 17px;
    margin-left: 15%;
  }
  h3 {
    font-size: 18px;
  }
  .load {
    width: 25px;
    height: 25px;
  }
  .tx_rx_mobile {
    display: block;
  }
  .tx_rx {
    display: none;
  }
  .link {
    font-size: 15px;
  }
  .table {
    border-top: 3px solid #5e5e5e;
  }
}
@media screen and (max-width: 374px) {
  .dataWs {
    font-size: 16px;
  }
  .blocks_top .block {
    width: 80%;
    padding: 4px 16px;
  }
  .table_monitoring th, .table_monitoring > tr > td {
    font-size: 9px;
    padding: 5px 1px;
  }
}

</style>