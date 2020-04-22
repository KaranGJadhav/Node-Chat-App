//Client side js
const socket = io()

//Elements
const chatapp = document.querySelector('#message-form')
const messageInputField = document.querySelector('input')
const messageButton = document.querySelector('#send')
const messages = document.querySelector('#messages')
const sideBarUsers = document.querySelector("#sideBar")

//Templates
const messageTemplate=document.querySelector('#message-template').innerHTML
const messageLocationTemplate=document.querySelector('#message-template-location').innerHTML
const sideBarTemplate=document.querySelector('#sidebar-template').innerHTML

//Options
const {username,room} = Qs.parse(location.search, {ignoreQueryPrefix:	true})

const autoScroll=()=>{
	//New Message Elements
	const newMessages = messages.lastElementChild
	//Height of new message
	const newMessageStyles = getComputedStyle(newMessages)
	const newMessageMargin = parseInt(newMessageStyles.marginBottom)
	const newMessageHeight = newMessages.offsetHeight + newMessageMargin
	
	//Visible Height
	const visibleHeight=messages.offsetHeight
	
	//Height of message container
	const containerHeight=messages.scrollHeight

	//How far we have scrolled
	const scrollOffset = messages.scrollTop+visibleHeight
	
	if(containerHeight-newMessageHeight<=scrollOffset){
		
		messages.scrollTop=messages.scrollHeight
		
	}
	
	
	
}

socket.on("message",(message)=>{
	
	console.log(message)
	const html = Mustache.render(messageTemplate,{
		
		username:message.username,
		message:message.text,
		createdAt:moment(message.createdAt).format('h:mm A')
	})
	messages.insertAdjacentHTML('beforeend',html)
	autoScroll()
	
})

socket.on("locationMessage",(locationMessage)=>{
	
	console.log(locationMessage)
	const html = Mustache.render(messageLocationTemplate,{
		username:locationMessage.username,
		url:locationMessage.url,
		createdAt:moment(locationMessage.createdAt).format('h:mm A')
		
	})
	messages.insertAdjacentHTML('beforeend',html)
	autoScroll()
	
})


socket.on('roomUserInfo',({room,users})=>{
	
	const html=Mustache.render(sideBarTemplate,{
		
		room,
		users
		
	})
	sideBarUsers.innerHTML=html
	
})


chatapp.addEventListener('submit', (e)=>{
	e.preventDefault()
    message = e.target.elements.message
	messageButton.setAttribute('disabled','disabled')
	socket.emit('sendMessage',message.value,(error)=>{
	messageButton.removeAttribute("disabled")
	messageInputField.value=''
	messageInputField.focus()
		if(error){
			
			return console.log(error)
			
		}
		
		console.log("Message is delivered!!")
		
	})
	
	
})
const sendLocation = document.querySelector("#send-location")
sendLocation.addEventListener('click',(e)=>{
	e.preventDefault()
	if(!navigator.geolocation){
		return alert("Geolocation is not supported by the browser")
	}
	sendLocation.setAttribute('disabled','disabled')  
	
	navigator.geolocation.getCurrentPosition((position)=>{
		
		const location = {
			
			latitude:position.coords.latitude,
			longitude:position.coords.longitude
			
		}
		
		
		socket.emit("sendLocation",location,(locate)=>{
			
			sendLocation.removeAttribute('disabled')
			console.log("Location Shared!!")
			
		})
		
	})
	
})



socket.emit('join',{username,room},(error)=>{
	
	if(error){
		
		alert(error)
		location.href='/'
	}
	
	
})