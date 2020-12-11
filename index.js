const knex = require('knex')
const { Client } = require('discord.js')
const { Query } = require('./classes')
const { NlpManager } = require('node-nlp')
const { generate: randstr } = require('randomstring')

const manager = new NlpManager({ languages: ['ko'], forceNER: true })
const client = new Client()

let count = 0

client.login(process.env.token)
client.on('ready', () => console.log(client.user.username + ' is online'))
client.on('message', async (msg) => {
  if (msg.author.bot) return
  if (!msg.content.startsWith('nlp.')) return

  const query = new Query(msg.content)
  switch (query.command) {
    case 'add': {
      const m = await msg.channel.send('전처리중...')
      await manager.train()

      m.edit('받을 말 (`~라고 물어보면`) 입력')
      const from = await msg.channel.awaitMessages((m2) => m2.author.id === msg.author.id, { max: 1 })
      if (!from.first()) return
      
      m.edit('중복 확인중....')
      const res = count ? await manager.process('ko', from.first().content) : { intent: 'None' }

      m.edit('고유 id 생성')
      const id = res.intent === 'None' ?  ('nlp.' + randstr(30)) : res.intent

      m.edit('보낼 말 (`~라고 대답하기`) 입력')
      const to = await msg.channel.awaitMessages((m2) => m2.author.id === msg.author.id, { max: 1 })
      if (!to.first()) return

      m.edit('후처리중...')
      if (res.intent === 'None') manager.addDocument('ko', from.first().content, id)
      manager.addAnswer('ko', id, to.first().content)
      await manager.train()
      manager.save()
      count++

      m.delete()
      m.channel.send('완료')
      break
    }
    
    default: {
      const res = await manager.process('ko', query.content)
      msg.channel.send(res.answer || '데이터없음')
      break
    }
  }
})
