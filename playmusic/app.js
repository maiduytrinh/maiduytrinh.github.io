const $$ = document.querySelectorAll.bind(document)
const $ = document.querySelector.bind(document)
const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const playlist = $('.playlist')
const cd = $('.cd')
const heading = $('header h2')
const img = $('.cd-thumb')
const audio = $('#audio')
const play = $('.player')
const btnplay = $('.btn-toggle-play')
const range = $('#progress')
const btnnext = $('.btn-next')
const btnprev = $('.btn-prev')
const btnRandom = $('.btn-random')
const btnRepeat = $('.btn-repeat')
const app = {
  isPlaying: false,
  currentIndex: 0,
  isRandom: false,
  isRepeat: false,
  songsPlayed: [],
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setConfig: function (key, value) {
    this.config[key] = value
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
  },
  songs: [
    {
      name: 'Sang Xịn Mịn',
      singer: '16 Typh',
      path: './music/SangXinMin.mp3',
      image: './img/SangXinMin.jpg',
    },
    {
      name: 'Đường Tôi Chở Em Về',
      singer: 'Bui Truong Linh',
      path: './music/DuongToiChoEmVe.mp3',
      image: './img/DuongToiChoEmVe.jpg',
    },
    {
      name: 'Trốn Tìm',
      singer: 'Đen Vâu',
      path: './music/TronTim.mp3',
      image: './img/TronTim.jpg',
    },
    {
      name: 'Hết Nhạc Con Về',
      singer: 'RZ Mas',
      path: './music/HetNhacConVe.mp3',
      image: './img/HetNhacConVe.jpg',
    },
    {
      name: 'Người Chơi Hệ Đẹp',
      singer: '16 Typh',
      path: './music/NguoiChoiHeDep.mp3',
      image: './img/NguoiChoiHeDep.jpg',
    },
    {
      name: 'Nevada',
      singer: 'Vicetone',
      path: './music/Nevada.mp3',
      image: './img/Nevada.jpg',
    },
    {
      name: 'Light It Up',
      singer: 'Robin Hustin x TobiMorrow',
      path: './music/LightItUp.mp3',
      image: './img/LightItUp.jpg',
    },
    {
      name: 'Yoru ni kakeru',
      singer: 'YOASOBI',
      path: './music/YoruNiKakeru.mp3',
      image: './img/YoruNiKakeru.png',
    },
    {
      name: 'Muộn rồi mà sao còn',
      singer: 'Sơn Tùng M-TP',
      path: './music/MuonRoiMaSaoCon.mp3',
      image: './img/MuonRoiMaSaoCon.jpg',
    },
    {
      name: 'See You Again',
      singer: 'Charlie Puth ft Wiz Khalifa',
      path: './music/SeeYouAgain.mp3',
      image: './img/SeeYouAgain.jpg',
    },

    {
      name: 'Symphony',
      singer: 'Clean Bandit',
      path: './music/Symphony.mp3',
      image: './img/Symphony.jpg',
    },
    {
      name: 'Waiting For Love',
      singer: 'Avicii',
      path: './music/WaitingForLove.mp3',
      image: './img/WaitingForLove.jpg',
    },
    {
      name: 'Alone',
      singer: 'Marshmello',
      path: './music/Alone.mp3',
      image: './img/Alone.jpg',
    },
    {
      name: 'Something Just Like This',
      singer: 'The Chainsmokers & Coldplay',
      path: './music/SomethingJustLikeThis.mp3',
      image: './img/SomethingJustLikeThis.jpg',
    },
    {
      name: 'Sugar',
      singer: 'Maroon 5',
      path: './music/Sugar.mp3',
      image: './img/Sugar.jpg',
    },
    

  ],

  definePropertys: function () {
    Object.defineProperty(this, 'currentSong', {
      get() {
        return this.songs[this.currentIndex]
      }
    })
  },

  render: function () {
    const html = this.songs.map((song, index) => {
      return `
      <div class="song" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}');"></div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`
    })
    playlist.innerHTML = html.join('')
  },

  handleEvent: function () {
    //xu ly CD
    const cdWidth = cd.offsetWidth
    document.onscroll = function() {
      const scrollY = document.documentElement.scrollTop || window.scrollY
      const newcdWidth = cdWidth - scrollY
      cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0
      cd.style.opacity = newcdWidth / cdWidth
    }

    //xu ly Click play
    btnplay.onclick = function(){
      if(app.isPlaying){
        audio.pause()
      }else{
        audio.play()
      }
    }
    audio.onplay = function () {
      app.isPlaying = true
      play.classList.add('playing')
      cdThumb.play()
    }
    audio.onpause = function () {
      app.isPlaying = false
      play.classList.remove('playing')
      cdThumb.pause()
    } 

    //xu ly thanh chay
    audio.ontimeupdate = function() {
      if(audio.duration) {
        const rangeTime = Math.floor(audio.currentTime / audio.duration * 100)
        range.value = rangeTime
      }
    }
    
    //xu ly tua
    range.oninput = function () {
      audio.currentTime = Math.floor(this.value * audio.duration / 100)
      audio.play()
    }

    //anh quay
    const cdThumb = cd.animate({
      transform: 'rotate(360deg)'
    },{
      duration: 10000,
      iterations: Infinity,
    })
    cdThumb.pause()

    //xu ly next
    btnnext.onclick = function() {
      if(app.isRandom) {
        app.loadRandomSong()
      }else {
        app.nextSong()
      }
      audio.play()
      app.scrollActiveSong()
    }

    //xu ly prev
    btnprev.onclick = function() {
      if(app.isRandom) {
        app.loadRandomSong()
      }else {
        app.prevSong()
      }
      audio.play()
      app.scrollActiveSong()
    }

    //xu ly random
    btnRandom.onclick = function() {
      app.isRandom = !app.isRandom
      app.setConfig('isRandom', app.isRandom)
      if(app.isRandom) {
        this.classList.add("active")
      }else {
        this.classList.remove("active")
        app.songsPlayed = []
      }
    }

    //xu ly repeat
    btnRepeat.onclick = function() {
      app.isRepeat = !app.isRepeat
      app.setConfig('isRepeat', app.isRepeat)
      this.classList.toggle('active', app.isRepeat)
    }

    //xu ly ended
    audio.onended = function() {
      if (app.isRepeat) {
        audio.play()
      }else {
        btnnext.click()
      }
    }

    //xu ly click playlist
    playlist.onclick = function(e) {
      const songNode = e.target.closest('.song:not(.active)')
      if(songNode && !e.target.closest('.option')) {
        if(songNode) {
          app.currentIndex = songNode.dataset.index
          app.loadCurrentSong()
          audio.play()
        }
      }
      if(e.target.closest('.option')){
        console.log(e.target.closest('.option'))
      }
    }

  },

  nextSong: function () {
      this.currentIndex++
      if(this.currentIndex >= this.songs.length) {
        this.currentIndex = 0
      }
      this.loadCurrentSong()
  },

  prevSong: function () {
    this.currentIndex --
      if(this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1
      }
      this.loadCurrentSong()
  },

  loadConfig: function () {
    this.isRandom = this.config.isRandom
    this.isRepeat = this.config.isRepeat
    this.currentIndex = this.config.currentIndex

  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name
    img.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
    //load playlist
    const isActive = $('.song.active')
    if (isActive) {
      isActive.classList.remove('active')
    }
    const listSong = $$('.song')
    listSong[this.currentIndex].classList.add('active')
    app.setConfig('currentIndex', Number(app.currentIndex))
  },

  loadRandomSong: function () {
    let newIndex 
    const lenghtList = this.songs.length
    const newLength = this.songsPlayed.push(this.currentIndex)
    console.log(this.songsPlayed)
    if (newLength == lenghtList) {
      this.songsPlayed = []
    }
    do {
      newIndex = Math.floor(Math.random() * lenghtList)
    }while(this.songsPlayed.includes(newIndex))
    this.currentIndex = newIndex
    this.loadCurrentSong()
  },

  scrollActiveSong: function() {
    setTimeout(() => {
      if (this.currentIndex <= 3) {
        $('.song.active').scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        })
      }else {
        $('.song.active').scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      }
      
    }, 300)
  },

  start: function () {
    this.definePropertys()
    this.render()
    this.handleEvent()
    this.loadConfig()
    this.loadCurrentSong()
    btnRandom.classList.toggle('active', app.isRandom)
    btnRepeat.classList.toggle('active', app.isRepeat)
  },
}
app.start()

