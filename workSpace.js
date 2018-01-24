function WorkSpaceCtrl(serviceSvg, serviceCase, servicePartition) {
  var ctrl = this

  ctrl.$onInit = function() {
    //get reference to SVG canvas
    serviceSvg.svgEl = document.querySelector('svg');

    //setup event handlers for SVG canvas (query serviceCase for editing modes)
    serviceSvg.svgEl.addEventListener("mousedown", ctrl.svgElDown)
  }

  ctrl.segOnDown = function(event) {
    console.log("hit seg")
  }

  ctrl.svgElDown = function(event) {
    console.log("svg on down")
    
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
