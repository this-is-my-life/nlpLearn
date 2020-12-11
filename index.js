const { NlpManager } = require('node-nlp')

const manager = new NlpManager({ languages: ['ko'], forceNER: true })
manager.addDocument('ko', '안녕', 'greetings.hello')
manager.addAnswer('ko', 'greetings.hello', '그래 안녕')

main()
async function main () {
  await manager.train()
  manager.save()
  const res = await manager.process('ko', '안녕하세요')
  console.log(res)
}
