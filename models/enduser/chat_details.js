const mongoose = require('mongoose');

var ChatDetailSchema = new mongoose.Schema({
	chat_id:{
		type: String,
		required: true
	},
	post_id:{
		type: String 
	},
	from_user:{
		type: String 
	},
	to_user:{
		type: String 
	},
	text:{
		type: String 
	},
  	from_read:{
		type: Boolean 
	},
	to_read:{
		type: Boolean 
	},
	post_deletion:{
		type: Boolean 
	},
	deleted:{
		type: Boolean 
	},
	createdBy:{
		type: String 
	},
	createdAt:{
		type: Date 
	},
	changedBy:{
		type: String 
	},
	changedAt:{
		type: Date 
	}
});

mongoose.model('ChatDetail', ChatDetailSchema);
