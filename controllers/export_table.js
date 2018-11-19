var csv = require('csv-express');
var mongoose = require('mongoose');
var mongoose_models = {};
mongoose_models['User'] = mongoose.model('User');
mongoose_models['UserSubMap'] = mongoose.model('UserSubMap');
mongoose_models['Counter'] = mongoose.model('Counter');
mongoose_models['DeviceReg'] = mongoose.model('DeviceReg');
mongoose_models['Profile'] = mongoose.model('Profile');
mongoose_models['Application'] = mongoose.model('Application');
mongoose_models['Role'] = mongoose.model('Role');
mongoose_models['Subscription'] = mongoose.model('Subscription');
mongoose_models['Screen'] = mongoose.model('Screen');
mongoose_models['Field'] = mongoose.model('Field');
mongoose_models['AppScrFieldsRights'] = mongoose.model('AppScrFieldsRights');
mongoose_models['ProductTyp'] = mongoose.model('ProductTyp');
mongoose_models['ProductHierarchy'] = mongoose.model('ProductHierarchy');
mongoose_models['SpecField'] = mongoose.model('SpecField');
mongoose_models['PrdTypSpecFieldMap'] = mongoose.model('PrdTypSpecFieldMap');
mongoose_models['Brand'] = mongoose.model('Brand');
mongoose_models['Product'] = mongoose.model('Product');
mongoose_models['ProductSpec'] = mongoose.model('ProductSpec');
mongoose_models['PrdImage'] = mongoose.model('PrdImage');
mongoose_models['PrdThumbnail'] = mongoose.model('PrdThumbnail');
mongoose_models['Loc'] = mongoose.model('Loc');
mongoose_models['Parameter'] = mongoose.model('Parameter');

mongoose_models['UserAddress'] = mongoose.model('UserAddress');
mongoose_models['UserSubMap'] = mongoose.model('UserSubMap');
mongoose_models['UserAlert'] = mongoose.model('UserAlert');
mongoose_models['Fav'] = mongoose.model('Fav');
mongoose_models['Filter'] = mongoose.model('Filter');
mongoose_models['Sell'] = mongoose.model('Sell');
mongoose_models['Buy'] = mongoose.model('Buy');
mongoose_models['Bid'] = mongoose.model('Bid');
mongoose_models['BidBy'] = mongoose.model('BidBy');
mongoose_models['Service'] = mongoose.model('Service');
mongoose_models['Image'] = mongoose.model('Image');
mongoose_models['Thumbnail'] = mongoose.model('Thumbnail');
mongoose_models['ChatInbox'] = mongoose.model('ChatInbox');
mongoose_models['ChatDetail'] = mongoose.model('ChatDetail');
mongoose_models['Feedback'] = mongoose.model('Feedback');
mongoose_models['Rating'] = mongoose.model('Rating');
mongoose_models['ThumbsDown'] = mongoose.model('ThumbsDown');
mongoose_models['ThumbsUp'] = mongoose.model('ThumbsUp');


module.exports.exportToCsv = function(req,res){
	if(req.params.id && mongoose_models[req.params.id]){
		(mongoose_models[req.params.id]).find().lean().exec({}, function(export_err, export_data) {
			if(export_err){
				res.statusCode = 500;
				res.json({statusCode: 'F', msg: 'Unable to read table', error: export_err});
			}
			else if(export_data){
				var filename = (req.params.id)+'.csv';
				res.statusCode = 200;
				res.setHeader('Content-Type', 'text/csv');
				res.setHeader("Content-Disposition", 'attachment; filename='+filename);
				res.csv(
					 export_data
				,true);
			}
			else{
				res.statusCode = 500;
				res.json({statusCode: 'F', msg: 'No data', error: null});
			}
		});
	}
	else{
		res.statusCode = 500;
		res.json({statusCode: 'F', msg: 'Unknown table name', error: null});
	}
};
