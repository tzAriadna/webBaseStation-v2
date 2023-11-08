<template>
<NotAuth v-if="!this.user || this.user == 'guest'"></NotAuth>
<div class="dataRoute wrap" v-if="this.user && this.user != 'guest'">
    <h1 class="title">Управление конвейером с помощью сухого контакта</h1>

    <div class="block_setting">
      <div class="wrapp_h1"><h1>Настройки конвейера</h1></div>
      <div class="table table_setting" v-if="this.dataConfig !== ''">
        <div class="dataSett dataSettControl">
          <label for='checkBox'>Управление конвейером:</label>
          <input type="checkbox" name="checkBox" :checked='this.dataConfig.enable' v-model="this.newEnable" @change="changeAny()">
        </div>
        <div class="dataSett" id="dataSettAllowed">
          <label for='checkBox'>Разрешена остановка конвейера:</label>
          <input type="checkbox" name="checkBox" :checked='this.dataConfig.stop_enable' v-model="this.newStopEnable" @change="changeAny()">
        </div>
        <div class="dataSett" id="dataSettAddress">
          <label class="ipBSNames" for='checkBox'>Адрес управляющей БС:</label>
          <div class="ipBS" id="ipBS_old">
              <label class="newMaster" v-if="this.wasChangedIP == 'false'">{{ this.newMaster }}</label>
              <label v-else>{{  this.newIP }}</label>
            <img class="pencilEdit" @click="clickPencil()" style="width: 20px;" src="../assets/edit.svg" alt="" >  
          </div>
          <div class="ipBS" id="ipBS_new">
            <input 
              id="enterValueID"
              class='enterValue' 
              pattern="(25[0-4]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)"            
              >
            <button class="btnEdit" @click="clickOk()">ok</button>
            <button class="btnEdit btnEditCancel" @click="clickCancel()"><img style="width: 20px;" src="../assets/cancel.svg" alt="" >  </button>
          </div>
        </div>
      </div>
      <p class="table table_setting" v-else>данные не получены. Ошибка...</p>
    </div>

    <div class="btn_settings" style="display: flex;">
      <button class="btnForInterface" id="acceptSettings" @click="acceptSettings()">
        <span class="textForBtn" id="textForBtn1"> Применить</span>
        <img class="loaderForBtn" id="loaderForBtn1" src="../assets/load.svg" alt="" style="display:none;">
        <img class="okForBtn" id="okForBtn1" src="../assets/ok.svg" alt="" style="display:none;">
        <img class="notOkForBtn" id="notOkForBtn1" src="../assets/notOk.svg" alt="" style="display:none">
      </button>
      <button class="btnForInterface" id="saveSettings" @click="saveSettings()">
        <span class="textForBtn" id="textForBtn2">Сохранить</span>
        <img class="loaderForBtn" id="loaderForBtn2" src="../assets/load.svg" alt="" style="display:none;">
        <img class="okForBtn" id="okForBtn2" src="../assets/ok.svg" alt="" style="display:none;">
        <img class="notOkForBtn" id="notOkForBtn2" src="../assets/notOk.svg" alt="" style="display:none">
      </button>
    </div>

    <div class="block_conv" v-if="this.monitoring.sbgps">
        <div class="www">
            <label>status</label>
            <div>
                <div v-if="this.monitoring.sbgps.dry.status == true" class="load"></div>
                <div v-if="this.monitoring.sbgps.dry.status == false" class="load load_red"></div>
            </div>
        </div>

        <h3>Конфигурация</h3>
        <div class="www" v-for = "(el, name) in this.monitoring.sbgps.dry.config" :key="name">
            <label v-if="el !== 'null'">{{ name }}</label>
            <div v-if="el == true || el == false">
                <!-- <div v-if="el == true" class="load"></div>
                <div v-if="el == false" class="load load_red"></div> -->
                <div v-if="el == true">Вкл</div>
                <div v-if="el == false">Выкл</div>
            </div>
            <span v-else v-if="el !== 'null'">{{  el }}</span>
        </div>

        <h3>Текущие нарушения</h3>
        <div>
            <table class='table_conv' v-if="this.monitoring.sbgps.dry.breaches.length !== 0">
              <tr class="hTable" > 
                <th class="number">№</th>
                <th >source</th>
                <th >age, сек</th>
                <th >mac</th>
              </tr>
              <tr v-for = "(el, index) in this.monitoring.sbgps.dry.breaches" :key="index">
                <td class="number">{{ index + 1 }}</td>
                <td >{{ el.source }}</td>
                <td >{{ el.age }}</td>
                <td >{{ el.mac }} </td>
              </tr>
            </table>
            <p v-else> Нет текущих данных</p>
        </div>
        

        <h3>Архив нарушений</h3>
        <div >
          <table class='table_conv' v-if="this.monitoring.sbgps.dry.breaches_expired.length !== 0">
              <tr class="hTable">
                <th class="number">№</th>
                <th >source</th>
                <th >mac</th>
              </tr>
              <tr v-for = "(el, index) in this.monitoring.sbgps.dry.breaches_expired" :key="index">
                <td class="number">{{ index + 1 }}</td>
                <td >{{ el.source }}</td>
                <td >{{ el.mac }} </td>
              </tr>
          </table>
          <p v-else> Архив нарушений пуст</p>
        </div>
    </div>
   
</div>
</template>


<script>
  import axios from 'axios'; 
  import NotAuth from '@/components/NotAuth.vue';
  const urlHostName = window.location.hostname;

export default {
  props: ['monitoring'],
  components: {
    NotAuth,
  },
  data() {
    return {
      user: "",
      dataConfig: "",
      newIP: '',
      newEnable: '',
      newStopEnable: '',
      newMaster: '',
      wasChangedIP: 'false',
    };
  },
  mounted() { 
    this.responseGet();
    setInterval(() => {
      this.user = localStorage.user;
    }, 1000);
  },
  updated: function(){
    this.displayData();
  },
  methods: {
    responseGet() {
      axios.get(`http://${urlHostName}:80/sbgps/dry/config`, {
        headers: { 
            'Authorization': `${localStorage.access_token}`,
            'Content-Type': 'application/json'
          }, 
      })
      .then(response => {
        console.log(response.data);
        this.dataConfig = response.data;
        console.log(this.dataConfig);
        this.newEnable = this.dataConfig.enable;
        this.newStopEnable = this.dataConfig.stop_enable;
        if (this.dataConfig.master == null || this.dataConfig.master == '' || this.dataConfig.master == 'underfined') {
          this.newMaster = 'ip-адрес не задан';
        } else {
          this.newMaster = this.dataConfig.master
        }
      })
      .catch ((err) => {
        console.log(err);
        this.funcError();
      });
    },
    clickPencil() {
      const input = document.getElementById('enterValueID');
      const ipBS_new_js = document.getElementById('ipBS_new');
      const ipBS_old_js = document.getElementById('ipBS_old');
      if (this.wasChangedIP == 'true') {
        input.value = this.newIP;
        if (this.newIP == 'ip-адрес не задан') {input.value = ''}
      } else {
        if (this.dataConfig.master == "null") {
          input.value = '';
        } else {
          input.value = this.dataConfig.master;
        }
      }
      ipBS_new_js.style.display = 'flex';
      ipBS_old_js.style.display = 'none';
    },
    clickOk() {
      const input = document.getElementById('enterValueID');
      console.log("vallll" + input.value);
      const regexp = /(25[0-4]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/;
      if (regexp.test(input.value)) {
        this.wasChangedIP = 'true';
        const ipBS_new_js = document.getElementById('ipBS_new');
        const ipBS_old_js = document.getElementById('ipBS_old');
        ipBS_new_js.style.display = 'none';
        ipBS_old_js.style.display = 'inline';
        
        this.newIP = input.value;
      } else {
        console.log('valll2')
        alert('введите корректный ip-адрес')
      }
      
    },
    clickCancel() {
      const ipBS_new_js = document.getElementById('ipBS_new');
      const ipBS_old_js = document.getElementById('ipBS_old');
      ipBS_new_js.style.display = 'none';
      ipBS_old_js.style.display = 'inline';
      this.wasChangedIP = 'true';
      this.newIP = 'ip-адрес не задан';
    },
    // при изменении настроек кнопка "применить" разблок-ся
    changeAny() {
      console.log('внесены изменения');
    },
    //если упарвление конвейером - выкл., то не отображаются след (нижние) настройки
    displayData() {
      const dataSettAllowed_js = document.getElementById('dataSettAllowed');
      const dataSettAddress_js = document.getElementById('dataSettAddress');

      if (this.newEnable == true) {
        dataSettAllowed_js.style.display = 'grid';
        if (this.newStopEnable == false) {
          dataSettAddress_js.style.display = 'grid';
        } else {
          dataSettAddress_js.style.display = 'none';
        }
      } else if (this.newEnable == false) {
        dataSettAllowed_js.style.display = 'none';
        dataSettAddress_js.style.display = 'none';
      }
    },

      /** Oтображение анимации "загрузка" при нажатии на кнопки */
    loaderForButtons (buttonId, loaderId, textId) {
      const btnAni = document.getElementById(buttonId);
      const loader = document.getElementById(loaderId);
      const textBtn = document.getElementById(textId);
      
      btnAni.disabled = true;
      textBtn.style.display = 'none';
      btnAni.classList.toggle("loadButton");
      loader.style.display = 'inline';
    },

    /** Отображение "галочки" или "крестика" после "загрузки", в зависимости от полученных параметров */
    okOrNotForButtons (buttonId, loaderId, okOrNot, textId) {
      const btnAni = document.getElementById(buttonId);
      const loader = document.getElementById(loaderId);
      const okOrNotLoad = document.getElementById(okOrNot);
      const textBtn = document.getElementById(textId);
      
      /** через 1 секунду отобразится "галочка" или "крестик" */
      setTimeout(() => {
        loader.style.display = 'none';
        okOrNotLoad.style.display = 'inline';
      }, 1000)
      
      /** через 2 секунды вернется надпись внутри кнопки */
      setTimeout(() => {
        okOrNotLoad.style.display = 'none';
        btnAni.classList.toggle("loadButton");
        textBtn.style.display = 'inline';
        btnAni.disabled = false;
      }, 2000)
    },

    //функция при нажатии на кнопку "применить"
    acceptSettings() {
      let masterText = '';
      if (this.wasChangedIP == 'true') {
        masterText = this.newIP;
        console.log(masterText)
      }
      if (this.wasChangedIP == 'false') {
        masterText = this.dataConfig.master;
        console.log(masterText);
      }
      //если остановка конвейера не разрешена, то в пост-запросе отправляется json без 'master'
      let newSettingsMassive = '';
      if (this.newStopEnable == true || this.newIP == 'ip-адрес не задан') {
        newSettingsMassive = `{"enable":${this.newEnable},"stop_enable":${this.newStopEnable} }`;
      } else {
        newSettingsMassive = `{"enable":${this.newEnable},"stop_enable":${this.newStopEnable},"master": "${masterText}" }`;
      }
      
      console.log('Новые параметры:  ' + newSettingsMassive);
      const newSettingObject =  JSON.parse(newSettingsMassive);
      console.log(newSettingObject);

      let arrForLoad = { 
        buttonId: 'acceptSettings',
        loaderId: 'loaderForBtn1',
        textId: 'textForBtn1',
        ok: 'okForBtn1',
        notOk: 'notOkForBtn1',
      }
      let confirmAccept = confirm( 'Применить настройки?' );
      if ( confirmAccept ) {
        this.loaderForButtons(arrForLoad.buttonId, arrForLoad.loaderId, arrForLoad.textId);
        let arrResponse = {
          method: `post`, 
          url: `http://${urlHostName}:80/sbgps/dry`,  
          headers: { 
            'Authorization': `${localStorage.access_token}`,
            'Content-Type': 'application/json'
          }, 
          data: newSettingObject
        }
        this.responseForBtn(arrForLoad, arrResponse);
      }
    },
     
    //функция при нажатии на кнопку "сохранить"
    saveSettings() {
      let arrForLoad = {
        buttonId: 'saveSettings',
        loaderId: 'loaderForBtn2',
        textId: 'textForBtn2',
        ok: 'okForBtn2',
        notOk: 'notOkForBtn2',
      }
      let confirmSave = confirm( 'Сохранить настройки?' );
      if ( confirmSave ) {
        this.loaderForButtons(arrForLoad.buttonId, arrForLoad.loaderId, arrForLoad.textId);
        let arrResponse = {
          method: `get`, 
          url: `http://${urlHostName}:80/sbgps/dry/confirm`,  
          // headers: { 'Authorization': `${localStorage.access_token}` },
        }
        this.responseForBtn(arrForLoad, arrResponse);
      }
    },

    
    responseForBtn(arrForLoad, arrResponse) {
      axios( arrResponse 
      ).then(response => {
        if (response) { 
          this.okOrNotForButtons(arrForLoad.buttonId, arrForLoad.loaderId, arrForLoad.ok, arrForLoad.textId); 
          console.log('Успешно');   
          const saveSettings_js = document.getElementById('saveSettings');
          saveSettings_js.disabled = false;         
        }
        console.log(response);
        
      }).catch ((err) => {
        console.log(err);
        this.okOrNotForButtons(arrForLoad.buttonId, arrForLoad.loaderId, arrForLoad.notOk, arrForLoad.textId);
        if (arrResponse.method = 'post') {
          this.responseGet();
        }
      });
    },
    
    funcError() {
      console.log('выполняется повторный запрос')
      //повторный запрос через 1сек
      setTimeout(() => {
        axios.get(`http://${urlHostName}:80/sbgps/dry/config`)
        .then(response => {
          this.dataConfig = response.data;
        })
        .catch ((err) => {
          console.log(err);
        });
      }, 1000)
    },
  },
}
</script>

<style scoped>
#ipBS_new {
  display: none;
}
.dataRoute {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title {
  margin-top: 0;
  color: #EFA53D;
  width: 70%;
}
h3 {
  line-height: 1em;
  padding: 10px 0;
  margin: 5px 0;
  color: #EFA53D;
  background-color: #7d7d7d;
}
.block_setting, .block_conv {
  display: flex;
  flex-direction: column;
  box-shadow: 0 5px 19px rgb(0 0 0 / 20%);
  border-radius: 15px;
  padding: 10px 30px;
  width: 600px;
  font-size: 22px;
}
.block_conv {
  margin-top: 40px;
}
label {
  word-break: break-all;
}
.table_conv {
  width: 100%;
}
.www {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  font-size: 22px;
  line-height: 1.3em;
  padding: 0 5px 5px 5px;
}
.number {
  display: block;
}

                              /* настройки */

.wrapp_h1 {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 5px 0px;
  margin: -16px 0;
  font-weight: bold;
}
.wrapp_h1 h1 {
  font-size: 29px;
  color: #EFA53D;
}
.table_setting {
  padding: 15px 0;
  border-top: 5px solid #5e5e5e;
}
.dataSett{
  display: grid;
  grid-template-columns: 64% 36%;
  padding: 3px 0;
  align-items: center;
}
.btnEdit{
  width: 25px;
  height: 25px;
  justify-self: center;
  align-self: center;
  background: #c2c2c2;
}
.btnEditCancel {
  padding: 0;
}
input {
  height: 15px;
}
.pencilEdit, .btnEdit {
  margin-left: 5px;
}

                                        /* кнопки */
.btnForInterface {
  margin: 40px 20px 10px 20px;
  width: 260px;
  height: 64px;
  background: #6a6a6a;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 40px;
  border: 0;
  font-size: 23px;
  color: #fff;
  box-shadow: 2px 5px 19px rgb(255 255 255 / 20%);
  border: 1px solid #3e3e3e;
}
.btn_settings {
  flex-direction: row;
}
.enterValue {
  width: 120px;
  height: 30px;
  background: #8C8C8C;
  border: 1px solid #C2C2C2;
  border-radius: 10px;
  text-align: center;
  margin: 4px;
}
.enterValue:hover {
  box-shadow: 0.5px 0.5px 5px 0.1px white;
  outline: none;
}
.enterValue:focus {
  box-shadow: 0.5px 0.5px 5px 0.1px white;
  outline: none;
}
.enterValue:invalid {
  box-shadow: 0.5px 0.5px 5px 0.1px red;
  border: 1px solid red;
  content: 'Invalid';
}
.btnForInterface:hover {
  box-shadow: 0.5px 0.5px 5px 0.5px white;
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
 .loadButton {
  width: 64px;
 }
 .btnForInterface:disabled {
  opacity: 0.5;
 }
 .ipBSNames {
  margin-bottom: 0;
 }

@media screen and (max-width: 759px) {
  .block_setting, .block_conv {
    width: 70%;
  }
  .enterValue {
    width: 110px;
  }
}

@media screen and (max-width: 650px) {
  .block_setting, .block_conv, .www {
    font-size: 17px;
  }
  .title, .wrapp_h1 h1 {
    font-size: 25px;
  }
  .btn_settings {
    flex-direction: column;
  }
  .btnForInterface {
    margin: 30px 20px -10px 20px;
  }
  .dataSett {
    grid-template-columns: 55% 45%;
  }
}
@media screen  and (max-width: 530px ) {
  .dataSett {
    grid-template-columns: 1fr;
    justify-items: center;
  }
  .ipBSNames {
    margin-bottom: 5px;
  }
}

@media screen and (max-width: 428px) {
  .title, .wrapp_h1 h1 {
    font-size: 20px;
  }
  .block_setting, .block_conv, .www {
    font-size: 16px;
  }
  
  .block_setting, .block_conv {
    padding: 10px 20px;
    width: 79%;
  }
  .btnForInterface {
    width: 192px;
    height: 52px;
    font-size: 17px;
  }
  .table_setting {
    padding: 6px 0;
  }
  .wrapp_h1 {
    margin: -14px 0 -10px;
  }
}

@media screen and (max-width: 375px) {
  .title {
    width: 90%;
  }
  .number {
    display: none;
  }
}

</style>
