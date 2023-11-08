<template>
  <div class="block_firmware">
    <div class="wrap_h1"><h1>Обновление прошивки</h1> </div>
                  <!-- softConf -->
    <div class="table">
      <div v-for="(value, name) in this.monitoring.softConf" :key="name">
        <div v-if="value !== null" class="dataWs dataWs_border">
          <label>{{ name }}</label>
          <span v-if="(name !== 'Доступно обновление')">{{ value }}</span>
        </div>
      </div>
      <div class="dataWs dataWs_border" v-for="(value, name) in this.monitoring.softConf['Доступно обновление']" :key="name">
          <label>{{ name }}</label>
          <span>{{ value }}</span>
      </div>
    </div>


    <div class="container">
      <div >
        <label>Выберите файл: </label>
        <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
      </div>
      <div class="btns dataWs">
        <button id="sendFile" @click="sendFile()">
          <span id="text_btn">Отправить</span>
          <img  id="loader_btn" src="../assets/load.svg" alt="" style="display:none;">
          <img id="ok_btn" src="../assets/ok.svg" alt="" style="display:none;">
          <img id="notOk_btn" src="../assets/notOk.svg" alt="" style="display:none">
        </button>
        <button id="submitFile" @click="submitFile()">
          <span id="text_btn2">Обновить</span>
          <img id="loader_btn2" src="../assets/load.svg" alt="" style="display:none;">
          <img id="ok_btn2" src="../assets/ok.svg" alt="" style="display:none;">
          <img id="notOk_btn2" src="../assets/notOk.svg" alt="" style="display:none">
        </button>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios'; 
const urlHostName = window.location.hostname;

export default {
  props: ['monitoring'],
  data(){
    return {
      file: '',
      theFileSent: false
    }
  },
  methods: {
    sendFile(){
      if (this.file == '') {
        alert('Файл не выбран!')
      } else {

        let arrForLoad = {
          buttonId: 'sendFile',
          loaderId: 'loader_btn',
          textId: 'text_btn',
          ok: 'ok_btn',
          notOk: 'notOk_btn',
        }
        this.loaderForButtons(arrForLoad.buttonId, arrForLoad.loaderId, arrForLoad.textId);


        let formData = new FormData();
        formData.append('file', this.file);
        let arrResponse = {
          method: `post`, 
          url: `http://${urlHostName}:80/firmware/upload`, 
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `${localStorage.access_token}`
          } ,
          data: formData
        }
        this.responseForBtn(arrForLoad, arrResponse);
      }
    },

    submitFile(){
      let arrForLoad = {
        buttonId: 'submitFile',
        loaderId: 'loader_btn2',
        textId: 'text_btn2',
        ok: 'ok_btn2',
        notOk: 'notOk_btn2',
      }
      this.loaderForButtons(arrForLoad.buttonId, arrForLoad.loaderId, arrForLoad.textId);

      let arrResponse = {
        method: `post`, 
        url: `http://${urlHostName}:80/firmware/update`, 
        headers: {
          'Authorization': `${localStorage.access_token}`
        }
      }
      this.responseForBtn(arrForLoad, arrResponse);
    },

    handleFileUpload(){
      this.file = this.$refs.file.files[0];
    },

    loaderForButtons (buttonId, loaderId, textId) {
      const btnAni = document.getElementById(buttonId);
      const loader = document.getElementById(loaderId);
      const textBtn = document.getElementById(textId);
      
      btnAni.disabled = true;
      textBtn.style.display = 'none';
      btnAni.classList.toggle("loadBtn");
      loader.style.display = 'inline';
    },

    okOrNotForButtons (buttonId, loaderId, okOrNot, textId) {
      const btnAni = document.getElementById(buttonId);
      const loader = document.getElementById(loaderId);
      const okOrNotLoad = document.getElementById(okOrNot);
      const textBtn = document.getElementById(textId);
      
      /** через 1 секунду отобразится "галочка" или "крестик" */
      setTimeout(() => {
        loader.style.display = 'none';
        okOrNotLoad.style.display = 'inline';
      }, 2000)
      
      /** через 2 секунды вернется надпись внутри кнопки */
      setTimeout(() => {
        okOrNotLoad.style.display = 'none';
        btnAni.classList.toggle("loadBtn");
        textBtn.style.display = 'inline';
        btnAni.disabled = false;
      }, 3000)
    },

    responseForBtn(arrForLoad, arrResponse) {
      axios( arrResponse 
      ).then(response => {
        console.log(response);
        if (response.data == true) { 
          this.okOrNotForButtons(arrForLoad.buttonId, arrForLoad.loaderId, arrForLoad.ok, arrForLoad.textId); 
        } else {
          this.okOrNotForButtons(arrForLoad.buttonId, arrForLoad.loaderId, arrForLoad.notOk, arrForLoad.textId); 
        }
      }).catch ((err) => {
        console.log(err);
        this.okOrNotForButtons(arrForLoad.buttonId, arrForLoad.loaderId, arrForLoad.notOk, arrForLoad.textId); 
      });
    },
    
  }
}
</script>

<style scoped>
.table {
  border-top: 4px solid #5e5e5e;
  width: 100%;
  padding: 7px 0 0 0;
}
.dataWs {
  /* display: flex;
  justify-content: space-between;
  flex-direction: row; */
  font-size: 19px;
  line-height: 1.4em;
  display: grid;
  grid-template-columns: 50% 50%;
}
.dataWs label {
  text-align: left;
} 
.dataWs span {
  text-align: right;
}
/* .dataWs_border {
  border-bottom: 1px dashed rgba(94, 94, 94, 0.7);
} */
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
  font-weight: bold;
  /* text-shadow: 6px 6px 4px rgba(0,0,0,0.2); */
  margin: 3px;
}
.container {
  border-top: 4px solid #5e5e5e;
  display: flex;
  flex-direction: column;
  height: 100%;
  
  justify-content: space-around;
  width: 100%;
}
.container div {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
#file {
  width: 48%;
}
.block_firmware {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  border-radius: 15px;
  padding: 10px 30px;
  margin: 25px 0;
  border: 4px solid #646464;
}

button {
  margin: 10px 1px 0 0;
  padding: 10px 20px;
  color: #fff;
  font-size: 14px;
  background: #b38a4f;
  border: 1px solid #646464;
  width: 120px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  cursor: pointer;
  transition-duration: 0.1s;
  position: relative;
}
button:active {
  background: #ac844c;
}

.loadBtn {
  width: 40px;
}
#loader_btn, #loader_btn2 {
  width: 3em;
}
#notOk_btn, #notOk_btn2 {
  width: 30em;
  padding: 2px 0 0 2px;
}

@media screen and (max-width: 570px) {
  .wrap_h1 h1 {
    font-size: 25px;
  }
}

@media screen and (max-width: 428px) {
  .block_firmware {
    width: 258px;
    padding: 10px 20px;
    border: 3px solid #646464;
  }
  .dataWs {
    font-size: 16px;
  }
  button {
    width: 100px;
  }
  .wrap_h1 h1 {
    font-size: 22px;
  }
}
@media screen and (max-width: 375px) {
  .block_firmware {
    padding: 10px 15px;
  }
  .wrap_h1 h1 {
    font-size: 20px;
  }
}
</style>