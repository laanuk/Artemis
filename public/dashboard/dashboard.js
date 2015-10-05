/* global Chart */

var app = angular.module('pillPal.dashboard', ['ngRoute'])

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'dashboard/dashboard.html',
    controller: 'dashboardCtrl'
  })
}])

app.controller('dashboardCtrl', function ($scope) {
  $scope.summary = {}
  $scope.summary.texts_sent = 12735
  $scope.summary.success_responses = 11496

  var initializeGraphs = function () {
    $scope.textsSent = $scope.summary.texts_sent
    $scope.responsesGot = $scope.summary.success_responses
    if ($scope.textsSent === 0) {
      $scope.adherance = 0
    } else {
      $scope.adherance = Math.round($scope.responsesGot / $scope.textsSent * 100)
    }
    $scope.adherencePercentage = adherencePercentage

    /* FEED ME */
    // $scope.adherance = 86
    $scope.clinicName = 'Vertex Health Group'
    var adherenceByMed = [78, 59, 45, 94, 88, 91]
    var adherenceByMedLabels = ['Statin', 'Aspirin', 'ACE Inhibitor', 'Beta Blocker', 'Atropine', 'Albuterol']
    var adherencePercentage = $scope.adherance
    /* This is 90 days of data, seperated into 5-day chunks*/
    var adherenceByDay = [21, 24, 35, 47, 49, 53, 61, 59, 64, 70, 73, 74, 78, 78, 83, 84, 85, 86, 88]
    /* $scope.textsSent = 67
      $scope.responsesGot = 58 */
    /* End of data provided by factory */

    var daysList = []
    for (var i = -90; i <= 0; i = i + 5) {
      daysList.push(i + ' days')
    }

    // Get the context of the canvas element we want to select
    var lineCtx = document.getElementById('lineGraph').getContext('2d')
    var lineGraphSteps = 5
    var lineOptions = {
      bezierCurve: false,
      scaleOverride: true,
      scaleSteps: lineGraphSteps,
      scaleStepWidth: Math.ceil(100 / lineGraphSteps),
      scaleStartValue: 0,
      showXLabels: 10,
      responsive: true,
      pointDot: false,
      scaleShowGridLines: false,
      datasetFill: false
    }
    var lineData = {
      labels: daysList,
      datasets: [
        {
          label: 'Patient Medication Adherence over Time',
          fillColor: 'rgba(52,52,255,0.4)',
          strokeColor: 'rgba(220,220,220,1)',
          pointColor: 'rgba(220,220,220,1)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(220,220,220,1)',
          data: adherenceByDay
        }
      ]
    }
    new Chart(lineCtx).Line(lineData, lineOptions)

    var barCtx = document.getElementById('barGraph').getContext('2d')
    var barGraphSteps = 5
    var barOptions = {
      scaleOverride: true,
      scaleSteps: barGraphSteps,
      scaleStepWidth: Math.ceil(100 / barGraphSteps),
      scaleStartValue: 0,
      responsive: true,
      scaleShowGridLines: false,
      barShowStroke: false
    }

    var oldMed = adherenceByMed.slice()
    var oldLabels = adherenceByMedLabels.slice()
    adherenceByMed.sort()
    for (i = 0; i < adherenceByMed.length; i++) {
      adherenceByMedLabels[i] = oldLabels[oldMed.indexOf(adherenceByMed[i])]
    }

    var barData = {
      labels: adherenceByMedLabels,
      datasets: [
        {
          label: 'Patient Medication Adherence by Medication',
          data: adherenceByMed
        }
      ]
    }
    var barChart = new Chart(barCtx).Bar(barData, barOptions)
    for (i = 0; i < adherenceByMed.length; i++) {
      var fillColor
      var highlightColor
      if (adherenceByMed[i] < 60) {
        fillColor = 'rgba(242, 38, 19, 0.15)'
        highlightColor = 'rgba(242, 38, 19, 0.35)'
      } else {
        fillColor = 'rgba(238, 238, 238, 0.5)'
        highlightColor = 'rgba(238, 238, 238, 1)'
      }
      barChart.datasets[0].bars[i].fillColor = fillColor
      barChart.datasets[0].bars[i].strokeColor = fillColor
      barChart.datasets[0].bars[i].highlightFill = highlightColor
      barChart.datasets[0].bars[i].highlightStroke = highlightColor
    }
    barChart.update()

    var doughnutCtx = document.getElementById('doughnutGraph').getContext('2d')
    var adherenceValue = [
      {
        value: adherencePercentage,
        color: 'lightblue',
        highlight: 'azure'
      },
      {
        value: 100 - adherencePercentage,
        color: 'white'
      }]
    var doughnutOptions = {
      showTooltips: false,
      responsive: true,
      percentageInnerCutout: 75,
      animationEasing: 'easeInCubic',
      // adapted from http://jsbin.com/wapono/13/edit
      onAnimationComplete: function () {
        var canvasWidthvar = $('#doughnutGraph').width()
        var canvasHeight = $('#doughnutGraph').height()
        var constant = 114
        var fontsize = (canvasHeight / constant).toFixed(2)
        // ctx.font='2.8em Verdana'
        doughnutCtx.font = fontsize + 'em Helvetica Neue,Helvetica,Arial,sans-serif'
        doughnutCtx.fillStyle = 'black'
        doughnutCtx.textBaseline = 'middle'
        var tpercentage = adherencePercentage + '%'
        var textWidth = doughnutCtx.measureText(tpercentage).width
        var txtPosx = Math.round((canvasWidthvar - textWidth) / 2)
        doughnutCtx.fillText(tpercentage, txtPosx, canvasHeight / 2)

        doughnutCtx.font = fontsize / 2 + 'em Helvetica Neue,Helvetica,Arial,sans-serif'
        doughnutCtx.fillStyle = '#888'
        doughnutCtx.textBaseline = 'middle'
        var adherenceWord = 'Adherence'
        textWidth = doughnutCtx.measureText(adherenceWord).width
        txtPosx = Math.round((canvasWidthvar - textWidth) / 2)
        doughnutCtx.fillText(adherenceWord, txtPosx, canvasHeight / 2 + 8 + fontsize * 12)
      }
    }

    new Chart(doughnutCtx).Doughnut(adherenceValue, doughnutOptions)
  }

  // TODO: put this in the data loader promise callback
  initializeGraphs()
})
