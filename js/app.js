// List that holds all of the cards
const cards = [
    'fa fa-diamond','fa fa-diamond',
    'fa fa-paper-plane-o','fa fa-paper-plane-o',
    'fa fa-anchor','fa fa-anchor',
    'fa fa-bolt','fa fa-bolt',
    'fa fa-cube','fa fa-cube',
    'fa fa-leaf','fa fa-leaf',
    'fa fa-bicycle','fa fa-bicycle',
    'fa fa-bomb','fa fa-bomb'
];

let moves = 0; // Stores the player moves
let stars = 3; // Stores the player stars
let timer;     // Stores the player time

// Overlay to prevent the user from clicking on more than two cards
const overlay = $("#overlay");

// Setup for a new game
function gameStart () {
    const deck = $('.deck');

    // If a deck already exists, clear it before creating a new one
    if (deck.children().length > 0) {
        deck.empty();
    }

    // Resets the variables for a new game
    moves = 0;
    displayMoves();
    stars = 3;
    countStars();
    stopTimer();
    $('.time').text(0);

    // Shuffle the cards using the shuffle function
    let shuffledCards = shuffle(cards);

    // Loop through each card and add its HTML
    for (let i = 0; i < shuffledCards.length; i++) {
        const liCard = $('<li>');
        const iCard = $('<i>');

        for (let j = 0; j < shuffledCards.length; j++){
            iCard.appendTo(liCard);
            liCard.appendTo(deck);
            liCard.addClass("card");
            iCard.addClass(shuffledCards[i]);
        }
    }

    // When a card is clicked run the openCard() function
    $('.card').click(openCard);

}

// Starts a new game from the 'Restart' button
$('.restart').click(gameStart);

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Increments the moves
function countMoves(){
    moves++;
    countStars();
    displayMoves();
}

// Displays the moves
function displayMoves() {
    $('.moves').html(moves);
}

// Updates the stars based on the number of moves
function countStars() {

    if (moves <= 20) {
        stars = 3;
    } else if (moves <= 25) {
        stars = 2;
    } else {
        stars = 1;
    }

    displayStars();
}

// Displays the stars
function displayStars() {
    // Keeps track of the stars for the current game
    let starsEarned = $('.score-panel .fa-star');

    if (starsEarned.length != stars) {
        let star = $('.score-panel .stars i');

        // Adds a star
        for (let i = 0; i <= stars; i++) {
            star.eq(i).attr('class', 'fa fa-star');
        }

        // Removes a star
        for (let i = stars; i < 3; i++){
            star.eq(i).attr('class', 'fa fa-star-o');
        }
    }

    // Display the star rating in the modal
    $('.starRating').html($('.score-panel .stars').html());

}

// Starts and updates the timer
function startTimer() {
    let start = new Date;

    timer = setInterval(function() {
        $('.time').text(Math.round((new Date - start) / 1000, 0));
    }, 1000);

}

// Stops the timer
function stopTimer() {
    clearInterval(timer);
}

// Shows a clicked card
function openCard() {
    $(this).addClass("open show");
    checkMatch();
}

// Checks if the opened cards match
function checkMatch() {
    // Keeps track of the open cards
    let openCards = $(".open");

    // Starts the timer when a card is clicked
    if (moves == 0 && openCards.length == 1){
        startTimer();
    }

    // Check if two cards are a match
    if (openCards.length == 2) {
        overlay.addClass("overlay");

        setTimeout(function() {
        if (openCards[0].children[0].className == openCards[1].children[0].className) {
            for (let i = openCards.length - 1; i >= 0; i--) {
                match(openCards[i]);
            }

        }   else {
                for (let i = openCards.length - 1; i >= 0 ; i--) {
                    mismatch(openCards[i]);
                }
            }

        }, 500);

        countMoves();
    }
}

// Handle cards that match
function match(element) {
    element.classList.add("match");

    // Prevent click on matched cards
    $('.match').off('click');

    checkWin();

    setTimeout(function() {
        element.classList.remove("open", "show");
        overlay.removeClass("overlay");
    }, 500);
}

// Handle cards that don't match
function mismatch(element) {
    element.classList.add("mismatch");

    setTimeout(function() {
        element.classList.remove("mismatch", "open", "show");
        overlay.removeClass("overlay");
    }, 500);
}

// Checks if the game is won
function checkWin() {
    let allMatchedCards = $(".match");

    if (allMatchedCards.length == cards.length) {
        stopTimer();
        gameWonMessage();
    }
}

// When the user wins, a modal is displayed
function gameWonMessage() {
    $('.play-again').click(gameStart);
    $('#gameWon').modal("show");
}

gameStart();
