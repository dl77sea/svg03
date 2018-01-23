function WorkSpaceCtrl(serviceCase, servicePartition) {
  var ctrl = this

  ctrl.$onInit = function() {
    //get reference to SVG canvas
    serviceCase.svgEl = document.querySelector('svg');

    //setup event handlers for SVG canvas (query serviceCase for editing modes)
    serviceCase.svgEl.addEventListener("mousedown", ctrl.svgElDown);
  }

  ctrl.getSvgPoint = function(domX, domY) {
    let pt = serviceCase.svgEl.createSVGPoint();
    pt.x = domX;
    pt.y = domY;
    let svgP = pt.matrixTransform(serviceCase.svgEl.getScreenCTM().inverse())
    return svgP;
  }

  ctrl.getFaceHitPt = function(event) {
    let recOriginX = event.target.getAttribute('x')
    let recOriginY = event.target.getAttribute('y')

    let svgHitPt = ctrl.getSvgPoint(event.clientX, event.clientY)

    recHitPt = {
      x: svgHitPt.x - recOriginX,
      y: svgHitPt.y - recOriginY
    }

    return recHitPt
  }

  ctrl.segOnDown = function(event) {
    console.log("hit seg")
  }

  ctrl.faceOnDown = function(event) {
    let hitPt = ctrl.getFaceHitPt(event)

    // radioButtonsPartitionType = document.getElementsByName('partition-orientation')
    // if (radioButtonsPartitionType[0].checked) {
    //   orientation = "hrz"
    // } else {
    //   orientation = "vrt"
    // }

    let orientation = servicePartition.orientation //set from partition template
    let partitionNums = servicePartition.partitionNums
    let partitionType = servicePartition.type
    // let partitionTypes = document.getElementsByName('partition-type')
    // for (pt of partitionTypes) {
    //   if (pt.checked === true) {
    //     partitionType = pt.value
    //     partitionNums = document.getElementById('input-parteq').value
    //   }
    // }


    if (partitionType === "single") {
      servicePartition.partition(serviceCase.findNode(parseInt(event.target.getAttribute('id'))), hitPt.x, hitPt.y, servicePartition.orientation)
    } else {
      servicePartition.partitionEquals(serviceCase.findNode(parseInt(event.target.getAttribute('id'))), servicePartition.partitionNums, servicePartition.orientation)
    }
  }

  ctrl.svgElDown = function(event) {
    //switch for edit mode
    if (serviceCase.editMode === "partition") {
      if (event.target.getAttribute('data') === "face") {
        console.log("hit face")
        ctrl.faceOnDown(event)
      }
      if (event.target.getAttribute('data') === "seg") {
        ctrl.segOnDown(event)
      }
    }
  }

}
angular.module('app').component('workSpace', {
  templateUrl: 'workSpace.html',
  controller: WorkSpaceCtrl
})
WorkSpaceCtrl.$inject = ['serviceCase', 'servicePartition']
