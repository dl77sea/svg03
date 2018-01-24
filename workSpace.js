//main purpose of this component is to initiate svg canvas and delegate events on it to correct service.
function WorkSpaceCtrl(serviceSvg, serviceCase, servicePartition) {
  var ctrl = this

  ctrl.$onInit = function() {
    //get reference to SVG canvas
    serviceSvg.svgEl = document.querySelector('svg');

    //setup event handlers for SVG canvas (query serviceCase for editing modes)
    serviceSvg.svgEl.addEventListener("mousedown", ctrl.svgElDown)
  }

  ctrl.svgElDown = function(event) {
    //switch for edit mode
    if (serviceCase.editMode === "partition") {
      servicePartition.eventOnDown(event)
    }
  }
}

angular.module('app').component('workSpace', {
  templateUrl: 'workSpace.html',
  controller: WorkSpaceCtrl
})
WorkSpaceCtrl.$inject = ['serviceSvg', 'serviceCase', 'servicePartition']
