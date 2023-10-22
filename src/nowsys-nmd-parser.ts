export interface NowsysNmdData {
  productNumber: number
  status: number
  productionQuantity: number
  detectionQuantity: number
}

export class NowsysNmdDataParser {
  private productNumber = 0
  private status = 0
  private productionQuantity: number = 0
  private detectionQuantity: number = 0

  constructor() {}

  convertDataToWord(data: Buffer): number {
    if (data.length !== 2) {
      throw new Error('data length must be 2')
    }
    return data[0] * 256 + data[1]
  }

  convertDataToInt(data: Buffer): number {
    if (data.length !== 4) {
      throw new Error('data length must be 2')
    }
    return data[0] * 256 * 256 * 256 + data[1] * 256 * 256 + data[2] * 256 + data[3]
  }

  // packet: 0x02 0x00 0x06 0x33 0x03 0x34
  prepareReqStatus(): Buffer {
    let buf = Buffer.alloc(6)
    buf[0] = 0x02
    buf[1] = 0x00
    buf[2] = 0x06
    buf[3] = 0x33
    buf[4] = 0x03
    buf[5] = 0x34
    return buf
  }

  parseResStatus(data: Buffer): NowsysNmdData | null {
    let foundAvailPacket: boolean = true

    // check stx and length
    if (data.length < 6) {
      throw new Error('data length is greater than 6')
    }

    let packetLen = this.convertDataToWord(data.subarray(1, 3))
    if (data[0] != 0x02 && data.length != packetLen) {
      throw new Error('packet is not formatted correctly')
    }

    let packetCmd = data[3]

    if (packetCmd == 0x35) {
      let packetData = data.subarray(4, data.length - 2)

      this.productNumber = packetData[0]
      this.status = packetData[1]
      this.productionQuantity = this.convertDataToInt(packetData.subarray(6, 10))
      this.detectionQuantity = this.convertDataToWord(packetData.subarray(10, 12))
    } else {
      throw new Error('invalid packet command')
    }

    return {
      productNumber: this.productNumber,
      status: this.status,
      productionQuantity: this.productionQuantity,
      detectionQuantity: this.detectionQuantity
    }
  }
}
