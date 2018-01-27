//main purpose of this component is to initiate svg canvas and delegate events on it to correct service.
function WorkSpaceCtrl(serviceSvg, serviceCase, servicePartition) {
  var ctrl = this
  ctrl.mouseDown = false
  ctrl.currentEditMode = null

  ctrl.$onInit = function() {
    //get reference to SVG canvas
    serviceSvg.svgEl = document.querySelector('svg');

    //setup event handlers for SVG canvas (query serviceCase for editing modes)
    document.addEventListener("mousedown", ctrl.onSvgElDown)
    serviceSvg.svgEl.addEventListener('mousemove', ctrl.onPartitionMove)
    document.addEventListener("mouseup", ctrl.onSvgElUp)
  }

  ctrl.onSvgElDown = function(event) {
    //push current edit state for restore on up
    ctrl.currentEditMode = serviceCase.editMode

    //switch for edit mode
    ctrl.mouseDown = true
    if (serviceCase.editMode === "partition") {
      servicePartition.eventOnDown(event)
    }
    if (serviceCase.editMode === "seg") {
      servicePartition.eventOnDown(event)
    }
  }
  ctrl.onSvgElUp = function(event) {
    console.log("onSvgElUp")
    ctrl.mouseDown = false
    serviceCase.editMode = ctrl.currentEditMode

    if(ctrl.currentEditMode === "partition") {
      servicePartition.eventOnUp(event)
    }
  }

  ctrl.onPartitionMove = function(event) {
    if (serviceCase.editMode === "movePartition" && ctrl.mouseDown) {
      servicePartition.eventOnMove(event)
    }
  }

}

angular.module('app').component('workSpace', {
  templateUrl: 'workSpace.html',
  controller: WorkSpaceCtrl
})
WorkSpaceCtrl.$inject = ['serviceSvg', 'serviceCase', 'servicePartition']
