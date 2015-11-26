/* global angular, $, FileReader */

var app = angular.module('artemis.setup', ['ngRoute'])

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'setup/setup.html',
    controller: 'setupCtrl'
  })
}])

app.controller('setupCtrl', function ($scope, $window) {
  $(document).ready(function () {
    $('select').material_select()
    $('.file-field').each(function() {
      var path_input = $(this).find('input.file-path');
      $(this).find('input[type="file"]').change(function () {
        path_input.val($(this)[0].files[0].name)
        path_input.trigger('change')
      })
    })
  })

  var fileInput = document.getElementById('fileInput')

  /* For Testing */
  // $scope.name = 'Player1'
  // $scope.keys = 'QWERTY'
  // $scope.rounds = 2
  // $scope.words = 'list, test, me, out'

  $scope.keyOptions = ['qwerty', 'magicspell']

  $scope.wordFile = 'null'

  $scope.start = function (game) {
    console.log('starting game')

    var words = ''
    if (game.words !== undefined) {
      words = game.words
    } else {
      words = $scope.wordFile
    }

    $window.location.href = '/app#!/game/' + game.name + "/" + game.keys + "/"
                            + game.rounds + "/" + words
  }

  fileInput.addEventListener('change', function (e) {
    console.log('changed file')
    var file = fileInput.files[0]
    var textType = /text.*/

    if (file.type.match(textType)) {
      var reader = new FileReader()

      reader.onload = function (e) {
        $scope.wordFile = reader.result
        $scope.wordFile = $scope.wordFile.replace(/(?:\r\n|\r|\n)/g, ',');
        console.log($scope.wordFile)
        $scope.$apply()
      }

      reader.readAsText(file)
    } else {
      console.log('File not supported!')
    }
  })
})
