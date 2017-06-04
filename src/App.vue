<template>
  <div id="app">
    <h2>command: {{command}}</h2>
    <p>listenning: {{listenning}}</p>
    <p>orientation: {{alpha}}, {{beta}}, {{gamma}}</p>
    <button :class="{'listenning':listenning}"
            @touchstart="start"
            @touchend="stop">
      start
    </button>
    <div class="mask"></div>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data(){
      return {
        socket: null,
        //是否监听
        listenning: false,
        // orient alpha
        alpha: 0,
        // orient beta
        beta: 0,
        // orient gamma
        gamma: 0
      }
    },
    computed: {
      command(){
        let {beta, gamma, listenning} = this
        let command = 'forward'

        if (!listenning) {
          return 'stop'
        }

        if (gamma >= 20) {
          command = 'right'
        } else if (gamma <= -20) {
          command = 'left'
        } else if (beta >= 20) {
          command = 'backward'
        } else if (beta <= -20) {
          command = 'forward'
        } else {
          command = 'standby'
        }

        return command
      }
    },
    created(){
      let socket = io()
      this.socket = socket

      this.socket.emit('ready')
    },
    methods: {
      start(){
        this.listenning = true
        this.socket && this.socket.emit('engine', 'on')
        this.listen()
      },
      stop(){
        this.listenning = false
        this.socket && this.socket.emit('engine', 'off')
        this.stopListen()
      },
      emit({alpha, beta, gamma}){
        let _this = this

        if (_this.timer) {
          return
        }

        _this.timer = window.setTimeout(() => {
          _this.timer = null
          _this.alpha = parseInt(alpha)
          _this.beta = parseInt(beta)
          _this.gamma = parseInt(gamma)

          _this.socket && _this.socket.emit('command', _this.command)
        }, 200)
      },
      listen(){
        window.addEventListener('deviceorientation', this.emit, false)
      },
      stopListen(){
        window.removeEventListener('deviceorientation', this.emit)
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    user-select: none;
    font-size: 20px;
    line-height: 1.2;
  }

  p {
    margin: 0;
  }

  button {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 100px;
    height: 100px;
    margin-left: -50px;
    margin-top: -50px;
    border-radius: 50px;
    font-size: 20px;
    border: 5px solid #999;
    background-color: rgba(255, 255, 0, .6);
    z-index: 100;
  }

  .mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .2);
  }

  .listenning {
    background: rgba(0, 255, 0, .6);
  }
</style>
