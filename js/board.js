var currPlayer = 0,
	over = false, 
	game = {
		turns: 0,
		pieces: ['x','o'],
		players: {
			human :
				{
					piece: 'x',
					id: 1,
					wins: 0
				},
			computer: 
				{
					piece: 'o',
					id: 0,
					wins: 0
				}
		},
		board: {'1':[], '0':[]},
		board2: {},
		length: function () {
			var lis = 0
			for (var i in game.board2) {
				lis += 1
			}
			return lis
		}
	},
	human_turn = false;
$(document).ready(function () {
	prepGame();
	startGame()
});

function prepGame () {
	$('#board').on('mouseenter mouseleave click', '.li', function (e) {
		var player_class = '.toggle.player-'+game.pieces[currPlayer],
		computer_class = '.toggle.player-'+game.pieces[(currPlayer + 1) % 2];
		if (e.type == 'mouseenter') {
			if (!over) {
				$(this).find(player_class).css('opacity','1');
			}
		} else if (e.type == 'mouseleave') {
			if (!over) {
				$(this).find(player_class).css('opacity','0');
			}
		} else if (e.type == 'click') {
			if (!over) {
				var data = $(this).attr('data')
				makeMove($(this), data, player_class)
			}
		}
	});
}

function startGame () {
	var board = displayBoard();
	over = false;
	game.board = {'1':[], '0':[]}
	game.board2 = {}

	$('#board').empty();
	$('#board').append(board);

	$("#playAgain").addClass("hidden")
	$("#playAgain").removeClass("winner-div")
	playGame();
}

function makeMove (elt, data, player_class) {
	if (isValidMove(data)) {
		addToBoard(data)
		elt.find(player_class).removeClass('toggle').css('opacity','1');
		var winner = gameOver(currPlayer)

		if (winner == "") {
			currPlayer = (currPlayer === 1) ? 0 : 1
			game.turns += 1
			playGame()
		} else {
			//$("#playAgain").css("display", "block");
			$("#playAgain").removeClass("hidden")
			$("#playAgain").addClass("winner-div")

			over = true;
			$("#winner-class").html(winner)
		}
	}
}

function isValidMove (data) {
	if (data in game.board2) {
		return false
	}
	return true
}

function addToBoard (data) {
	game.board2[data] = currPlayer
	game.board[currPlayer].push(data);
	game.turns += 1
}

function playGame() {
	if (currPlayer === 1) {
		makeRandomMove();
	}
}

function makeRandomMove () {
	console.log("---------COMPUTERS----------")
	var rand = getRandomNumber(),
	x;
	for (x = rand; x < 9; x++) {
		if (!(x in game.board2)) {
			break
		} 
	}
	if (x == 9){ 
		for (x = 0; x < rand; x++) {
			if (!(x in game.board2)) {
				break
			} 
		}
	}
	var elt = $("#data"+x)
	makeMove(elt, elt.attr('data'), '.toggle.player-'+ game.pieces[currPlayer])
}

function getRandomNumber () {
	return Math.round(Math.random() * 3);
}

function displayBoard () {
	var str = "",
		strClass,
		i;
	for (i = 0; i < 9; i++) {
		strClass = "li";
		if (i % 3 !== 2) {
			strClass += " right-vertical-line";
		}
		if (i % 3 !== 0) {
			strClass += " left-vertical-line";
		}
		if (i < 6) {
			strClass += " bottom-horizontal-line";
		}
		if (i > 2) {
			strClass += " top-horizontal-line";
		}
		// str += "<div class='"+strClass+"' data="+i+"><p></p></div>";
		str += "<li id='data"+i+"' class='"+strClass+"' data="+i+"><p class='toggle player player-x'>x</p><p class='toggle player player-o'>o</p></li>";
	}
	return str;
}

function isSubset (winningList, playerList) {
	for (var x in winningList) {
		if (playerList.indexOf(winningList[x]) < 0) {
			return false;
		}
	}
	return true;
}

function gameOver (currPlayer) {
	// wins: 
	// 012, 345, 678
	// 036, 147, 258
	// 048, 246
	if ((game.board[0].length+game.board[1].length) >= 9) {
		return "It's a tie."
	} else if (game.board[currPlayer].length > 2) {
		var winningList = [['0','1','2'], ['3','4','5'], ['6','7','8'], ['0','3','6'], ['1','4','7'], ['2','5','8'], ['0','4','8'], ['2','4','6']];

		for (var x in winningList) {
			if(isSubset(winningList[x], game.board[currPlayer])){
				return game.pieces[currPlayer] + " wins!"; 
			}
		}
		return "";
	}
	return ""
}

function quit () {
	$("#playAgain").addClass("hidden")
	$("#playAgain").removeClass("winner-div")

}