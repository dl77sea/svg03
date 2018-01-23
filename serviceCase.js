//single source of truth, model data for case tree and editing state -all components manipulate this data.
angular.module('app').service('serviceCase', serviceCase)

function serviceCase() {
  var vm = this

  vm.panelThickness = 4;
  vm.editMode = "partition"

  // use for naming IDs uniquely
  vm.idTicker = 0

  //objects needed to represent case
  vm.Stick = class Stick {
    constructor(strOrientation) {
      this.vrt = false;
      this.hrz = false;
      if (strOrientation === "hrz") this.hrz = true
      if (strOrientation === "vrt") this.vrt = true
    }
  }

  vm.stickHrz = new vm.Stick("hrz")
  vm.stickVrt = new vm.Stick("vrt")
  vm.stickNone = new vm.Stick("")

  vm.Node = class Node {
    //get click event origin x and y, orientation mode (assume event coords already translated to face clicked)
    constructor(faceUlX, faceUlY, faceLrX, faceLrY, dataId, stick) {
      //ID (an integer)
      //("face" or "seg" prefixes are appended to reference html elements)
      this.faceId = dataId

      //face upper left, lower right
      this.upperLeftX = faceUlX
      this.upperLeftY = faceUlY

      this.lowerRightX = faceLrX
      this.lowerRightY = faceLrY

      //touch face
      this.width = this.lowerRightX - faceUlX
      this.height = this.upperLeftY - faceLrY

      //stick (this is where info about the stick is contained if node has stick)
      this.hrz = false
      this.vrt = false
      if (stick.hrz) this.hrz = true
      if (stick.vrt) this.vrt = true

      //children (left and right or top and bottom partitions)
      this.children = []
    }
  }

  //functions needed to generate parts of case
  vm.createLine = function(x1, y1, x2, y2, id) {
    let line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('id', id)
    line.setAttribute('data', "seg")
    line.setAttribute('class', 'lineseg')
    line.setAttribute('x1', x1)
    line.setAttribute('y1', y1)
    line.setAttribute('x2', x2)
    line.setAttribute('y2', y2)
    return line
  }

  vm.createRect = function(x, y, w, h, id) {
    let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('id', id)
    rect.setAttribute('data', "face")
    rect.setAttribute('class', "touchface")
    rect.setAttribute('x', x + vm.panelThickness / 2)
    rect.setAttribute('y', y - vm.panelThickness / 2)
    rect.setAttribute('width', w - vm.panelThickness / 2)
    rect.setAttribute('height', h - vm.panelThickness / 2)

    return rect
  }

  vm.traverseTree = function(fn) {
    //handle node 0
    fn(vm.rootNode)

    // handle rest of nodes in tree
    let nodes = [vm.rootNode]

    while (nodes.length > 0) {
      let node = nodes.pop()
      if (node.children.length > 0) {
        for (node of node.children) {
          fn(node)
          nodes.push(node)
        }
      }
    }
  }

  vm.findNode = function(faceId) {
    let n = null
    vm.traverseTree(function(node) {
      if (faceId === node.faceId) n = node
    })
    return n
  }


  vm.plotTouchFace = function(node) {
    // plot touch rectangles (for every empty node)
    if (node.children.length === 0) {
      // <rect x="100" y="0" width="50" height="100">
      let rect = vm.createRect(node.upperLeftX, node.lowerRightY, node.width, node.height, node.faceId)

      vm.svgEl.append(rect)
    }
  }

  // vm.setSvg() {
  //
  // }
  vm.svgEl = null
  vm.rootNode = null
}
