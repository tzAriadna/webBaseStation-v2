<template>
  <div id="warningForGuest">
    <h1 class='warningForGuest'>ПОЖАЛУЙСТА ПРОЙДИТЕ АВТОРИЗАЦИЮ.</h1>
    <h1 class='warningForGuest'>ВАШ УРОВЕНЬ ДОСТУПА ОГРАНИЧЕН!</h1>
  </div>
</template>

<script>
export default {
  
}
</script>

<style scoped>
  .warningForGuest {
    color: #F0AA00;
  }
  #warningForGuest {
    display: flex;
    flex-direction: column;
    align-content: space-around;
    align-items: center;
    margin-top: 70px;
    padding: 0;
  }
  @media screen and (max-width: 450px) {
    #warningForGuest {
      padding: 0 9%;
    }
  }
  @media screen and (max-width: 375px) {
    #warningForGuest {
      padding: 0 9%;
      font-size: 14px;
    }
  }
</style>