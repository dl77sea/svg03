// partitioning feature controller
function CasePartitionCtrl(servicePartition) {
  var ctrl = this

  ctrl.srv = servicePartition

  ctrl.$onInit = function() {
    servicePartition.orientation = "hrz"
    servicePartition.type = "single"
  }
}

angular.module('app').component('casePartition', {
  templateUrl: 'casePartition.html',
  controller: CasePartitionCtrl
  // bindings: {}
})

CasePartitionCtrl.$inject = ['servicePartition']
