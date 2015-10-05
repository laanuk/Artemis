var app = angular.module('setup', [])

app.controller('setupCtrl', function ($scope) {
  $scope.wordFile = 'null'
  var fileInput = document.getElementById('fileInput');

  $scope.start = function(game) {
    console.log('starting game')
    console.log('Game Options: ')
    console.log('Name ' + game.name)
    console.log('key options ' + game.keys)
    console.log('rounds ' + game.rounds)
    console.log('word List ' + game.words)
    console.log('help ' + game.help)
    console.log('wordFile ' + $scope.wordFile)

  }

  fileInput.addEventListener('change', function(e) {
      console.log('changed file')
      var file = fileInput.files[0];
			var textType = /text.*/;

			if (file.type.match(textType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					$scope.wordFile = reader.result;
          $scope.$apply()
				}

				reader.readAsText(file);
			} else {
				console.log("File not supported!")
			}
		});

})
