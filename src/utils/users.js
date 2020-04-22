//Keeping track of users
const users = []

const addUsers = ({id,username,room})=>{

//Clean the data
username = username.trim().toLowerCase()
room = room.trim().toLowerCase()


//Validate the data
if(!username || !room){
	
	return {
		
		error:"Username and Room are requred"
	
	}
}

//Check for existing user

const existingUser = users.find((user)=>{
	
	return user.room === room && user.username === username
	
})

if(existingUser){
	
	return {
		
		error:"Username already Exists"
	}
	
	
	
}

//Store Users
const user = {id,username,room}
users.push(user)
return {user}
	
	
}

const removeUsers = (id)=>{
	
	const index = users.findIndex((user)=>{
		
		return user.id === id
		
	})
	
	if(index !== -1){
		
		return users.splice(index,1)[0]//returns an array of items removed by index.
		
	}
	
}


const getUser = ((id)=>{
	
	const foundUser = users.find((user)=>{
		
		return user.id===id
		
	})
	
	return foundUser
	
})

const getUsers = ((room)=>{
	room = room.trim().toLowerCase()
	const foundUsers = users.filter((user)=>{
		
		return user.room===room
		
	})
	
	return foundUsers
	
})

module.exports = 


{
	
	addUsers,removeUsers,getUser,getUsers
	
}










