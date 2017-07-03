//cloze card constructor
var ClozeCard = function(text,cloze){
	this.front = text.replace(cloze, "").trim();
	this.back = cloze;
};
//export module
module.exports = ClozeCard;