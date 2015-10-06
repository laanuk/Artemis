var app = angular.module('artemis.score', ['ngRoute'])

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/score/:name/:percent/:words/:errors', {
    templateUrl: 'score/score.html',
    controller: 'scoreCtrl'
  })
}])

app.controller('scoreCtrl', function ($scope, $routeParams) {
  console.log('Score Params')
  console.log($routeParams)
  $scope.name = $routeParams.name
  $scope.percent = (100 * (1 - $routeParams.percent)) + '%'
  $scope.words = []
  $scope.report = 'Score Report\nName : ' + $scope.name + '\nPercent : ' + $scope.percent + '\nErrors : ' + $routeParams.errors

  if ($routeParams.words == 'null') {
    $scope.words = [{correct : 'None', error : 'Everything was correct'}]
  } else {
    var correct = $routeParams.words.split(',')
    var errors = $routeParams.errors.split(',')
    for (var i = 0; i < correct.length; i++) {
      $scope.words[i] = {correct : correct[i], error : errors[i]}
    }
  }

  $scope.save = function() {
    console.log('saving file')
    var link = document.getElementsByClassName('waves-effect waves-light btn')[0]
    link.href = makeTextFile($scope.report)
  }
})

makeTextFile = function (text) {
  var data = new Blob([text], {type: 'text/plain'})

  var textFile = window.URL.createObjectURL(data)

  return textFile
}
