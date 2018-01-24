//$scope, $element, $attrs
function CasePartitionCtrl(servicePartition) {
  var ctrl = this

  ctrl.srv = servicePartition

  ctrl.$onInit = function() {
    servicePartition.orientation = "hrz"
    servicePartition.type = "single"
  }
  ctrl.show = function() {
    console.log(servicePartition.orientation)
  }
}

angular.module('app').component('casePartition', {
  templateUrl: 'casePartition.html',
  controller: CasePartitionCtrl
  // bindings: {}
})

CasePartitionCtrl.$inject = ['servicePartition']
