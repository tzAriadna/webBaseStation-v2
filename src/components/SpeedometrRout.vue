<template>
  <div class="wrap_speed">
      <svg viewBox="-250 -250 500 250" width="180" color="red">
        <g class="figureRout" transform="rotate(-90)">
          <circle r="20" cy="-20" />
          <path d="M-20,-20 0,-150 20,-20" />
        </g>
  
        <g class="scale">
          <circle class="circle" r="200" cx="0" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="10 62" />
          <circle r="210" cx="0" fill="none" stroke-width="10" stroke="#000"/>
        </g>
  
        <g class="data">
          <path d="m-220 0 a120 -120 0 0 1 440 0" fill="none" stroke="blue" stroke-width="0" id="path" />
          <text dx="20">
            <textPath href="#path">0</textPath>
          </text>
          <text dx="90">
            <textPath href="#path">350</textPath>
          </text>
          <text dx="160">
            <textPath href="#path">700</textPath>
          </text>
          <text dx="235">
            <textPath href="#path">1050</textPath>
          </text>
          <text dx="315">
            <textPath href="#path">1400</textPath>
          </text>
          <text dx="395">
            <textPath href="#path">1750</textPath>
          </text>
          <text dx="475">
            <textPath href="#path">2100</textPath>
          </text>
          <text dx="550">
            <textPath href="#path">2450</textPath>
          </text>
          <text dx="625">
            <textPath href="#path">2800</textPath>
          </text>
        </g>
      </svg>
  
      <div id="num" text-anchor="middle" aligment-baseline="central" y="0">
        <span> {{ this.monitoringGalDgl.engine_rpm  }} об/с </span>
      </div>
  
  </div>
  
  </template> 
  
  <script>
  const fig = document.getElementsByClassName('figureRout');

  export default {
    props: ['monitoringGalDgl'],
    data() {
      return {
        degree: 0,
      }
    },
    mounted() {
      setInterval( () => {
        this.degree = parseInt((180 * (Number(this.monitoringGalDgl.engine_rpm)) / 2800) - 90 );
        fig[0].style.transform = `rotate(${this.degree}deg`;
      }, 500);
    },
  }
  </script>
  
  <style scoped>
  .wrap_speed {
    margin: 10px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .circle {
    stroke-dasharray: 10 62;
  }
  input {
    /* margin-top: 20px; */
    opacity: .2;
  } 
  .figureRout {
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