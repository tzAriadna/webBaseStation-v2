<template>
<div class="home_wifi">
  <NotAuth v-if="!this.user || this.user == 'guest'"></NotAuth>
  <div v-if="this.user && this.user != 'guest'">
    <div v-for='(el) in this.monitoring.wifi' :key="el">
      <div v-for="(item, param) in el" :key="param">
        <div v-if="item.scan_data.length != 0">

          <div v-if="param == 'AdHoc' || param == 'Managed'" class="wrap">
              <h1>{{param}} Wi-Fi</h1>
              <table class="blockk block_adhoc">
                <thead>
                    <th colspan="3" class="strAdHoc">av_signal</th>
                    <th colspan="3" class="strAdHoc">bssid</th>
                    <th colspan="3" class="strAdHoc">signal</th>
                </thead>
                <tr class="dataString" v-for="elem in item.scan_data" :key="elem">
                    <td class="strAdHoc" colspan="3" v-for="(val, name) in elem" :key="name"> 
                      <label>{{ val }}</label>
                    </td> 
                </tr>
              </table>
          </div>


          <div v-if="param == 'AP'" class="wrap wrap_ap">
              <h1>{{param}} Wi-Fi</h1>
              <div class="blockk block_ap">
                <div class="titles">
                  <div class="strAP"><label>av_signal</label></div>
                  <div class="strAP"><label>bssid</label></div>
                  <div class="strAP"><label>signal</label></div>
                  <div class="strAP"><label></label></div>
                  <div class="strAP"><label>expires</label></div>
                  <div class="strAP"><label>ip</label></div>
                  <div class="strAP"><label>hostname</label></div>
                </div>
                <div class="stolb dataString" v-for="elem in item.scan_data" :key="elem">
                  <div class="strAP" v-for="(val, name) in elem" :key="name">
                    <label v-if="name !== 'lease'"> {{ val }} </label>
                  </div>
                  <div class="strAP" v-for="(val2, name2) in elem.lease" :key="name2">
                    <label v-if="name2 !== 'hostname'"> {{ val2 }}</label>
                    <label v-if="name2 == 'hostname' && elem.lease.hostname != ''"> {{ val2 }}</label>
                    <label v-if="name2 == 'hostname' && elem.lease.hostname == ''"> noname </label>
                  </div> 
                </div>
              </div>
          </div>
        </div>
        <div v-else>
          <p class="nodata"> Данных {{ param }} нет. </p>
        </div>
      </div>
    </div>
  </div>
</div>

</template>

<script>
import NotAuth from '@/components/NotAuth.vue';

export default {
  props: ['monitoring'],
  components: {
    NotAuth,
  },
  data() {
    return {
      user: "",
    };
  },
  mounted() { 
    console.log(this.monitoring.wifi);
    setInterval(() => {
      this.user = localStorage.user;
    }, 1000);
  },
  methods: {
  },
}
</script>

<style scoped>
.home_wifi {
  width: 100%;
  margin: 0 0 -50px 0;
  text-align: center;
}
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}
h1 {
  color: #EFA53D;
  margin-top: 0;
} 
.wrap_ap {
  margin-top: 50px;
}
.blockk {
  display: flex;
  flex-direction: column;
  margin: 0 5%;
  box-shadow: 0 5px 19px rgb(0 0 0 / 20%);
  border-radius: 15px;
  padding: 10px 30px;
}
.block_adhoc {
  width: max-content;
}
.block_ap {
  width: 60%;
}
.wrap_ap {
  margin-top: 50px;
}
.titles, .stolb {
  width: 100%;
  height: auto;
  display: grid;
  grid-template-columns: 16% 24% 10% 1px 13% 16% 1fr ;
  font-size: 22px;
  line-height: 1.5em;
}
.titles, thead {
  font-weight: bold;
  border-bottom: 5px solid #5e5e5e;
  padding-bottom: 3px;
}
td, th {
  min-width: 200px;
  font-size: 22px
}
.strAdHoc:nth-child(2n+1) {
  min-width: 200px;
}

.nodata {
  margin-top: 50px;
}
label {
  word-break: break-all;
}
@media screen and (max-width: 1400px) {
  .block_ap {
    width: 80%;
  }
}

@media screen and (max-width: 1030px) {
  .titles, .stolb {
    font-size: 20px;
  }
  td, th {
    min-width: 150px;
    font-size: 20px;
  }
  .block_ap {
    width: 85%;
  }
}
@media screen and (max-width: 820px) {
  .titles, .stolb {
    grid-template-columns: 82px 28% 10% 1px 13% 120px 1fr ;
  }
}

@media screen and (max-width: 760px) {
  .titles, .stolb {
    grid-template-columns: 71px 27% 10% 1px 14% 101px 1fr;
    font-size: 17px;
  }
  h1 {
    font-size: 1.6em;
  }
  .strAdHoc:nth-child(2n+1) {
    min-width: 120px;
  }
}

@media screen and (max-width:580px) {
  .titles, .stolb {
    grid-template-columns: 50px 27% 10% 1px 17% 74px 1fr;
    font-size: 14px;
  }
  .blockk {
    margin: 0;
    padding: 10px 14px;
  }
  .block_ap {
    width: 86%;
  }
  td, th {
    font-size: 18px
  }
}

@media screen and (max-width: 490px) {
  .titles, .stolb {
    grid-template-columns: 50px 18% 10% 1px 17% 74px 1fr;
  }
  .strAdHoc:nth-child(2n+1) {
    min-width: 80px;
  }
}

@media screen and (max-width: 415px) {
  .titles, .stolb {
    grid-template-columns: 40px 18% 10% 1px 17% 67px 1fr;
    font-size: 12px;
  }
  td, th {
    font-size: 14px
  }
  .strAdHoc:nth-child(2n+1) {
    min-width: 60px;
  }
}

@media screen and (max-width: 365px) {
  .titles, .stolb {
    font-size: 11px;
  }
  h1 {
    font-size: 1.2em;
  }
  .strAdHoc:nth-child(2n) {
    min-width: 120px;
  }
  td, th {
    font-size: 13px
  }
}

</style>