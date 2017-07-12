var replaceAll = function(source, search, replacement) {
	return source.replace(new RegExp(search, 'g'), replacement);
};

var countOcurrencesOf = function(string, subString) {

	string += '';
	subString += '';
	if (subString.length <= 0) return (string.length + 1);

	var n = 0,
		pos = 0;

	while (true) {
		pos = string.indexOf(subString, pos);
		if (pos >= 0) {
			++n;
			pos++;
		} else break;
	}
	return n;
};

var isNullorEmpty = function(value){
	if (typeof value === 'undefined' || value == null || value == ''){
		return true;
	}

	return false;
};

var dateToString = function(date, separator) {
	if (!separator) {
		separator = '/'
	}
	if (date) {
		const month = date.getMonth() + 1;
		let mString = month.toString();
		if (month < 10) {
			mString = '0' + month;
		}
		const day = date.getDate();
		let dString = day.toString()
		if (day < 10) {
			dString = '0' + day;
		}
		return date.getFullYear() + separator + mString + separator + dString;
	}
}



module.exports.countOcurrencesOf = countOcurrencesOf;
module.exports.dateToString = dateToString;
module.exports.replaceAll = replaceAll;
module.exports.isNullorEmpty = isNullorEmpty;