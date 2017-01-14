function cloneObj(obj) {
	let copy = {};
	for(let key in obj) {
		copy[key] = (typeof obj[key] === 'object') ?
			cloneObj(obj[key]) : obj[key];
	}
	return copy;
}

function rndStr(length) {
	return Math.random().toString(10).slice(2).substr(0, length);
}

function moneyToNum(price) {
	let priceStr = price.trim();
	let firstChar = priceStr.charAt(0);
	let priceStrNo$ = (firstChar === '$') ? (priceStr.substr(1)) : (priceStr);
	let priceNum = Number(priceStrNo$.trim());
	return isNaN(priceNum) ? false : priceNum;
}

module.exports = { cloneObj, rndStr, moneyToNum };