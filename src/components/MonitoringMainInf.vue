<template>
<div class="block block_connection">
  <div class="wrap_h1"><h1>Основная информация</h1></div>

                  <!-- mainInf -->
  <div id="untitled" class="table">
      <div v-for="(value, name, index) in this.monitoring.sysmon" :key="name">
        <div class="dataWs" :class="{'strong': index==0}">
          <label v-if="index == 0 || index == 2">{{ name }}</label>
          <div>
            <span v-if="index == 0">{{ value }}</span>
            <div 
              v-if="index == 2 && value == true"  
              class="load hov" 
              @click="wer()"
            > 
              <img v-if="showLoad || showLoadFlag" id="img" src="@/assets/angle-small-down.svg" alt="загрузка...">
              <img v-if="!showLoad && !showLoadFlag" id="img" src="@/assets/angle-small-up.svg" alt="загрузка...">
            </div>
            <div 
              v-if="index == 2 && value == false"  
              class="load load_red hov" 
              @click="wer()"
            >
              <img v-if="showLoad || showLoadFlag" id="img" src="@/assets/angle-small-down.svg" alt="загрузка...">
              <img v-if="!showLoad && !showLoadFlag" id="img" src="@/assets/angle-small-up.svg" alt="загрузка...">
            </div>
          </div>
        </div>
        <div class="dataWs">
          <label v-if="index > 2 && (showLoad || showLoadFlag)">{{ name }}</label>
          <span v-if="index > 2 && (showLoad || showLoadFlag)">{{ value }}</span>
        </div>
      </div>
  </div>

                   <!-- sbgps -->
  <div class="block_sbgps" v-if="monitoring.sbgps">
    <div id="untitled" class="table" >
      <div v-for="(value, name) in this.monitoring.sbgps" :key="name">
        <div class="dataWs" v-if="name != 'servers' && name != 'dry'">
          <label>{{ name }}</label>
          <span>{{ value }}</span>
        </div>
      </div>
      <div class="dataWs"><label>Сервер телеметрии:</label></div>
      <div class="dataWs" v-for = "elem in this.monitoring.sbgps.servers" :key="elem">
        <label> - {{ elem.address }}</label>
        <div>
          <div v-if="elem.status == true" class="load"></div>
          <div v-if="elem.status == false" class="load load_red"></div>
        </div>
      </div>
    </div>
                      <!-- Conveyer -->
    <div id="untitled" class="table" v-if="monitoring.sbgps.dry.config" >
      <h3 >Управление конвейером</h3>
      <div class="dataWs" v-for="(value, name) in this.monitoring.sbgps.dry.config" :key="name">
          <label v-if="value !== 'null'">{{ name }}</label>
          <div v-if="value == true || value == false">
              <div v-if="value == true">Вкл</div>
              <div v-if="value == false">Выкл</div>
          </div>
          <span v-else v-if="value !== 'null'">{{  value }}</span>
      </div>
    </div>
  </div>
  <div class="wrapLink linkConv">
    <router-link class="link" :to="{ name: 'Conveyor'}"> Настроить конвейер<img style="width: 13px;" src="../assets/link.svg" alt="" ></router-link>
  </div> 
  

                    <!-- dgl -->
  <div id="untitled" class="table" v-if="monitoring.gal" >
      <div class="dataWs" v-for = "elem in this.monitoring.gal.servers" :key="elem">
        <label>{{ elem.address }}</label>
        <div>
          <div v-if="elem.status == true" class="load"></div>
          <div v-if="elem.status == false" class="load load_red"></div>
        </div>
      </div>
      <div v-for="(value, name) in this.monitoring.gal" :key="name">
        <!-- <div class="dataWs" v-if="name == 'Сервер доступен?'">
          <label>{{ name }}</label>
          <div>
            <div 
              v-if="value == true"  
              class="load hov"
              @mouseover="showGal = true" 
              @mouseleave="showGal = false"
              @click="ver()"
            ></div>
            <div 
              v-if="value == false" 
              class="load load_red hov"
              @mouseover="showGal = true" 
              @mouseleave="showGal = false"
              @click="ver()"
            ></div>
          </div>
        </div> -->
        
        <div class="dataWs" v-if="name != 'servers' && name != 'dgl_tlm'">
          <label>{{ name }}</label>
          <span>{{ value }}</span>
          <!-- <div v-if="((showGal || showGalFlag) && name == 'server_addr')">
            <span v-for="(val, n) in this.monitoring.gal.server_addr" :key="n">{{val}}</span>
          </div> -->
        </div>
      </div>


      <div class="dataWs" v-for="(value, name) in this.monitoring.gal.dgl_tlm" :key="name">
        <label v-if="name =='dgl_online' || name == 'Тип машины' || name == 'length'">{{ name }}</label>
        <div v-if="name  == 'dgl_online'">
          <div v-if="value == true" class="load"></div>
          <div v-if="value == false" class="load load_red"></div>
        </div>
        <span v-if="name == 'Тип машины' || name == 'length'">{{ value }}</span>
      </div>
      
      <div class="gal_param">
        <SpeedometrV v-if="monitoring.gal.dgl_tlm.speed != null" :monitoringGalDgl="monitoring.gal.dgl_tlm" :speedExp="speedExp"/>
        <SpeedometrRout v-if="monitoring.gal.dgl_tlm.engine_rpm != null" :monitoringGalDgl="monitoring.gal.dgl_tlm" />
        <div class="wrap_temp">
          <span v-if="monitoring.gal.dgl_tlm.engine_temp != null"><img class="temp" src="../assets/temp1.svg" alt="" >{{monitoring.gal.dgl_tlm.engine_temp}}°C</span>
          <span v-if="monitoring.gal.dgl_tlm.hydraulic_temp != null"><img class="temp" src="../assets/temp2.svg" alt="" >{{monitoring.gal.dgl_tlm.hydraulic_temp}}°C</span>
        </div>
      </div>
  </div>

</div>
</template>

<script>
const img = document.getElementById('img');
import SpeedometrV from '../components/SpeedometrV.vue';
import SpeedometrRout from '../components/SpeedometrRout.vue';

export default {
  name: 'MonitoringMainInf',
  props: ['monitoring'],
  components: {
    SpeedometrV,
    SpeedometrRout,
  },
  data() {
    return {
      showLoad: false,
      showLoadFlag: false,
      speedExp: 0
    }
  },
  methods: {
    wer() {
      if (this.showLoadFlag == true) {
        this.showLoadFlag = false;
        this.showLoad = false;
      } else {
        this.showLoadFlag = !this.showLoadFlag;
      }

    },
  }
}
</script>

<style>

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
.wifi_inff {
  font-size: 16px;
}
.hov:hover {
  border: 1px solid white;
  cursor: pointer;
}
.gal_param {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.wrap_temp {
  width: 70%;
  display: flex;
  justify-content: space-between;
}
.wrap_temp span {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #000;
}
.temp {
  width: 45px;
}
#img {
  width: 30px;
}
.linkConv {
  margin-top: 7px;
}
.block_sbgps {
  width: 100%;
}

@media screen and (max-width: 428px) {
  #img {
    width: 25px;
  }
}
</style>