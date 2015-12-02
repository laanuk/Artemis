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
  $scope.errors = $routeParams.errors
  $scope.correct = $routeParams.words
  $scope.report = 'Score Report\n\nName : ' + $scope.name + '\n\nErrors : ' + $scope.errors + '\n\nErrors were made on words : ' + $scope.correct

  if ($scope.correct == 'null') {
    $scope.correct = 'None'
    $scope.errors = 'None'
    $scope.$apply()
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
