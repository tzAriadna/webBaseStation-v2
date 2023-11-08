<template>
  <NotAuth v-if="!this.user || this.user == 'guest'"></NotAuth>
    <div class="dataRoute wrap" v-if="this.user && this.user != 'guest'">
        <h1>Таблица OSPF соседей</h1>
        <div class="block_ospf">
          <div class="titles">
            <div class="rty"><label>Router ID</label></div>
            <div class="rty"><label>Adj Address</label></div>
            <div class="rty"><label>Adj Interface</label></div>
          </div>
          <div class="stolb" v-if="dataOspf.length != 0" v-for="item in dataOspf" :key="item">
            <div class="rty" v-for="elem in item" :key="elem">
              <label> {{ elem }} </label>
            </div>
          </div>
          <p v-else>Данных о таблице OSPF нет.</p>
        </div>
    </div>

</template>

<script>
  import axios from 'axios'; 
  import NotAuth from '@/components/NotAuth.vue';
  const urlHostName = window.location.hostname;

    export default {
      components: {
        NotAuth,
      },
      data() {
        return {
          user: "",
          dataOspf: "",
      };
    },
    mounted() { 
      this.responseGet();
      setInterval(() => {
        this.user = localStorage.user;
      }, 1000);
    },
    methods: {
        responseGet() {
            axios.get(`http://${urlHostName}:80/fcgi/ospf_table_monitoring`)
            .then(response => {
            console.log(response.data);
            this.dataOspf = response.data;
            })
            .catch ((err) => {
            console.log(err);
            });
        },
    },
    }
</script>

<style scoped>
.dataRoute {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 6%;
}
h1 {
  color: #EFA53D;
}
.block_ospf {
  display: flex;
  flex-direction: column;
  box-shadow: 0 5px 19px rgb(0 0 0 / 20%);
  border-radius: 15px;
  padding: 10px 30px;
  width: 45%;
}
.titles, .stolb {
  width: 100%;
  height: auto;
  display: grid;
  grid-template-columns: 27% 31% 42%;
  grid-column-gap: 7px;
  font-size: 22px;
  line-height: 1.5em;
}
.titles {
  font-weight: bold;
  border-bottom: 5px solid #5e5e5e;
  padding-bottom: 3px;
}
label {
  word-break: break-all;
}

@media screen and (max-width: 1200px) {
  .block_ospf {
    width: 60%;
  }
}
@media screen and (max-width: 900px) {
  .block_ospf {
    width: 80%;
  }
}
@media screen and (max-width: 759px) {
  .titles, .stolb {
    font-size: 18px;
  }
  h1 {
    font-size: 1.6em;
  }
}
@media screen and (max-width: 560px) {
  .titles, .stolb {
    font-size: 15px;
  }
}
@media screen and (max-width: 428px) {
  h1 {
    font-size: 1.4em;
  }
  .titles, .stolb {
    font-size: 13px;
  }
  .block_ospf {
    margin: 0;
    padding: 10px 18px;
    width: 82%;
  }
}
@media screen and (max-width: 375px) {
  h1 {
    font-size: 1.2em;
  }
  .titles, .stolb {
    font-size: 11.4px;
  }
}
</style>
