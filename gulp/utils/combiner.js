function combiner() {
	let combiner = require('stream-combiner2').obj;
	return combiner.apply(combiner, arguments);
};

module.exports = combiner;
