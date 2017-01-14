module.exports = {
	cloneObj: function(obj) {
		let copy = {};
		for(let key in obj) {
			copy[key] = (typeof obj[key] === 'object') ?
				(cloneObj(obj[key])) : (copy[key] = obj[key])
		}
		return copy;
	}
}