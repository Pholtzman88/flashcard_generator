//cloze card constructor
var ClozeCard = function(text,cloze){
	this.partialText = text.replace(cloze, "").trim();
	this.cloze = cloze;
	this.fullText = text;
};
//export module
module.exports = ClozeCard;