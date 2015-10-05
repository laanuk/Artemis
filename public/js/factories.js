var factories = angular.module('pillPal.factories', ['ngResource'])

factories.factory('Authentication', function ($resource) {
  var res = $resource('/api/session')
  var api = {}
  api.register = function (username, password) {
    return res.post({username: username, password: password})
  }
  api.login = function (username, password) {
    return res.put({username: username, password: password})
  }
  api.logout = function () {
    return res.delete()
  }
  api.getCurrentUser = function () {
    return res.get()
  }
  return api
})

factories.factory('Patients', function ($resource) {
  var api = {}
  api.all = function (query) {
    return $resource('/api/patients', {query: query}).query()
  }
  api.get = function (patientId) {
    return $resource('/api/patients/:id', {id: patientId}).get()
  }
  api.add = function (name, phoneNumber) {
    return $resource('/api/patients').save({name: name, phone: phoneNumber})
  }
  api.save = function (patient) {
    return $resource('/api/patients', null, {
      'update': { method: 'PUT' }
    }).update({patient: patient})
  }
  api.delete = function (patientId) {
    return $resource('/api/patients/:id', {id: patientId}).delete()
  }
  return api
})

factories.factory('Texts', function ($resource) {
  console.log('in Factory texts!')
  var api = {}
  api.add = function (newDrug, patient) {
    console.log('in factory add!')
    return $resource('/api/text', {drug: newDrug, patient: patient}).get()
  }
  return api
})
