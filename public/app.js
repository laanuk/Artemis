var app = angular.module('artemis', ['artemis.navbar'])

app.controller('wordsCtrl', function ($scope) {
  $scope.words = ['dog', 'cat', 'bird', 'duck', 'frog']
  $scope.currentWord = $scope.words[0]
  $scope.currentLetter = $scope.currentWord[0]

  var wordIndex = 0
  var letterIndex = 0
  speak('Ready, spell')
  speak($scope.currentWord)

  $('#wordField').on('keyup', function(e) {
    var value = $(this).val()

    if (value == $scope.currentLetter) {
      speak($scope.currentLetter)

      if (letterIndex + 1 == $scope.currentWord.length) {
        if (wordIndex + 1  == $scope.words.length) {
          $("#end")[0].play()
        } else {
          //advance word
          wordIndex++
          letterIndex = 0
          $scope.currentWord = $scope.words[wordIndex]
          $scope.currentLetter = $scope.currentWord[0]
          $scope.$apply()
          // $("#word")[0].play()
          speak($scope.currentWord)
        }
      } else {
        letterIndex++
        $scope.currentLetter = $scope.currentWord[letterIndex]
      }
    } else {
      $("#buzz")[0].play()
    }

    document.getElementById("wordField").value=''
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
