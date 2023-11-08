<template>

<div class="home_setting">

  <div class="wrap_settings">
    <div class="blockk block_wifi">
        <div class="wrapp_h1"><h1>Настройки сети</h1></div>
        <div class="block_tables" v-if="this.dataSettings.length !== 0">
      
          <table class="table tableNetwork">
            <thead>
              <tr class="caption">
                  <th colspan="2" >Название</th> <th colspan="2" >ip-aдрес</th>
              </tr>
            </thead>
            <tbody >
              <tr v-for="item in this.dataSettings.network" :key="item">
                  <td colspan="2" > 
                    <label class="portNameIp" for="ipValueForSettings" >{{ item.name }}</label>
                  </td> 
                  <td colspan="2" class="inputLine" v-for='items in item.ip_addr' :key="items">      
                    <input 
                      class="enterIp enterInput" 
                      name="ipValueForSettings" 
                      type="text" 
                      :value="items" 
                      pattern="(25[0-4]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/([8]|[1][6-9]|[2][0-9]|[3][0-2]))"
                    >
                  </td> 
              </tr>
            </tbody>
          </table>

          <table class="table tableAdditional">
            <thead>
              <tr class="caption">
                <th colspan="2">Название</th> <th colspan="2">Значение</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for='(value, name) in this.dataSettings.header' :key='value'>
                <td colspan="2"> 
                    <label class='netnumNames'>{{ name }}</label>
                </td>
                <td colspan="2"> 
                    <input 
                      class='enterValue enterInput' 
                      :value='value' 
                    />
                </td>
              </tr>
              <tr class="caption">
                <th colspan="2">Название</th> <th colspan="2">Вкл/Выкл</th>
              </tr>
              <tr v-for="gpio in dataSettings.gpio_power" :key="gpio">
                <td colspan="2"> 
                    <label class="gpioNames" for='checkBox'>{{ gpio.name }}</label>
                </td>
                <td colspan="2"> 
                    <input class="checkBoxValue enterInput" type="checkbox" name="checkBox" :checked='gpio.status' :id="gpio.name">
                </td>
              </tr>
              <tr v-for="(value, name) in this.dataSettings" :key="name">
                <td colspan="2" v-if="name == 'p_power'"> 
                    <label class="pPowerName" for='checkBox'>{{ name }}</label>
                </td>
                <td colspan="2" v-if="name == 'p_power'"> 
                    <input class="pPowerValue enterInput" type="checkbox" name="checkBox" :checked='value.status' :id="name">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <span class="table" v-else> Нет данных с сервера для настройки сети </span>
    </div>
  </div>
  


  <div class="btn_settings" style="display: flex;" v-if="this.dataSettings">
    <button class="btnForInterface" id="acceptSettings" @click="acceptSettings()">
      <span class="textForBtn" id="textForBtn1">Применить настройки</span>
      <img class="loaderForBtn" id="loaderForBtn1" src="../assets/load.svg" alt="" style="display:none;">
      <img class="okForBtn" id="okForBtn1" src="../assets/ok.svg" alt="" style="display:none;">
      <img class="notOkForBtn" id="notOkForBtn1" src="../assets/notOk.svg" alt="" style="display:none">
    </button>
    <button class="btnForInterface" id="saveSettings" @click="saveSettings()">
      <span class="textForBtn" id="textForBtn2">Сохранить настройки</span>
      <img class="loaderForBtn" id="loaderForBtn2" src="../assets/load.svg" alt="" style="display:none;">
      <img class="okForBtn" id="okForBtn2" src="../assets/ok.svg" alt="" style="display:none;">
      <img class="notOkForBtn" id="notOkForBtn2" src="../assets/notOk.svg" alt="" style="display:none">
    </button>
    <button class="btnForInterface" id="deinitialize" @click="deinitialize()">
      <span class="textForBtn" id="textForBtn3">Сбросить настройки</span>
      <img class="loaderForBtn" id="loaderForBtn3" src="../assets/load.svg" alt="" style="display:none;">
      <img class="okForBtn" id="okForBtn3" src="../assets/ok.svg" alt="" style="display:none;">
      <img class="notOkForBtn" id="notOkForBtn3" src="../assets/notOk.svg" alt="" style="display:none">
    </button>
  </div>

  <div class="warning">
    <p>
    </p>
  </div>

</div>
</template>

<script>
  import axios from 'axios'; 
  const urlHostName = window.location.hostname;
  import NotAuth from '@/components/NotAuth.vue';

  const ipValue = document.getElementsByClassName('enterIp');
  const commonValue = document.getElementsByClassName('enterInput');
  const portNameIp = document.getElementsByClassName('portNameIp');
  const warnElem = document.getElementsByClassName('warning');

  export default {
    props: ['connect'],
    components: {
      NotAuth
    },
    data() {
      return {
        user: '',
        dataSettings: {},
        flagConnect: ''
      }
    },

    mounted() {
      this.responseGet();
      this.checkConnection();
    },

    methods: {
      responseGet() {
        axios.get(`http://${urlHostName}:80/fcgi/get_settings` , {
          headers: {'Authorization': `${localStorage.access_token}`}
        }).then(response => {
          console.log(response.data);
          this.dataSettings = response.data;
        })
        .catch ((err) => {
          console.log(err);
          this.funcError();
        });
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

      acceptSettings() {
        const gpioNamesParams = document.getElementsByClassName('gpioNames');
        const pPowerParams = document.getElementsByClassName('pPowerName');
        const checkGpio = document.getElementsByClassName('checkBoxValue');
        const checkPower = document.getElementsByClassName('pPowerValue');
        const netnumNames = document.getElementsByClassName('netnumNames');
        const netnumValue = document.getElementsByClassName('enterValue');

        let n = 0;
        let portNames = [];
        let network = [];
        for (let i = 0; i<portNameIp.length;i++ ) {
          portNames.push( portNameIp[n].textContent );
          n++;
        }
        n = 0;
        for ( let i = 0; i<ipValue.length; i++ ) {
          network.push( `{"name":"${portNames[n]}","ip_addr":["${ipValue[n].value}"]}` );
          n++;
        }

        let gpioPower = [];
        n = 0;
        for ( let i = 0; i<gpioNamesParams.length;i++ ) {
          gpioPower.push( `{"status":${checkGpio[n].checked},"name":"${gpioNamesParams[n].textContent}"}` );
          n++;
        }
        
        let namesNetnum = [];
        let valueNetnum = [];
        n = 0
        for (let i = 0; i<netnumNames.length; i++) {
          namesNetnum.push(netnumNames[n].textContent);
          n++;
        }
        n = 0;
        for (let i = 0; i<netnumValue.length; i++) {
          valueNetnum.push(`"${namesNetnum[n]}":${netnumValue[n].value}`);
          n++
        }
        n=0;
        let pPower = [];
        for (let i = 0; i< pPowerParams.length; i++) {
          pPower.push(`"status":${checkPower[n].checked}`);
          n++
        }

        let newSettingsMassive = `{"header":{${valueNetnum}},"gpio_power":[${gpioPower}],"network":[${network}], "p_power": {${pPower}}}`;
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
            url: `http://${urlHostName}:80/fcgi/set_settings`,  
            headers: { 
              'Content-Type': 'application/json'
            }, 
            data: newSettingObject
          }
          this.responseForBtn(arrForLoad, arrResponse);
        }
      },

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
            url: `http://${urlHostName}:80/fcgi/save_settings`,  
          }
          this.responseForBtn(arrForLoad, arrResponse);
        }
      },

      deinitialize () {
        let arrForLoad = {
          buttonId: 'deinitialize',
          loaderId: 'loaderForBtn3',
          textId: 'textForBtn3',
          ok: 'okForBtn3',
          notOk: 'notOkForBtn3',
          warning: 'Подождите! Настройки сбрасываются!'
        }
        let confirmDeinitialize = confirm( 'Сбросить настройки?' );
        if ( confirmDeinitialize ) {
          this.loaderForButtons(arrForLoad.buttonId, arrForLoad.loaderId, arrForLoad.textId);
          let arrResponse = {
            method: `get`, 
            url: `http://${urlHostName}:80/fcgi/deinitialize`,  
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
            if (arrForLoad.warning) {
              setTimeout(() => {
                alert(arrForLoad.warning)
              }, 4000)
            }
          }
          console.log(response);
          warnElem[0].style.display = 'inline';
          warnElem[0].firstChild.innerHTML = response.data;
          setTimeout ( () => {
            warnElem[0].style.display = 'none';
            warnElem[0].firstChild.innerHTML = "";
          }, 4000)
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
          axios.get(`http://${urlHostName}:80/fcgi/get_settings` , {
            headers: {'Authorization': `${localStorage.access_token}`}
          }).then(response => {
            this.dataSettings = response.data;
          })
          .catch ((err) => {
            console.log(err);
          });
        }, 1000)
      },

      checkConnection() {
        setInterval (() => {
            this.$emit('forms', commonValue)
        }, 1000)
      },
    }
  }
</script>

<style scoped>
.home_setting {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
}
.wrap_settings {
  display: flex;
  justify-content: center;
  width: 100%;
}

.warning {
  display: none;
  width: 500px;
  height: 100px;
  border: 2px solid grey;
  position: fixed;
  top: 275px;
  font-size: 21px;
  background: #6a6a6a;
  line-height: 1.5em;
  font-weight: bold;
  padding: 0 20px;
}
.blockk {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: max-content;
  box-shadow: 0 5px 19px rgb(0 0 0 / 20%);
  border-radius: 15px;
  padding: 10px 30px;
  margin: 0 5%;
}
.wrapp_h1 {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 5px 0px;
  margin: -16px 0;
}
.wrapp_h1 h1 {
  color: #EFA53D;
  font-size: 29px;
  font-weight: bold;
}
.table {
  border-top: 5px solid #5e5e5e;
  width: 100%;
  padding: 15px 0;
}
.title {
  font-weight: 600;
  padding: 6px 20px;
}
.block_tables {
  display: flex;
  flex-direction: row;
}
.tableNetwork {
  border-right: 5px solid #5e5e5e;
  padding: 20px 20px 0 0;
}
.tableAdditional {
  padding-left: 20px;
}

.caption {
  font-family: Arial;
	font-size: 17px;
	font-weight: bold;
	color: #FFFFFF;

}

.settingsForIp, .netnumSettings, .gpioSettings {
  display:flex;
  justify-content: space-between;
  align-items:center;
  width:70%;
}

.btnForInterface {
  margin: 40px 20px 10px 20px;
  width: 324px;
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
.inputLine {
  display: flex;
  flex-direction: column;
}
.enterIp, .enterValue {
  width: 200px;
  height: 30px;
  background: #8C8C8C;
  border: 1px solid #C2C2C2;
  border-radius: 10px;
  text-align: center;
  margin: 4px;
}
.enterValue {
  width: 150px;
}
.enterIp:hover, .enterValue:hover {
  box-shadow: 0.5px 0.5px 10px 0.1px white;
  outline: none;
}
.enterIp:focus, .enterValue:focus {
  box-shadow: 0.5px 0.5px 10px 0.1px white;
  outline: none;
}
.enterIp:invalid, .enterValue:invalid {
  box-shadow: 0.5px 0.5px 10px 0.1px red;
  border: 1px solid red;
  content: 'Invalid Syntax';
}

 .btnForInterface:hover {
  box-shadow: 0.5px 0.5px 5px 0.5px white;
 }
 .loadButton {
  width: 64px;
 }

@media screen and (max-width: 1100px) {
  .btnForInterface {
    width: 260px;
  }
 }

@media screen and (max-width: 900px) {
  .btnForInterface {
    width: 324px;
    margin: 6px;
  }
  .btn_settings {
    flex-direction: column;
  }
  .wrap_settings{
    margin-bottom: 20px;
  }

}

@media screen and (max-width: 759px) {
  .enterIp, .enterValue {
    width: 140px;
    margin: 4px 0;
  }
  .enterValue {
    width: 80px;
  }
}

@media screen and (max-width: 570px) {
  .block_tables {
    flex-direction: column;
  }
  .wrapp_h1 h1 {
    font-size: 24px;
  }
  .tableNetwork, .tableAdditional {
    border-right: none;
    border-left: none;
    padding: 10px 5px;
  }
  .enterIp, .enterValue {
    width: 200px;
    margin: 4px;
  }
  .table {
    border-top: 4px solid #5e5e5e;
  }
  .btnForInterface {
    width: 310px;
    font-size: 17px;
  }
}

@media screen and (max-width: 428px) {
  .blockk {
    padding: 10px 25px;
  }
  .caption {
    font-size: 15px;
  }
  .enterIp, .enterValue {
    width: 155px;
    margin: 2px 0;
  }
  .tableNetwork, .tableAdditional {
    padding: 10px 0 10px 5px;
  }
  .btnForInterface {
    width: 240px;
    height: 50px;
    margin: 5px;
  }
}

@media screen and (max-width: 375px) {
  .blockk {
    padding: 10px 20px;
  }
  .enterIp, .enterValue {
    width: 140px;
  }
  .btnForInterface {
    width: 230px;
    font-size: 16px;
  }
}

</style>