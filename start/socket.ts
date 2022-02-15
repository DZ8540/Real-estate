import WebSocketService from 'App/Services/WebSocketService'

WebSocketService.boot()

/**
 * Listen for incoming socket connections
 */
WebSocketService.io.on('connection', (socket) => {

})
