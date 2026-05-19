const express = require('express')
const mineflayer = require('mineflayer')

const app = express()

app.use(express.json())

let bot = null
let mode = 'AFK'

function startBot() {

  if(bot) return

  bot = mineflayer.createBot({
    host: 'play.simplecraft.fr',
    username: process.env.MICROSOFT_EMAIL,
    auth: 'microsoft',
    version: false
  })

  bot.on('spawn', () => {

    console.log('Bot connecté')

    setTimeout(() => {
      bot.chat('/login Ultrayar')
    }, 3000)

    setTimeout(() => {
      bot.chat('/home')
    }, 6000)

    antiAfk()

  })

  bot.on('messagestr', (msg) => {
    console.log(msg)
  })

  bot.on('end', () => {
    console.log('Bot déconnecté')
    bot = null
  })

}

function antiAfk() {

  setInterval(() => {

    if(!bot) return

    if(mode === 'AFK' || mode === 'FARM') {

      bot.setControlState('jump', true)

      setTimeout(() => {
        if(bot) bot.setControlState('jump', false)
      }, 500)

      bot.look(
        Math.random() * Math.PI * 2,
        Math.random() * 0.5
      )

    }

  }, 30000)

}

function stopBot() {

  if(!bot) return

  bot.quit()
  bot = null

}

app.get('/', (req, res) => {
  res.send('Bot online')
})

app.post('/start', (req, res) => {

  startBot()

  res.send('Bot démarré')

})

app.post('/stop', (req, res) => {

  stopBot()

  res.send('Bot arrêté')

})

app.post('/mode', (req, res) => {

  mode = req.body.mode

  console.log('Mode:', mode)

  res.send('Mode changé')

})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log('Serveur lancé')
})
