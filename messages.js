import {WebSocketServer} from 'ws'
import Message from "./model.js"

export default class Messages {

    constructor(){
        this.startWebSocketServer()
    }

    async startWebSocketServer() {

        this.wss = new WebSocketServer({port: process.env.WEBSOCKET_SERVER_PORT})

        this.wss.on('connection', async connection => {

            Message.findAll({raw:true}).then(messages => {
                connection.send(JSON.stringify(messages))
            }).catch(err => console.log(err))

            connection.on('message', async res => {
                const data = JSON.parse(res.toString())

                    Message.create(data).then(res => {

                        Message.findAll({raw:true}).then(messages => {

                            this.wss.clients.forEach(client => {
                                client.send(JSON.stringify(messages))
                            })

                        }).catch(err => console.log(err))

                    }).catch(err => console.log(err))

            })
        })
    }
}

