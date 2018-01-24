// case creation feature controller
angular.module('app').component('caseGen', {
  templateUrl: 'caseGen.html',
  controller: CaseGenCtrl
  // bindings: {}
})

CaseGenCtrl.$inject = ['serviceSvg','serviceCase', 'servicePartition']

function CaseGenCtrl(serviceSvg, serviceCase, servicePartition) {
  var ctrl = this

  ctrl.$onInit = function() {

  }

  ctrl.plotCase = function(w, h) {
    let rootWidth = w
    let rootHeight = h

    while (serviceSvg.svgEl.firstChild) {
      serviceSvg.svgEl.removeChild(serviceSvg.svgEl.firstChild);
    }

    serviceCase.rootNode = new serviceCase.Node(
      (rootWidth / 2) * (-1), rootHeight,
      (rootWidth / 2), 0,
      0,
      serviceCase.stickNone)

    // partition(rootNode, 3, 75, "hrz")
    // partitionEquals(findNode(2), 3, "vrt")
    // partition(findNode(4), 3, 38, "hrz")
    // partitionEquals(findNode(5), 3, "hrz")
    // partition(findNode(1), 10, 3, "vrt")
    // partitionEquals(findNode(7), 3, "vrt")

    let lineTop = serviceSvg.createLine(serviceCase.rootNode.upperLeftX, serviceCase.rootNode.upperLeftY, serviceCase.rootNode.lowerRightX, serviceCase.rootNode.upperLeftY, serviceCase.rootNode.faceId)
    let lineRight = serviceSvg.createLine(serviceCase.rootNode.lowerRightX, serviceCase.rootNode.upperLeftY, serviceCase.rootNode.lowerRightX, serviceCase.rootNode.lowerRightY, serviceCase.rootNode.faceId)
    let lineBottom = serviceSvg.createLine(serviceCase.rootNode.lowerRightX, serviceCase.rootNode.lowerRightY, serviceCase.rootNode.upperLeftX, serviceCase.rootNode.lowerRightY, serviceCase.rootNode.faceId)
    let lineLeft = serviceSvg.createLine(serviceCase.rootNode.upperLeftX, serviceCase.rootNode.lowerRightY, serviceCase.rootNode.upperLeftX, serviceCase.rootNode.upperLeftY, serviceCase.rootNode.faceId)

    serviceSvg.svgEl.append(lineTop)
    serviceSvg.svgEl.append(lineRight)
    serviceSvg.svgEl.append(lineBottom)
    serviceSvg.svgEl.append(lineLeft)

    // create initial touch-face for case (used to be traverseTree(plotPartition))
    serviceCase.traverseTree(servicePartition.plotTouchFace)
  }
}
