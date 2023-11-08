<template>
  <div class="home_auth">
    <div class="auth" @keyup.enter="authSession()">
    <h1>АВТОРИЗАЦИЯ</h1>
    <div class="groupForAuth">
    <label for="">Логин</label>
    <input id="loginInput" class="inputForAuth" type="text" v-model='login'>
    </div>
    <div class="groupForAuth">
    <label for="">Пароль</label>
    <input id="passwordInput" class="inputForAuth" type="password" v-model='password'>
    </div>
    <button id="enterButtonn" class="enterButton" :class="{ 'loaderButton' : isLoaderButton }" @click="authSession()">
      <span id="textBtnAuth">ВОЙТИ</span>
      <img id="loaderForBtnAuth" src="@/assets/load.svg" alt="загрузка..." style="display:none;">
      <img id="okForBtnAuth" src="@/assets/ok.svg" alt="Oк" style="display:none;">
      <img id="notOkForBtnAuth" src="@/assets/notOk.svg" alt="Ошибка" style="display:none;">
    </button>
    <label class="atempts" v-if="defendCounter === true" for="" style="color: red;">Превышено количество попыток ввода пароля</label>
    <button @click="guestSession()" style="color: #91BBFF; background:0; border:0;">Продолжить как гость</button>
  </div>
  </div>
</template>

<script>
let timeToBlock = 0;

export default {
  data() {
    return {
      defendCounter: false,
      isLoaderButton: false,
      tokenAuth: [],
      login: '',
      password: ''
    }
  },
  methods: {
    guestSession() {
      window.location.href = '/';
    },


    authSession() {
      const enterButton = document.getElementById('enterButtonn');
      const loader = document.getElementById('loaderForBtnAuth');
      const okLoad = document.getElementById('okForBtnAuth');
      const notOkLoad = document.getElementById('notOkForBtnAuth');
      const textBtn = document.getElementById('textBtnAuth');
      // load \\
      enterButton.disabled = true;
      textBtn.style.display = 'none';
      this.isLoaderButton = !this.isLoaderButton;
      loader.style.display = 'inline';

      this.$emit('login', {
        username: this.login,
        password: this.password
      })


      setTimeout(() => {
        if (localStorage.status == 'true') {
          localStorage.user = 'admin';
          loader.style.display = 'none';
          okLoad.style.display = 'inline'; 

          setTimeout(() => {
            okLoad.style.display = 'none';
            this.isLoaderButton = !this.isLoaderButton;
            textBtn.style.display = 'inline';
            enterButton.disabled = false;
            console.log('Welcome Administrator!');
            window.location.href = '/';
          }, 1000);

        } else {
          console.log('hf,jnftn')
          if (localStorage.status == 'false') {
            // console.log('222')
            timeToBlock = timeToBlock + 100;
            console.log(timeToBlock);
            loader.style.display = 'none';
            notOkLoad.style.display = 'inline';

            setTimeout(() => {
              notOkLoad.style.display = 'none';
              this.isLoaderButton = !this.isLoaderButton;
              textBtn.style.display = 'inline';
              enterButton.disabled = false;
            }, 1000);
          }
        }
      }, 2000);

      if (timeToBlock == 300) {
        while (timeToBlock != 0) {
          enterButton.disabled = true;
          this.defendCounter = true;
          timeToBlock -= 10;
        }
      }
      
    }
  },
}

</script>

<style>
  .home_auth {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .auth {
    color: #EFA53D;
    background: #646464;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    border-radius: 10px;
    box-shadow: 0 5px 19px rgb(0 0 0 / 20%);
    width: 450px;
    height: 400px;
  }

  .groupForAuth {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
  }

  .inputForAuth {
    background: #8C8C8C;
    border-radius: 4px;
    border: 1px solid #C2C2C2;
    width: 244px;
    height: 27px;
    margin-top: 3px;
  }
  .enterButton {
    background: #616161;
    border: 1px solid #8C8C8C;
    box-shadow: 0 1px 2px 0.84px ;
    border-radius: 10px;
    width: 250px;
    height: 36px;
    cursor: pointer;
    background-repeat: no-repeat;
    background-position: center;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    transition-duration: 0.3s;
  }
  .atempts {
    text-align: center;
  }
  #loaderForBtnAuth {
    width: 60px;
  }
  #notOkForBtnAuth {
    padding: 5px 0 0 5px;
  }
  .enterButton.loaderButton {
    width: 64px;
    height: 64px;
    border-radius: 10px;
  }
  .enterButton:hover {
    background: #6d6d6d;
  }
  #loginInput:hover, #passwordInput:hover {
    box-shadow: 0.5px 0.5px 5px 0.1px white;
    outline: none;
  }
  #loginInput:focus, #passwordInput:focus {
    box-shadow: 0.5px 0.5px 5px 0.1px white;
    outline: none;
  }

  @media screen and (max-width: 520px) {
    .auth {
      width: 340px;
      height: 320px;
    }
    h1 {
      font-size: 25px;
    }
    .inputForAuth {
      width: 220px;
    }
    .enterButton {
      width: 227px;
    }
  }
  @media screen and (max-width: 428px) {
    .auth {
      width: 300px;
      margin-top: 35px;
    }
    h1 {
      font-size: 21px;
    }
    .groupForAuth {
      font-size: 16px;
    }
  }
  @media screen and (max-width: 370px) {
    .auth {
      width: 260px;
      height: 300px;
    }
    .inputForAuth {
      width: 180px;
    }
    .enterButton {
      width: 183px;
    }
    .enterButton.loaderButton {
      width: 50px;
      height: 50px;
      border-radius: 8px;
    } 
  }
</style>
