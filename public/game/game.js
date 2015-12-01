var app = angular.module('artemis.game', ['ngRoute'])

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/game/:name/:keys/:rounds/:words/', {
    templateUrl: 'game/game.html',
    controller: 'gameCtrl'
  })
}])

app.controller('gameCtrl', function ($scope, $routeParams, $window) {
  console.log('Game Config Params : ')
  console.log($routeParams)

  $scope.name = $routeParams.name
  $scope.keys = $routeParams.keys
  $scope.rounds = $routeParams.rounds
  $scope.help = ($scope.keys == 'magicspell')
  $scope.showWord = ($scope.keys == 'magicspell')

  if ($routeParams.words == 'null') {
    $scope.words = ['dog', 'cat', 'bird', 'duck', 'frog']
  } else {
    $scope.words = $routeParams.words.split(',')
    for (var i = 0; i < $scope.words.length; i++) {
      $scope.words[i] = $scope.words[i].trim();
    }
  }

  $scope.currentWord = $scope.words[0]
  $scope.currentLetter = $scope.currentWord[0]

  var wordIndex = 0
  var letterIndex = 0
  var roundIndex = $scope.rounds
  var errors = []
  var correct = []
  var wrong = false

  showHelp($scope.currentLetter)
  speak('Ready, spell')
  speakWord($scope.currentWord)

  $scope.toggleWord = function() {
    $scope.showWord = !$scope.showWord
  }

  $scope.toggleImage = function() {
    $scope.help = !$scope.help
  }

  $('#wordField').on('keyup', function(e) {
    var length = $(this).val().length
    var value = parseValue($scope.currentLetter, $scope.keys)

    if (value === 'wait') {
      //do nothing
    } else if (value === $scope.currentLetter) {
      speak($scope.currentLetter)
      // document.getElementById("wordField").value=''

      if (letterIndex + 1 == $scope.currentWord.length) {
        if (wordIndex + 1  == $scope.words.length) {
          roundIndex--
          wrong = false
          if (roundIndex == 0) {
            var total = $scope.words.length * $scope.rounds
            var percent = errors.length / total
            var errStr = errors.toString()
            var corrStr = correct.toString()

            if (errStr == '') {
              errStr = 'None'
            }
            if (corrStr == '') {
              corrStr = 'None'
            }
            $("#end")[0].play()
            console.log('corrStr: ' + corrStr)
            setTimeout(function(){
              $window.location.href = '/app#!/score/' + $scope.name + '/' + percent + '/' + corrStr + '/' + errStr
            }, 3000);
          } else {
            wordIndex = 0
            letterIndex = 0
            $scope.currentWord = $scope.words[0]
            $scope.currentLetter = $scope.currentWord[0]
            $scope.$apply()
            speakWord($scope.currentWord)
          }
          document.getElementById("wordField").value=''
        } else {
          //advance word
          wordIndex++
          letterIndex = 0
          $scope.currentWord = $scope.words[wordIndex]
          $scope.currentLetter = $scope.currentWord[0]
          $scope.$apply()
          //$("#word")[0].play()
          speakWord($scope.currentWord)
          document.getElementById("wordField").value=''
          wrong = false
        }
      } else {
        letterIndex++
        $scope.currentLetter = $scope.currentWord[letterIndex]
      }
    } else {
      $("#buzz")[0].play()
      var error = document.getElementById("wordField").value
      errors.push(error)
      correct.push($scope.currentWord)
      wrong = true
      document.getElementById("wordField").value= $(this).val().slice(0, length-1)
    }
    showHelp($scope.currentLetter)
  })
})

var combos = {"a": "a", "b": "s", "c": "d", "d": "f", "e": "v", "f": "n", "g": "u", "h": "i", "i": "o",
              "j": "p", "k": "qp", "l": "wo", "m": "ei", "n": "ru", "o": "vn", "p": "qv", "q": "wv", "r": "ev", "s": "rv", "t": "nu",
              "u": "ni", "v": "no", "w": "np", "x": "qw", "y": "er", "z": "ui"}

var combos2 = {"a": "q", "b": "w", "c": "e", "d": "r", "e": "v", "f": "n", "g": "j", "h": "k", "i": "l",
              "j": ";", "k": ";a", "l": "sl", "m": "dk", "n": "fj", "o": "vn", "p": "av", "q": "sv", "r": "dv", "s": "fv", "t": "nj",
              "u": "nk", "v": "nl", "w": "n;", "x": "as", "y": "df", "z": "jk"}

function parseValue(currentLetter, keys) {
  if (keys == 'qwerty') {
    return $('#wordField').val().slice(-1)
  } else {
    if (combos[currentLetter].length == 1) {
      if($('#wordField').val().slice(-1) === combos[currentLetter] || $('#wordField').val().slice(-1) === combos2[currentLetter]) {
        document.getElementById("wordField").value = ''
        return currentLetter
      }
    } else {
      var current = document.getElementById("wordField").value
      var first = current.charAt(current.length - 1)
      var second = current.charAt(current.length - 2)
      if (second === '') {
        if (combos[currentLetter].indexOf(first) != -1 || combos2[currentLetter].indexOf(first) != -1) {
          return 'wait'
        } else {
          return ''
        }
      }
      if ((combos[currentLetter].indexOf(first) != -1 && combos[currentLetter].indexOf(second) != -1) || combos2[currentLetter].indexOf(first) != -1 && combos2[currentLetter].indexOf(second) != -1) {
        document.getElementById("wordField").value = ''
        return currentLetter;
      } else if ((combos[currentLetter].indexOf(first) != -1 || combos[currentLetter].indexOf(second) != -1) || combos2[currentLetter].indexOf(first) != -1 || combos2[currentLetter].indexOf(second) != -1) {
        return 'wait'
      } else {
        return ''
      }
    }
  }
}

function speakWord(text) {
    speak(text)
    for (var i = 0; i < text.length; i++) {
      speak(text.charAt(i))
    }
}

// Create a new utterance for the specified text and add it to
// the queue.
function speak(text) {
  var u = new SpeechSynthesisUtterance();
  u.text = text;
  u.lang = 'en-US';
  u.rate = .75;
  speechSynthesis.speak(u);
}

function showHelp(letter) {
  document.getElementById("help").src = "img/" + letter + ".png"
}
