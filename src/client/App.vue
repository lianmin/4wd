<template>
  <div id="app">
    <h2>command: {{command}}</h2>
    <p>orientation: {{alpha}},{{beta}}, {{gamma}}</p>
    <button :class="{'listenning':listenning}"
            @touchstart="start"
            @touchend="stop">
      start
    </button>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data(){
      return {
        socket: io(),
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

        if (beta > 30) {
          command = 'right'
        } else if (beta <= -30) {
          command = 'left'
        } else if (gamma > 30) {
          command = 'forward'
        } else if (gamma < -30) {
          command = 'backward'
        }

        return command
      }
    },
    created(){
      let _this = this
    },
    methods: {
      start(){
        this.listenning = true
        this.listen()
      },
      stop(){
        this.listenning = false
        this.stopListen()
      },
      emit({alpha, beta, gamma}){
        let _this = this

        if (_this.timer) {
          return
        }

        _this.timer = window.setTimeout(() => {
          _this.socket.emit('orient', `${_this.alpha},${_this.beta},${_this.gamma}`)

          _this.alpha = parseInt(alpha)
          _this.beta = parseInt(beta)
          _this.gamma = parseInt(gamma)

          this.socket.emit('start', this.command)

          _this.timer = null
        }, 200)
      },
      listen(){
        window.addEventListener('deviceorientation', this.emit, false);
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
    font-size: 40px;
  }

  button {
    position: fixed;
    right: 50px;
    bottom: 50px;
    width: 100px;
    height: 100px;
    border-radius: 50px;
  }

  .listenning {
    background: green;
  }
</style>
