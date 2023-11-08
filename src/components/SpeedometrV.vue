<template>
<div class="wrap_speed">
    <svg viewBox="-250 -250 500 250" width="180" color="red">
      <!-- <g class="figure" transform="rotate(-90)"> -->
      <g class="figure" >
        <circle r="20" cy="-20" />
        <path d="M-20,-20 0,-150 20,-20" />
      </g>

      <g class="scale">
        <circle class="circle" r="200" cx="0" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="6.3 43" />
        <circle r="210" cx="0" fill="none" stroke-width="10" stroke="#000"/>
        <!-- <circle r="210" cx="0" fill="none" stroke-width="10" stroke-dasharray="220 600" stroke-dashoffset="-300" /> -->
        <!-- <circle r="210" cx="0" fill="none" stroke-width="10" stroke-dasharray="220 600" stroke-dashoffset="-80" /> -->
      </g>

      <g class="data">
        <path d="m-220 0 a120 -120 0 0 1 440 0" fill="none" stroke="blue" stroke-width="0" id="path" />
        <text dx="10">
          <textPath href="#path">0</textPath>
        </text>
        <text dx="65">
          <textPath href="#path">5</textPath>
        </text>
        <text dx="120">
          <textPath href="#path">10</textPath>
        </text>
        <text dx="175">
          <textPath href="#path">15</textPath>
        </text>
        <text dx="230">
          <textPath href="#path">20</textPath>
        </text>
        <text dx="285">
          <textPath href="#path">25</textPath>
        </text>
        <text dx="340">
          <textPath href="#path">30</textPath>
        </text>
        <text dx="395">
          <textPath href="#path">35</textPath>
        </text>
        <text dx="450">
          <textPath href="#path">40</textPath>
        </text>
        <text dx="505">
          <textPath href="#path">45</textPath>
        </text>
        <text dx="560">
          <textPath href="#path">50</textPath>
        </text>
        <text dx="615">
          <textPath href="#path">55</textPath>
        </text>
        <text dx="660">
          <textPath href="#path">60</textPath>
        </text>
      </g>
    </svg>

    <div id="num" text-anchor="middle" aligment-baseline="central" y="0">
      <span> {{ this.monitoringGalDgl.speed }} км/ч </span>
    </div>
    <!-- <input type="range" min="0" max="60" value={{this.speed}} id="range"  v-model="speed" @change="trans()"> -->

</div>
</template> 

<script>
const fig = document.getElementsByClassName('figure');

export default {
  props: ['monitoringGalDgl', 'speedExp'],
  data() {
    return {
      // speed: 0,
      degree: 0
    }
  },
  mounted() {
    setInterval( () => {
      // const param = this.monitoringGalDgl.speed;
      // console.log(param);
      // console.log(fig[0].style);
      this.degree = parseInt((180 * (Number(this.monitoringGalDgl.speed)) / 60) - 90 );
      fig[0].style.transform = `rotate(${this.degree}deg`;
    }, 500);
  },
  methods: {
  }
}
</script>

<style scoped>
.wrap_speed {
  margin: 5px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.circle {
  stroke-dasharray: 6.3 43;
}
input {
  opacity: .2;
} 
.figure {
  transform-origin: 0 -20px;
  transition: 0.34s ease;
  transform: rotate(-90deg);
}
#num {
  transition: 0.34s linear;
  border-bottom: 2px solid #efa53d;
  width: max-content;
  justify-self: center;
  text-align: center;
  padding-top: 3px;
  color: #efa53d;
  color: #000;
  font-size: 20px;
  margin-top: 10px;
}
.data text {
  font-size: 30px;
  font-family: sans-serif;
}
</style>