var app = angular.module('artemis.game', ['ngRoute'])

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/game/:name/:keys/:rounds/:words/:help/', {
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
  $scope.help = $routeParams.help

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

  speak('Ready, spell')
  speak($scope.currentWord)

  $('#wordField').on('keyup', function(e) {
    var value = $(this).val().slice(-1)

    if (value == $scope.currentLetter) {
      speak($scope.currentLetter)

      if (letterIndex + 1 == $scope.currentWord.length) {
        if (wordIndex + 1  == $scope.words.length) {
          roundIndex--
          if (wrong) {
            errors.push(document.getElementById("wordField").value)
            correct.push($scope.currentWord)
          }
          wrong = false
          if (roundIndex == 0) {
            $("#end")[0].play()

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
            console.log(corrStr)
            $window.location.href = '/app#!/score/' + $scope.name + '/' + percent + '/' + corrStr + '/' + errStr
          } else {
            wordIndex = 0
            letterIndex = 0
            $scope.currentWord = $scope.words[0]
            $scope.currentLetter = $scope.currentWord[0]
            $scope.$apply()
            speak($scope.currentWord)
          }
          document.getElementById("wordField").value=''
        } else {
          //advance word
          if (wrong) {
            errors.push(document.getElementById("wordField").value)
            correct.push($scope.currentWord)
          }
          wordIndex++
          letterIndex = 0
          $scope.currentWord = $scope.words[wordIndex]
          $scope.currentLetter = $scope.currentWord[0]
          $scope.$apply()
          // $("#word")[0].play()
          speak($scope.currentWord)
          document.getElementById("wordField").value=''
          wrong = false
        }
      } else {
        letterIndex++
        $scope.currentLetter = $scope.currentWord[letterIndex]
      }
    } else {
      $("#buzz")[0].play()
      wrong = true
    }
  })
})

// Create a new utterance for the specified text and add it to
// the queue.
function speak(text) {
// Create a new instance of SpeechSynthesisUtterance.
var msg = new SpeechSynthesisUtterance()

// Set the text.
msg.text = text

// Set the attributes.
msg.volume = 1
msg.rate = 1
msg.pitch = 1

// If a voice has been selected, find the voice and set the
// utterance instance's voice attribute.
msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Google US English' })[0]

// Queue this utterance.
window.speechSynthesis.speak(msg)
}
