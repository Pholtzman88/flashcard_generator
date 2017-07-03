//require necessary modules
var ClozeCard = require("./clozeCard.js");
var BasicCard = require("./basicCard.js");
var SqlConnection = require("./connection.js");
//requrie npms
var inquirer = require("inquirer");
var mysql = require("mysql");

function runApp(){
	inquirer.prompt([
	{
		name	:"host",
		message	:"enter your host name.."
	},
	{
		name	:"port",
		message	:"enter your port number.."
	},
	{
		name	:"user",
		message	:"enter your username.."
	},
	{
		name	:"password",
		message	:"enter your password.."
	},
	{
		name	:"database",
		message	:"Enter your database name? If you have not created one yet, choose a new name name..\."
	},	
	]).then(function(a){
		var con = new SqlConnection(a.host,a.port,a.user,a.password,a.database);
		var connection = mysql.createConnection(con);
		//give all basic cards a print function
		BasicCard.prototype.print = function(){
			console.log("front:"+this.front , "back:"+ this.back);
		};
		//give all cloze cards a print function
		ClozeCard.prototype.print = function(){
			console.log("front:"+this.cloze , "back:"+ this.partialText);
		};
		//set the 3rd user argument to card type
		var cardType = process.argv[2];
		//sets count to 0 for recursive functions
		var count = 0;
		var cardCount = 0;
		//if user selects to make a basic-card run createBasicCard
		if(cardType === "basic-card"){
			createBasicCard();
		//if user selects cloze-card run createClozeCard 
		}else if(cardType === "cloze-card"){
			createClozeCard();
		//if user does not designate a card type assign a type randomly
		}else{
			var random = Math.floor(Math.random()*100);
			if(random > 50){
				createBasicCard();
			}else{
				createClozeCard();
			};
		};
		//holds all card objects created by user
		var cardsArr = [];

		function createBasicCard(){
			//increase counter by 1 each time function recurrs
			count++;
			// run the function 10 times--- makes 10 flash cards
			if (count < 11){
				//use inquirer npm to get user input for card data
				inquirer.prompt([
				{
					name: "front",
					message: "please pick the front of card#"+ count
				},
				{
					name:"back",
					message: "please pick the back of card#"+ count
				}
				]).then(function(answers){
					//create new flash card object from user input
					var newBasicCard = new BasicCard(answers.front,answers.back);
					//log the data to console
					newBasicCard.print();
					//push new cards to cards array
					cardsArr.push(newBasicCard);
					//set index for traversing through cards array			
					var index = count-1;
					//set front of card in cards array	
					var front = cardsArr[index].front;
					//set back of card in cards array
					var back = cardsArr[index].back;
					if (count == 1){
						//set up the initial connection to database
						connection.connect(function(err) {
					  		if (err) throw err;
					  		postCards(front,back,"basic_cards");
						});				
					}else{
						postCards(front,back,"basic_cards");
					};
					//call recursion
					createBasicCard();					
				});
			};
			//when recursion is finished interact with cards from
			if ( count > 10){
				readCards("basic_cards");
			}
		};
		function createClozeCard(){
			//increase counter by 1 each time function recurrs
			count++;
			// run the function 10 times--- makes 10 flash cards
			if (count < 11){
				//use inquirer npm to get user input for card data
				inquirer.prompt([
				{
					name: "front",
					message: "please provide the full answer for card#"+ count
				},
				{
					name:"back",
					message: "please pick the display for back of the card"+ count
				}
				]).then(function(answers){
					//create new flash card object from user input
					var newClozeCard = new ClozeCard(answers.front,answers.back);
					//log the data to console
					newClozeCard.print();
					//push new cards to cards array
					cardsArr.push(newClozeCard);
					//set index for traversing through cards array			
					var index = count-1;
					//set front of card in cards array	
					var front = cardsArr[index].front;
					//set back of card in cards array
					var back = cardsArr[index].back;
					if (count == 1){
						//set up the initial connection to database
						connection.connect(function(err) {
					  		if (err) throw err;
					  		postCards(front,back,"cloze_cards");
						});				
					}else{
						postCards(front,back,"cloze_cards");
					};
					//call recursion
					console.log(cardsArr)
					createClozeCard();					
				});
			};
			//when recursion is finished interact with cards from
			if ( count > 10){
				readCards("cloze_cards");
			};
		};

		function postCards(f,b,t){
			connection.query(
			"INSERT INTO "+ t +" SET ?",
			{
				front	: 	f,
				back	: 	b
			},
			function(err,res){
				if (err) throw err;
			});
		};

		function readCards(t){
			//connect to database and select table
			connection.query("SELECT * FROM "+t, function(error,results){
				if (error) throw error;
				//set an array for cards retrieved from table
				var cards = [];
				//loop through array an results and push each card to cards array
				for(i=0;i<results.length;i++){
					cardFront = results[i].front;
					cardBack = results[i].back;
					cards.push({cardFront,cardBack});
				};
				//once all the cards from database have been pushed to cards array
				if (cards.length === results.length){
					//set length variable for the number of cards retrieved
					var length = results.length;
					//define recursive function to interact with cards
					function useCards(){
						//increase count by 1 each time function recurrs
						cardCount++;
						//set index variable for identifying each card
						var index = cardCount - 1;
						//as long as there is a card left to interact with
						if(cardCount <= length){
							//trigger inquirer to let user guess the answer 
							inquirer.prompt([
							{
								name: "guess",
								message: cards[index].cardFront
							}
							]).then(function(answer){
								console.log(answer.guess);
								//give the user a response based off their input--right or wrong
								if(answer.guess === cards[index].cardBack){
									console.log("correct!");
								}else{
									console.log("sorry :( the correct answer is... " + cards[index].cardBack);
								};
								//trigger recursion
								useCards();
							});
						};
					};
					//initial trigger
					useCards();
				};
				//end connection
				connection.end();
			});
		};		
	});
};

runApp();
