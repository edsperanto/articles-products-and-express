const To = require('../To');

module.exports = (function() {

	const rndIDStrLength = 6;
	let _list = {};

	function _all() {
		let returnObj = { "empty": {} };
		if(Object.keys(_list).length === 0) {
			returnObj.empty.title = "Article List is Empty";
			returnObj.empty.notEmpty = false;
		}else{
			returnObj = To.cloneObj(_list);
		}
		return returnObj;
	}

	function _newArticleHasValidFormat(data) {
		let titleIsStr = typeof data.title === 'string';
		let titleSpaceOnly = To.strToUrl(data.title) !== false;
		let authorIsStr = typeof data.author === 'string';
		let bodyIsStr = typeof data.body === 'string';
		return titleIsStr && titleSpaceOnly && authorIsStr && bodyIsStr;
	}

	function _updateArticle(data) {
		let validKeys = ['urlTitle', 'title', 'author', 'body'];
		validKeys.forEach(key => {
			if(data[key] !== undefined) {
				_list[data.title][key] = data[key];
			}
		});
	}

	function _add(data, success, failure) {
		if(_newArticleHasValidFormat(data)) {
			_list[data.title] = {};
			_list[data.title].notEmpty = true;
			_list[data.title].id = To.rndStr(10);
			data.urlTitle = To.strToUrl(data.title);
			_updateArticle(data);
			success(To.cloneObj(_list));
		}else{
			failure();
		}
	}

	function _editArticleHasValidFormat(data) {
		let articleExists = typeof _list[To.urlToStr(data.urlTitle)] === 'object';
		let noTitle = data.title === undefined;
		let noAuthor = data.author === undefined;
		let noBody = data.body === undefined;
		let titleSpaceOnly = true;
		if(!noTitle) {
			titleSpaceOnly = To.strToUrl(data.title) !== false;
		}
		let titleIsStr = typeof data.title === 'string';
		let authorIsStr = typeof data.author === 'string';
		let bodyIsStr = typeof data.body === 'string';
		return articleExists && titleSpaceOnly
				&& (noTitle || titleIsStr)
				&& (noAuthor || authorIsStr)
				&& (noBody || bodyIsStr);
	}

	function _getByID(id) {
		let returnObj = {};
		if(_list[id] === undefined) {
			returnObj.id = "empty";
			returnObj.title = "Article Does Not Exist";
		}else{
			returnObj = To.cloneObj(_list[id]);
		}
		return returnObj;
	}

	function _editByID(data, success, failure) {
		if(_editArticleHasValidFormat(data)) {
			let title = To.urlToStr(data.urlTitle);
			let oldData = _list[title];
			if(data.title !== undefined) {
				_list[data.title] = To.cloneObj(oldData);
				delete _list[To.urlToStr(data.urlTitle)];
				data.urlTitle = To.strToUrl(data.title);
			}else{
				data.title = title;
			}
			_updateArticle(data);
			success(data);
		}else{
			failure(data);
		}
	}

	function _deleteByID(data, success, failure) {
		let title = To.urlToStr(data.urlTitle);
		let articleExists = typeof _list[title] === 'object';
		if(articleExists) {
			delete _list[title];
			success();
		}else{
			failure();
		}
	}

	return {
		all: _all,
		add: _add,
		getByID: _getByID,
		editByID: _editByID,
		deleteByID: _deleteByID
	}

})();