import { Socket } from 'net'
import PromiseSocket from 'promise-socket'

import { NowsysNmdData, NowsysNmdDataParser } from './nowsys-nmd-parser'

const debug = require('debug')('aidoop:nowsys-nmd-client')

export class NowsysNmdClient {
  public socket
  public serverIp
  public serverPort
  public weight: NowsysNmdData | null
  private _parser: NowsysNmdDataParser

  constructor(serverIp, serverPort) {
    this.socket
    this.serverIp = serverIp
    this.serverPort = serverPort

    this._parser = new NowsysNmdDataParser()
  }

  async connect() {
    const socket = new Socket()
    socket.setKeepAlive(true, 60000)

    socket.on('end', () => {
      debug('disconnected')
    })

    socket.on('error', err => {
      debug(`error: ${err.message}`)
    })

    this.socket = new PromiseSocket(socket)

    await this.socket.connect(this.serverPort, this.serverIp)

    debug(`Connect: Server IP (${this.serverIp})`)
  }

  disconnect() {
    this.socket && this.socket.destroy()
    this.socket = null
  }

  shutdown() {
    this.disconnect()
  }

  async _sendMessage(buf, size?) {
    await this.socket.write(buf, size || buf.length)
  }

  async _recvMessage() {
    var message = await this.socket.read()
    if (!message) {
      console.error('socker closed')
      throw new Error('socket closed')
    }
    return message
  }

  sendReqStatus() {
    let reqBuf = this._parser.prepareReqStatus()
    this._sendMessage(reqBuf)
  }

  async recieveRes() {
    let recvData = await this._recvMessage()
    return this._parser.parseResStatus(recvData)
  }
}
