<template>
<div class="home_adminPage">
  <SettingWidget :connect="connect" @forms = "lockForms"/>
  <div class="adminSettings">

    <Firmware :monitoring="monitoring"/>

    <div class="block_buttons">
      <button class="btnForInterface" id="rebootBs" @click="rebootBs()">
        <span class="textForBtn" id="textForBtn">Перезагрузить устройство</span>
        <img class="loaderForBtn" id="loaderForBtn" src="../assets/load.svg" alt="" style="display:none;">
        <img class="okForBtn" id="okForBtn" src="../assets/ok.svg" alt="" style="display:none;">
        <img class="notOkForBtn" id="notOkForBtn" src="../assets/notOk.svg" alt="" style="display:none">
      </button>
      <Speedometr/>
    </div>

    

  </div>


</div>
</template>

<script>
import router from '@/router/index.js'
import Firmware from '@/components/Firmware.vue' 
import SettingWidget from './SettingWidget.vue';

export default {
  props: ['warning', 'monitoring', 'connect'],
  components: { Firmware, SettingWidget },
  data() {
    return {
      speed: 0,
      maxSpeed: 200,
    }
  },
  mounted() {
    setInterval( () => {
      if ( localStorage.user == 'guest'  || !localStorage.user ) {
        router.push({name: 'Authorization'});
        this.$emit('func');
      }
    }, 1000);
  },
  methods: {
    loaderForButtons(buttonId, loaderId, okId, notOkId, textId) {
      const btnAni = document.getElementById(buttonId);
      const loader = document.getElementById(loaderId);
      const okLoad = document.getElementById(okId);
      const notOkLoad = document.getElementById(notOkId);
      const textBtn = document.getElementById(textId);

      btnAni.disabled = true;
      textBtn.style.display = "none";
      btnAni.classList.toggle("loadButton");
      loader.style.display = "inline";

      setTimeout(() => {
        if ( this.warning.name == 'RebootOk' || this.warning.name == 'PowerOffOk') {
          console.log('reboot okkkkkk')
          setTimeout(() => {
            btnAni.classList.toggle("loadButtonOk");
            loader.style.display = "none";
            okLoad.style.display = "inline";
          }, 1000);
          this.funcReturn(okLoad, btnAni, textBtn);
        } else {
          if ( this.warning.name == 'RebootErr' || this.warning.name == 'PowerOffErr' || !this.warning.name) {
            console.log('reboot errrrrr')
            setTimeout(() => {
              btnAni.classList.toggle("loadButtonOk");
              loader.style.display = "none";
              notOkLoad.style.display = "inline";
            }, 2000);
            this.funcReturn(notOkLoad, btnAni, textBtn);
          }
        }
      }, 1000);
      console.log(this.warning);
    },

    funcReturn(okOrNot, btnAni, textBtn) {
      setTimeout(() => {
        btnAni.classList.toggle("loadButtonOk");
        okOrNot.style.display = "none";
        btnAni.classList.toggle("loadButton");
        textBtn.style.display = "inline";
        btnAni.disabled = false;
      }, 4000);
    },
    rebootBs() {
      let confirmReboot = confirm( 'Перезагрузить устройство?' );
      if ( confirmReboot ) {
        let buttonId = "rebootBs";
        let loaderId = "loaderForBtn";
        let okId = "okForBtn";
        let notOkId = "notOkForBtn";
        let textId = "textForBtn";
        this.loaderForButtons(buttonId, loaderId, okId, notOkId, textId);
        this.$emit('buttons', {
          func: 'reboot',
        })
      }
    },

    powerOff() {
      let confirmPowerOff = confirm( 'Выключить устройство?' );
      if ( confirmPowerOff ) {
        let buttonId = "powerOff";
        let loaderId = "loaderForBtn2";
        let okId = "okForBtn2";
        let notOkId = "notOkForBtn2";
        let textId = "textForBtn2";
        this.loaderForButtons(buttonId, loaderId, okId, notOkId, textId);
        this.$emit('buttons', {
          func: 'powerOff',
        })
      }
    },

    lockForms (params) {
      this.$emit('forms', params)
    }
  },

}
</script>

<style scoped>
.adminSettings {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.block_buttons {
  display: flex;
  flex-direction: row;
  justify-items: center;
  align-items: center;
}
.btnForInterface {
  margin: 30px;
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
.loadButton {
  width: 64px;
}
.loadButtonOk {
  padding: 5px 0 0 5px;
}
.chatWS {
  height: max-content;
  padding: 35px;
  border: 1px solid;
  box-shadow: 0 5px 19px rgb(0 0 0 / 20%);
  border-radius: 15px;
  border: 1px solid #646464;
}
.wrap_send, .wrap_answer {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
}
h1 {
  color: #EFA53D;
  line-height: .2em;
}
.input {
  padding: 20px;
  width: 90%;
  background: #959595;
  border: 1px solid #959595;
  font-size: 16px;
  border-radius: 6px;
}
.btn_chat {
  width: max-content;
  justify-self: end;
  align-self: end;
  margin: 10px 0;
  width: 80px;
  height: 25px;
  box-shadow: 0 5px 4px #747474;
}

.answer {
  border: 1px dashed #c7c7c7;
  width: 400px;
  height: 300px;
  background: #959595;
  border-radius: 6px;
}
.input:hover, .input:active {
  border: 2px solid white;
  outline: none;
}
.btnForInterface:hover {
  box-shadow: 0.5px 0.5px 5px 0.5px white;
}

@media screen and (max-width: 900px) {
  .btnForInterface {
    margin: 10px;
  }
}

@media screen and (max-width: 570px) {
  .btnForInterface {
    width: 310px;
    font-size: 17px;
  }
}

@media screen and (max-width: 428px) {
  .btnForInterface {
    width: 240px;
    height: 56px;
    font-size: 17px;
    margin: 5px;
  }
}

@media screen and (max-width: 375px) {
  .btnForInterface {
    width: 230px;
    font-size: 16px;
  }
}
</style>