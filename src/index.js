const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage,generateLocationMessage} = require('./utils/messages')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 5040
const publicDirectoryPath = path.join(__dirname, '../public')
const {addUsers,removeUsers,getUser,getUsers} = require('./utils/users')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

   // socket.emit('message', generateMessage("Welcome!!"))
   //socket.broadcast.emit('message', generateMessage('A new user has joined!'))
   
   
	
	socket.on('join',({username,room},callback)=>{
		
		const {error,user} = addUsers({id:socket.id,username,room})
		if(error){
			
				return callback(error)
			
		}
		
		socket.join(user.room)
		socket.emit('message', generateMessage(user.username,"Welcome!!"))
		socket.broadcast.to(user.room).emit('message', generateMessage(user.username+' has joined!'))
		io.to(user.room).emit('roomUserInfo',{
			
			room:user.room,
			users:getUsers(user.room)
			
		})
		callback()
		
	})

    socket.on('sendMessage', (message, callback) => {
		
		const user = getUser(socket.id)
		console.log(user)
        const filter = new Filter()

         if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(user.username,message))
        callback()
    })

    socket.on('sendLocation', (location, callback) => {
		
		
		const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username,"https://google.com/maps?q="+encodeURIComponent(location.latitude)+','+encodeURIComponent(location.longitude)))
        callback()
    })

    socket.on('disconnect', () => {
		
		const user = removeUsers((socket.id))
		
		if(user){
			
			io.to(user.room).emit('message', generateMessage(user.username+' has left!'))
			io.to(user.room).emit('roomUserInfo',{
			room:user.room,
			users:getUsers(user.room)
			
		})
			
		}
        
    })
})

server.listen(port, () => {
    console.log("Connecting to port.... "+ port)
})