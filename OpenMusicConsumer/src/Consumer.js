require('dotenv').config()

const amqp = require('amqplib')

const OpenMusicPlaylistService = require('./OpenMusicPlaylistService')
const MailSender = require('./MailSender')
const Listener = require('./Listener')

const init = async () => {
  const openMusicPlaylistService = new OpenMusicPlaylistService()
  const mailSender = new MailSender()
  const listener = new Listener(openMusicPlaylistService, mailSender)

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER)
  const channel = await connection.createChannel()

  await channel.assertQueue('export:playlistOpenMusic', {
    durable: true
  })

  channel.consume('export:playlistOpenMusic', listener.listen, { noAck: true })
}

init()
