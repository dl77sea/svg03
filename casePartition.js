//$scope, $element, $attrs
function CasePartitionCtrl(servicePartition) {
  var ctrl = this

  ctrl.$onInit = function() {

  }

  ctrl.updateOrientation = function(orientation) {
    servicePartition.orientation = orientation
  }

}

angular.module('app').component('casePartition', {
  templateUrl: 'casePartition.html',
  controller: CasePartitionCtrl
  // bindings: {}
})

CasePartitionCtrl.$inject = ['servicePartition']
