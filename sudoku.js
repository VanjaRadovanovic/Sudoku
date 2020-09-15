var gameContainer = document.querySelector('.game-container');
var numberButons = document.querySelectorAll('.number-selector-button');
var timeButtonElement = document.querySelector('#time');
var timeDisplayElement = document.querySelector('#time-display');
var timeIconElement = document.querySelector('#pouse-button');
var alertTimeElement = document.querySelector('#alert-time');
var continueButton = document.querySelector('#countinue-button');
var alertGameChangesElement = document.querySelector('#alert-game-changes');
var difficultyButtons = document.querySelectorAll('.difficulty-buttons');
var alertGameChangesContinueButtonElement = document.querySelector(
   '#continue-button-game-changes'
);
var alertGameChangesNextGameButtonElement = document.querySelector(
   '#new-game-button'
);
var restartButton = document.querySelector('#restart-button');
var nextGameButton = document.querySelector('#next-game-button');
var eraser = document.querySelector('#eraser');
var hintElement = document.querySelector('#hint');
var numberOfHintsLeftElement = document.querySelector('#number-of-hints-left');
var lightOnElement = document.querySelector('#on-light');
var lightOffElement = document.querySelector('#off-light');
var notesElement = document.querySelector('#notes');
var gameWonElement = document.querySelector('#alert-game-won');
var gameWonButton = document.querySelector('#game-won-button');
var gameWonTime = document.querySelector('#time-spent');
var currentSudokuSolution;
var fieldsFilled = 50;
var currentSudokuGame;
const columns = 9;
var blocks = [];
var lastSelectedField = {
   i: undefined,
   j: undefined,
};
var iSelected = undefined;
var jSelected = undefined;
var time = {
   button: timeButtonElement,
   display: timeDisplayElement,
   icon: timeIconElement,
   timerString: '0:00',
   timerSeconds: 0,
   timerMinutes: 0,
   gameStarted: false,
};
var alertTime = {
   element: alertTimeElement,
   pressed: false,
};
var alertGameChanges = {
   element: alertGameChangesElement,
   pressed: false,
   buttons: [
      alertGameChangesContinueButtonElement,
      alertGameChangesNextGameButtonElement,
   ],
   buttonPressed: 'easy',
};
var hint = {
   element: hintElement,
   numberOfHintsLeftEl: numberOfHintsLeftElement,
   numberOfHintsLeft: 3,
   lightOn: lightOnElement,
   lightOff: lightOffElement,
};
var notes = {
   toggled: false,
   element: notesElement,
};
var gameWonAlerter = {
   element: gameWonElement,
   time: gameWonTime,
   button: gameWonButton,
};

insertingDivs();
loadingGeneratedSudoku(sudoku.generate(50));

function insertingDivs() {
   for (var i = 0; i < columns; i++) {
      for (var j = 0; j < columns; j++) {
         gameContainer.insertAdjacentHTML(
            'beforeend',
            '<div class="block" id="' + i + '-' + j + '"></div>'
         );
      }
   }

   var allDivs = document.querySelectorAll('.block');
   var divCouner = 0;

   for (var i = 0; i < columns; i++) {
      blocks[i] = [];
      for (var j = 0; j < columns; j++) {
         blocks[i][j] = new Block();
         blocks[i][j].element = allDivs[divCouner];
         blocks[i][j].element;
         divCouner++;
         if ((i + 1) % 3 == 0 && j != 8) {
            blocks[i][j].element.classList.add('border-last-block');
         } else if (j == 8 && (i + 1) % 3 != 0) {
            blocks[i][j].element.classList.add('border-last-cloumn');
         } else if (j != 8) {
            blocks[i][j].element.classList.add('border-every-else-block');
         }
         if (i == 2 || i == 5) {
            blocks[i][j].element.classList.add('border-bottom-block-black');
         }
         if (j == 2 || j == 5) {
            blocks[i][j].element.classList.add('border-right-block-dark');
         }
      }
   }
}

for (var i = 0; i < 9; i++) {
   numberButons[i].addEventListener('mouseup', function (e) {
      var selectedNumber = undefined;
      if (
         blocks[iSelected][jSelected].generatedNumber != true &&
         !blocks[iSelected][jSelected].hintedNumber
      ) {
         selectedNumber = parseInt(e.target.id);
         insertingNumber(selectedNumber);
      }
   });
}

function insertingNumber(selectedNumber) {
   if (!notes.toggled) {
      time.gameStarted = true;
      if (blocks[iSelected][jSelected].firstTimeWritten) {
         fieldsFilled++;
         blocks[iSelected][jSelected].firstTimeWritten = false;
      }
      blocks[iSelected][jSelected].number.innerHTML = selectedNumber;
      blocks[iSelected][jSelected].value = selectedNumber;
      if (blocks[iSelected][jSelected].selectedAsWrong) {
         removeRedBlocks(iSelected, jSelected);
      }
      checkSelectedNumber(iSelected, jSelected, selectedNumber);
      checkingAllWrongNumbers(iSelected, jSelected);
      removingNotes(iSelected, jSelected);
      winningGame();
   } else if (blocks[iSelected][jSelected].value == undefined) {
      time.gameStarted = true;
      if (!blocks[iSelected][jSelected].notes[selectedNumber - 1].toggled) {
         blocks[iSelected][jSelected].notes[
            selectedNumber - 1
         ].element.innerHTML = selectedNumber;
         blocks[iSelected][jSelected].notes[selectedNumber - 1].toggled = true;
      } else {
         blocks[iSelected][jSelected].notes[
            selectedNumber - 1
         ].number.innerHTML = '';
         blocks[iSelected][jSelected].notes[selectedNumber - 1].toggled = false;
      }
   }
}

function removingNotes(iSelected, jSelected) {
   for (var i = 0; i < 9; i++) {
      if (blocks[iSelected][jSelected].notes[i].toggled) {
         blocks[iSelected][jSelected].notes[i].element.innerHTML = '';
      }
   }
}

function loadingGeneratedSudoku(generateSudoku) {
   currentSudokuGame = generateSudoku;
   var letterTracker = 0;
   for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
         if (currentSudokuGame.charAt(letterTracker) != '.') {
            blocks[i][j].element.innerText = currentSudokuGame.charAt(
               letterTracker
            );
            blocks[i][j].value = currentSudokuGame.charAt(letterTracker);
            blocks[i][j].element.classList.add('generated-numbers');
            blocks[i][j].generatedNumber = true;
         } else {
            blocks[i][j].element.innerHTML =
               '<div class="number"></div><div class="notes-container" id="' +
               i +
               '-' +
               j +
               '"><div id="1"></div><div id="2"></div><div id="3"></div><div id="4"></div><div id="5"></div><div id="6"></div><div id="7"></div><div id="8"></div><div id="9"></div></div>';
         }
         letterTracker++;
      }
   }
   currentSudokuSolution = sudoku.solve(currentSudokuGame);
   insertNotesNumbers();
   loadingSolutions();
}

function insertNotesNumbers() {
   var allNoteNumbers = document.querySelectorAll('.notes-container>div');
   var numberEl = document.querySelectorAll('.number');
   var numberTracker = 0;
   var numberInputTracker = 0;
   for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
         for (var notesTracker = 0; notesTracker < 9; notesTracker++) {
            if (!blocks[i][j].generatedNumber) {
               blocks[i][j].notes[notesTracker] = new notesPrototype();
               blocks[i][j].notes[notesTracker].element =
                  allNoteNumbers[numberTracker];
               blocks[i][j].number = numberEl[numberInputTracker];
               numberTracker++;
            }
         }
      }
   }
   for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
         if (!blocks[i][j].generatedNumber) {
            blocks[i][j].number = numberEl[numberInputTracker];
            numberInputTracker++;
         }
      }
   }
}

function loadingSolutions() {
   var letterTracker2 = 0;
   currentSudokuSolution = sudoku.solve(currentSudokuGame);
   for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
         blocks[i][j].solution = currentSudokuSolution.charAt(letterTracker2);
         letterTracker2++;
      }
   }
}

for (var i = 0; i < 9; i++) {
   for (var j = 0; j < 9; j++) {
      blocks[i][j].element.addEventListener('mouseup', function (e) {
         removingSelectedBlocks();
         iSelected = e.target.id.charAt(0);
         jSelected = e.target.id.charAt(2);
         selectingNumbers(iSelected, jSelected);
      });
   }
}

function selectingNumbers(iSelect, jSelect) {
   iSelected = iSelect;
   jSelected = jSelect;
   if (
      !blocks[iSelect][jSelect].generatedNumber &&
      !blocks[iSelect][jSelect].selectedAsWrong
   ) {
      blocks[iSelect][jSelect].element.classList.add('selected-number-right');
   }
   for (var i = 0; i < columns; i++) {
      if (
         blocks[iSelect][i].generatedNumber &&
         blocks[iSelect][i].selectedAsWrong == false
      ) {
         blocks[iSelect][i].element.classList.add(
            'selected-generated-number-field'
         );
      } else if (blocks[iSelect][i].selectedAsWrong == false) {
         blocks[iSelect][i].element.classList.add('selected-field');
      }
      if (
         blocks[i][jSelect].generatedNumber &&
         blocks[i][jSelect].selectedAsWrong == false
      ) {
         blocks[i][jSelect].element.classList.add(
            'selected-generated-number-field'
         );
      } else if (blocks[i][jSelect].selectedAsWrong == false) {
         blocks[i][jSelect].element.classList.add('selected-field');
      }
      numberButons[i].style.cursor = 'pointer';
   }
}

addEventListener('keydown', function (e) {
   switch (e.keyCode) {
      case 17:
         notes.toggled = true;
         notes.element.style.color = '#1197DD';
         break;
      case 27:
         removingSelectedBlocks();
         break;
      case 37:
         var i = iSelected;
         var j = jSelected;
         if (jSelected > 0) {
            j--;
         } else {
            j = jSelected;
         }
         removingSelectedBlocks();
         selectingNumbers(i, j);
         break;
      case 38:
         var j = jSelected;
         var i = iSelected;
         if (iSelected > 0) {
            i--;
         } else {
            i = iSelected;
         }
         removingSelectedBlocks();
         selectingNumbers(i, j);
         break;
      case 39:
         var i = iSelected;
         var j = jSelected;
         if (jSelected < 8) {
            j++;
         } else {
            j = jSelected;
         }
         removingSelectedBlocks();
         selectingNumbers(i, j);
         break;
      case 40:
         var j = jSelected;
         var i = iSelected;
         if (iSelected < 8) {
            i++;
         } else {
            i = iSelected;
         }
         console.log(i, j);
         removingSelectedBlocks();
         selectingNumbers(i, j);
         break;
      case 48:
         if (
            iSelected != undefined &&
            jSelected != undefined &&
            !blocks[iSelected][jSelected].generatedNumber &&
            !blocks[iSelected][jSelected].hintedNumber
         ) {
            blocks[iSelected][jSelected].value = undefined;
            blocks[iSelected][jSelected].number.innerHTML = '';
            if (blocks[iSelected][jSelected].selectedAsWrong) {
               removeRedBlocks(iSelected, jSelected);
            }
            checkingAllWrongNumbers(iSelected, jSelected);
            restoreNotes(iSelected, jSelected);
            fieldsFilled--;
         }
         break;
      case 49:
         insertingNumber(1);
         break;
      case 50:
         insertingNumber(2);
         break;
      case 51:
         insertingNumber(3);
         break;
      case 52:
         insertingNumber(4);
         break;
      case 53:
         insertingNumber(5);
         break;
      case 54:
         insertingNumber(6);
         break;
      case 55:
         insertingNumber(7);
         break;
      case 56:
         insertingNumber(8);
         break;
      case 57:
         insertingNumber(9);
         break;
   }
});

addEventListener('keyup', function (e) {
   if (e.keyCode == 17) {
      notes.toggled = false;
      notes.element.style.color = '#666666';
   }
});

function Block() {
   this.generatedNumber = false;
   this.element;
   this.number;
   this.value = undefined;
   this.selectedAsWrong = false;
   this.selectedAsWrongAndPressed = false;
   this.solution = undefined;
   this.hintedNumber = false;
   this.notes = [];
   this.firstTimeWritten = true;
}

function notesPrototype() {
   this.notesProt = {
      element: undefined,
      toggled: false,
   };
}

function removingSelectedBlocks() {
   for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
         blocks[i][j].element.classList.remove('selected-field');
         blocks[i][j].element.classList.remove(
            'selected-generated-number-field'
         );
         blocks[i][j].element.classList.remove('selected-number-right');
         iSelected = undefined;
         jSelected = undefined;
         numberButons[i].style.cursor = 'not-allowed';
      }
   }
}

function checkSelectedNumber(iSelected, jSelected, numberPressed) {
   if (blocks[iSelected][jSelected].value != undefined) {
      for (var i = 0; i < columns; i++) {
         if (
            blocks[iSelected][i].value == numberPressed &&
            blocks[iSelected][i].element != blocks[iSelected][jSelected].element
         ) {
            makingBlockRed(iSelected, i, true);
            makingBlockRed(iSelected, jSelected, false);
         }
         if (
            blocks[i][jSelected].value == numberPressed &&
            blocks[i][jSelected].element != blocks[iSelected][jSelected].element
         ) {
            makingBlockRed(i, jSelected, true);
            makingBlockRed(iSelected, jSelected, false);
         }
      }
      var iStart = Math.floor(iSelected / 3) * 3;
      var jStart = Math.floor(jSelected / 3) * 3;
      var iBorder = iStart + 3;
      var jBorder = jStart + 3;
      for (i = iStart; i < iBorder; i++) {
         for (j = jStart; j < jBorder; j++) {
            if (
               blocks[i][j].value == numberPressed &&
               blocks[i][j].element != blocks[iSelected][jSelected].element
            ) {
               makingBlockRed(i, j, true);
               makingBlockRed(iSelected, jSelected, false);
            }
         }
      }
   }
}

function makingBlockRed(i, j, sideButton) {
   blocks[i][j].element.classList.remove('selected-field');
   blocks[i][j].element.classList.remove('selected-generated-number-field');
   if (
      sideButton &&
      (blocks[i][j].generatedNumber || blocks[i][j].hintedNumber)
   ) {
      blocks[i][j].element.classList.remove('hinted-number');
      blocks[i][j].element.classList.add('selected-button-wrong-side-blocks');
   } else if (!blocks[i][j].generatedNumber) {
      blocks[i][j].element.classList.add('selected-number-wrong');
      blocks[i][j].selectedAsWrongAndPressed = true;
   }
   blocks[i][j].selectedAsWrong = true;
}

function removeRedBlocks(iSelected, jSelected) {
   for (var i = 0; i < columns; i++) {
      blocks[iSelected][i].element.classList.remove(
         'selected-button-wrong-side-blocks'
      );
      blocks[iSelected][i].element.classList.remove('selected-number-wrong');
      blocks[i][jSelected].element.classList.remove('selected-number-wrong');
      blocks[i][jSelected].element.classList.remove(
         'selected-button-wrong-side-blocks'
      );
      blocks[iSelected][i].selectedAsWrong = false;
      blocks[i][jSelected].selectedAsWrong = false;
      if (blocks[iSelected][i].hintedNumber) {
         blocks[iSelected][i].element.classList.add('hinted-number');
         blocks[iSelected][i].element.classList.remove(
            'selected-button-wrong-side-blocks'
         );
      } else if (blocks[i][jSelected].hintedNumber) {
         blocks[i][jSelected].element.classList.add('hinted-number');
         blocks[i][jSelected].element.classList.remove(
            'selected-button-wrong-side-blocks'
         );
      }
   }
   var iStart = Math.floor(iSelected / 3) * 3;
   var jStart = Math.floor(jSelected / 3) * 3;
   var iBorder = iStart + 3;
   var jBorder = jStart + 3;
   for (i = iStart; i < iBorder; i++) {
      for (j = jStart; j < jBorder; j++) {
         if (i == iSelected && j == jSelected) {
            blocks[i][j].element.classList.remove('selected-button-wrong');
         } else {
            blocks[i][j].element.classList.remove(
               'selected-button-wrong-side-blocks'
            );
         }
         if (blocks[i][j].hintedNumber) {
            blocks[i][j].element.classList.add('hinted-number');
            blocks[i][j].element.classList.remove(
               'selected-button-wrong-side-blocks'
            );
         }
         blocks[i][j].selectedAsWrong = false;
      }
   }
   selectingNumbers(iSelected, jSelected);
}

function checkingAllWrongNumbers(iSelected, jSelected) {
   for (var i = 0; i < columns; i++) {
      for (var j = 0; j < columns; j++) {
         if (blocks[i][j].selectedAsWrongAndPressed) {
            checkSelectedNumber(i, j, blocks[i][j].value);
         }
      }
   }
}

time.button.addEventListener('mouseup', function (e) {
   if (time.gameStarted) {
      if (!alertTime.pressed) {
         alertTime.element.style.display = 'grid';
         alertTime.element.classList.add('bg-animation');
         alertTime.pressed = true;
      } else {
         alertTime.element.style.display = 'none';
         alertTime.element.classList.remove('bg-animation');
         alertTime.pressed = false;
      }
   }
});

setInterval(function () {
   if (time.gameStarted) {
      if (!alertTime.pressed) {
         if (time.timerSeconds >= 59) {
            time.timerSeconds = 0;
            time.timerMinutes++;
         } else {
            time.timerSeconds++;
         }
         if (time.timerSeconds < 10) {
            time.display.innerHTML =
               time.timerMinutes + ':0' + time.timerSeconds;
         } else {
            time.display.innerHTML =
               time.timerMinutes + ':' + time.timerSeconds;
         }
      }
   }
}, 1000);

continueButton.addEventListener('mouseup', function (e) {
   if (alertTime.pressed) {
      alertTime.element.style.display = 'none';
      alertTime.element.classList.remove('bg-animation');
      alertTime.pressed = false;
   }
});

for (var i = 0; i < 2; i++) {
   alertGameChanges.buttons[i].addEventListener('mouseup', function (e) {
      if (e.target.id == 'continue-button-game-changes') {
         alertGameChanges.pressed = true;
         alertingGameChanges();
      } else if (alertGameChanges.buttons[1].innerHTML == 'NEW GAME') {
         newGame();
      } else {
         restartingCurrentGame();
         alertGameChanges.pressed = true;
         alertingGameChanges();
      }
   });
}

function alertingGameChanges() {
   if (!alertGameChanges.pressed) {
      alertGameChanges.element.style.display = 'grid';
   } else {
      alertGameChanges.element.style.display = 'none';
      alertGameChanges.pressed = false;
   }
}

for (var i = 0; i < 3; i++) {
   difficultyButtons[i].addEventListener('mouseup', function (e) {
      alertGameChanges.buttons[1].innerHTML = 'NEW GAME';
      alertingGameChanges();
      alertGameChanges.buttonPressed = e.target.id;
   });
}

function newGame() {
   alertGameChanges.pressed = true;
   alertingGameChanges();
   resetingAllCurrentSettings();
   if (alertGameChanges.buttonPressed == 'easy') {
      loadingGeneratedSudoku(sudoku.generate(50));
      fieldsFilled = 50;
   } else if (alertGameChanges.buttonPressed == 'midium') {
      loadingGeneratedSudoku(sudoku.generate(40));
      fieldsFilled = 40;
   } else if (alertGameChanges.buttonPressed == 'hard') {
      loadingGeneratedSudoku(sudoku.generate(30));
      fieldsFilled = 30;
   }
}

function resetingAllCurrentSettings() {
   for (var i = 0; i < columns; i++) {
      for (var j = 0; j < columns; j++) {
         blocks[i][j].element.classList.remove('generated-numbers');
         blocks[i][j].element.classList.remove('selected-number-right');
         blocks[i][j].element.classList.remove(
            'selected-generated-number-field'
         );
         blocks[i][j].element.classList.remove('selected-field');
         blocks[i][j].element.classList.remove(
            'selected-button-wrong-side-blocks'
         );
         blocks[i][j].element.classList.remove('selected-number-wrong');
         blocks[i][j].element.classList.remove('hinted-number');
         blocks[i][j].generatedNumber = false;
         blocks[i][j].element;
         blocks[i][j].value = undefined;
         blocks[i][j].selectedAsWrong = false;
         blocks[i][j].selectedAsWrongAndPressed = false;
         iSelected = undefined;
         jSelected = undefined;
         blocks[i][j].element.innerHTML = '';
         time.timerSeconds = 0;
         time.timerMinutes = 0;
         time.display.innerHTML = time.timerMinutes + ':0' + time.timerSeconds;
         time.timerSeconds = 0;
         alertTime.element.style.display = 'none';
         alertTime.element.classList.remove('bg-animation');
         alertTime.pressed = false;
         hint.numberOfHintsLeft = 3;
         hint.numberOfHintsLeftEl.innerHTML = hint.numberOfHintsLeft;
         blocks[i][j].hintedNumber = false;
         hint.lightOn.style.display = 'block';
         hint.lightOff.style.display = 'none';
         hint.numberOfHintsLeftEl.style.display = 'grid';
         notes.toggled = false;
         notes.element.style.color = '#666666';
         time.gameStarted = false;
      }
   }
}

restartButton.addEventListener('mouseup', function (e) {
   alertGameChanges.buttons[1].innerHTML = 'RESTART';
   alertingGameChanges();
});

function restartingCurrentGame() {
   resetingAllCurrentSettings();
   loadingGeneratedSudoku(currentSudokuGame);
}

nextGameButton.addEventListener('mouseup', function (e) {
   alertingGameChanges();
});

eraser.addEventListener('mouseup', function (e) {
   if (
      iSelected != undefined &&
      jSelected != undefined &&
      !blocks[iSelected][jSelected].generatedNumber &&
      !blocks[iSelected][jSelected].hintedNumber
   ) {
      blocks[iSelected][jSelected].value = undefined;
      blocks[iSelected][jSelected].number.innerHTML = '';
      if (blocks[iSelected][jSelected].selectedAsWrong) {
         removeRedBlocks(iSelected, jSelected);
      }
      checkingAllWrongNumbers(iSelected, jSelected);
      restoreNotes(iSelected, jSelected);
      fieldsFilled--;
   }
});

function restoreNotes(iSelected, jSelected) {
   for (var i = 0; i < 9; i++) {
      if (blocks[iSelected][jSelected].notes[i].toggled) {
         blocks[iSelected][jSelected].notes[i].element.innerHTML = i + 1;
      }
   }
}

hint.element.addEventListener('mouseup', function (e) {
   time.gameStarted = true;
   if (hint.numberOfHintsLeft > 0) {
      revealingOneNumber();
      hint.numberOfHintsLeftEl.innerHTML = hint.numberOfHintsLeft;
   }
   if (hint.numberOfHintsLeft == 0) {
      hint.lightOn.style.display = 'none';
      hint.lightOff.style.display = 'block';
      hint.numberOfHintsLeftEl.style.display = 'none';
   }
});

function revealingOneNumber() {
   var iRandom = Math.floor(Math.random() * 8);
   var jRandom = Math.floor(Math.random() * 8);
   if (
      blocks[iRandom][jRandom].generatedNumber ||
      blocks[iRandom][jRandom].hintedNumber ||
      blocks[iRandom][jRandom].value != undefined
   ) {
      if (fieldsFilled != 81) {
         revealingOneNumber();
      } else {
         winningGame();
      }
   } else {
      blocks[iRandom][jRandom].value = blocks[iRandom][jRandom].solution;
      blocks[iRandom][jRandom].number.innerHTML =
         blocks[iRandom][jRandom].solution;
      blocks[iRandom][jRandom].element.classList.add('hinted-number');
      blocks[iRandom][jRandom].hintedNumber = true;
      hint.numberOfHintsLeft--;
      removingNotes(iRandom, jRandom);
      if (blocks[iRandom][jRandom].firstTimeWritten) {
         fieldsFilled++;
         blocks[iRandom][jRandom].firstTimeWritten = false;
      }
      winningGame();
   }
}

notes.element.addEventListener('mouseup', function (e) {
   if (notes.toggled) {
      notes.toggled = false;
      notes.element.style.color = '#666666';
   } else {
      notes.toggled = true;
      notes.element.style.color = '#1197DD';
   }
});

function winningGame() {
   if (fieldsFilled == 81) {
      var letterTracker = 0;
      for (var i = 0; i < 9; i++) {
         for (var j = 0; j < 9; j++) {
            if (
               blocks[i][j].value != currentSudokuSolution.charAt(letterTracker)
            ) {
               return;
            }
            letterTracker++;
         }
      }
      gameWon();
   }
}

function gameWon() {
   time.gameStarted = false;
   gameWonAlerter.element.style.display = 'grid';
   if (time.timerSeconds < 10) {
      gameWonAlerter.time.innerHTML =
         'time:  ' + time.timerMinutes + ':0' + time.timerSeconds;
   } else {
      gameWonAlerter.time.innerHTML =
         'time:  ' + time.timerMinutes + ':' + time.timerSeconds;
   }
}

gameWonAlerter.button.addEventListener('mouseup', function (e) {
   gameWonAlerter.element.style.display = 'none';
   newGame();
});
