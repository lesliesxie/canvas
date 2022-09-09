(function () {
  var dt = {
    init() {
      this.bigImg = document.querySelector('.bigImg img')
      this.textWrap = document.querySelector('.bigImg .text')
      this.text = ''
      this.textColor = ''
      this.textSize = 30
      this.tab()
      this.edit()
      this.drag(this.bigImg)
      this.download()
      this.upload()
    },
    tab() {
      var lis = document.querySelectorAll('.tool li')
      this.last = lis[0]
      lis.forEach(li => li.onclick = () => {
        this.last.className = ''
        li.className = 'active'
        this.bigImg.src = li.children[0].src
        this.bigImg.style.left = this.bigImg.style.top = 'auto'
        this.last = li
      })
    },
    edit() {
      var input = document.querySelector('.edit > input')
      input.oninput = () => this.textWrap.innerHTML = this.text = input.value
      var number = document.querySelector('.fontStyle input')
      number.onchange = () => {
        this.textWrap.style.fontSize = number.value + 'px'
        this.textSize = number.value
      }
      Colorpicker.create({
        el: 'colorPick',
        color: '#000',
        change: (ele, color) => ele.style.background = this.textWrap.style.color = this.textColor = color
      })
      this.drag(this.textWrap)
    },
    drag(obj) {
      var startX = 0,//按下时鼠标的坐标
          startY = 0,
          startL = 0,//按下时元素的位置
          startT = 0,
          curX = 0,//元素要走到的位置
          curY = 0
      obj.onmousedown = e => {
        startX = e.clientX
        startY = e.clientY
        startL = obj.offsetLeft
        startT = obj.offsetTop
        var maxWidth = obj.parentNode.clientWidth - obj.offsetWidth
        var maxHeight = obj.parentNode.clientHeight - obj.offsetHeight
        document.onmousemove = e => {
          curX = e.clientX - startX + startL
          curY = e.clientY - startY + startT
          if(curX < 0) {
            curX = 0
          }
          if(curX >= maxWidth) {
            curX = maxWidth
          }
          if(curY < 0) {
            curY = 0
          }
          if(curY >= maxHeight) {
            curY = maxHeight
          }
          obj.style.left = curX + 'px'
          obj.style.top = curY + 'px'
          e.preventDefault()
        }
        document.onmouseup = () => document.onmousemove = null
      }
    },
    draw(cb) {
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      canvas.width = 500
      canvas.height = 500
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      var img = new Image()
      img.src = this.bigImg.src
      img.onload = () => {
        var imgX = parseFloat(getComputedStyle(this.bigImg).left)
        var imgY = parseFloat(getComputedStyle(this.bigImg).top)
        var textX = parseFloat(getComputedStyle(this.textWrap).left)
        var textY = parseFloat(getComputedStyle(this.textWrap).top)
        ctx.drawImage(img, imgX, imgY)
        ctx.font = `bold ${this.textSize}px Microsoft YaHei`
        ctx.fillStyle = this.textColor
        ctx.textBaseline = 'top'
        ctx.fillText(this.text, textX, textY + 5)
        ctx.font = `14px Microsoft YaHei`
        ctx.fillStyle = '#000'
        ctx.fillText('leslie', 420, 480)
        cb(canvas.toDataURL())//把canvas导出成一张图片，返回一个base64
      }
    },
    download() {
      var downBtn = document.querySelector('.downBtn')
      downBtn.onclick = () => {
        var a = document.createElement('a')
        a.style.display = 'none'
        a.download = 'dt'//下载图片的名字
        document.body.appendChild(a)
        this.draw(url => {
          a.href = url
          a.click()//主动触发a标签的点击事件
          document.body.removeChild(a)
        })
      }
    },
    upload() {
      var btn = document.querySelector('.upBtn')
      var input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/png, image/gif, image/jpeg'
      input.style.display = 'none'
      btn.onclick = () => {
        document.body.appendChild(input)
        input.click()
      }
      input.onchange = (e) => {
        var file = e.target.files[0]
        var fr = new FileReader()
        fr.readAsDataURL(file)
        fr.onload = (e) => {
          this.bigImg.src = e.target.result
          this.bigImg.style.left = this.bigImg.style.top = 'auto'
          this.last.className = ''
          document.body.removeChild(input)
        } 
      }
    }
  }
  dt.init()
})()