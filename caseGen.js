//$scope, $element, $attrs
function CaseGenCtrl(serviceCase) {
  var ctrl = this

  ctrl.$onInit = function() {

  }

  ctrl.plotCase = function(w, h) {
    console.log("w: ", w)
    console.log("h: ", h)
    let rootWidth = w
    let rootHeight = h

    idTicker = 0;

    while (serviceCase.svgEl.firstChild) {
      serviceCase.svgEl.removeChild(serviceCase.svgEl.firstChild);
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

    let lineTop = serviceCase.createLine(serviceCase.rootNode.upperLeftX, serviceCase.rootNode.upperLeftY, serviceCase.rootNode.lowerRightX, serviceCase.rootNode.upperLeftY, serviceCase.rootNode.faceId)
    let lineRight = serviceCase.createLine(serviceCase.rootNode.lowerRightX, serviceCase.rootNode.upperLeftY, serviceCase.rootNode.lowerRightX, serviceCase.rootNode.lowerRightY, serviceCase.rootNode.faceId)
    let lineBottom = serviceCase.createLine(serviceCase.rootNode.lowerRightX, serviceCase.rootNode.lowerRightY, serviceCase.rootNode.upperLeftX, serviceCase.rootNode.lowerRightY, serviceCase.rootNode.faceId)
    let lineLeft = serviceCase.createLine(serviceCase.rootNode.upperLeftX, serviceCase.rootNode.lowerRightY, serviceCase.rootNode.upperLeftX, serviceCase.rootNode.upperLeftY, serviceCase.rootNode.faceId)
    serviceCase.svgEl.append(lineTop)
    serviceCase.svgEl.append(lineRight)
    serviceCase.svgEl.append(lineBottom)
    serviceCase.svgEl.append(lineLeft)

    // create initial touch-face for case (used to be traverseTree(plotPartition))
    serviceCase.traverseTree(serviceCase.plotTouchFace)
  }
}

angular.module('app').component('caseGen', {
  templateUrl: 'caseGen.html',
  controller: CaseGenCtrl
  // bindings: {}
})

CaseGenCtrl.$inject = ['serviceCase']
