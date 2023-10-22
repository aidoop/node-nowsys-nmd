const { NowsysNmdClient } = require('@things-factory/node-nowsys-nmd')
const { sleep } = require('../build/utils')

;(async function () {
  var client = new NowsysNmdClient('127.0.0.1', 8000)
  await client.connect()

  for (let idx = 0; idx < 10000000; idx++) {
    await client.sendReqStatus()
    let resData = await client.recieveRes()
    await sleep(1000)
    console.log('resData: ', resData)
  }

  client.disconnect()
  console.log('disconnected')
})()
