//single source of truth, model data for case tree and editing state -all components manipulate this data.
angular.module('app').service('serviceCase', serviceCase)
serviceCase.$inject = ['serviceSvg']

function serviceCase(serviceSvg) {
  var vm = this
  vm.editMode = "partition"

  vm.panelThickness = 4;

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


  vm.getConnections = function(node) {
    let commonLines = []
    let commonAxis
    let orientation
    if (node.hrz) {
      orientation = "hrz"
      console.log("found hrz seg")
      console.log(node)
      hrzCommonY = node.height
      commonAxis = hrzCommonY

      selectedLine = serviceSvg.getLineById(node.faceId)

      //find all faces with a common Y value to hrz line face-node picked.
      //faceId value of face will be same as line's id.
      //push found lines by id into common-lines list.
      //points in common-lines list are what will be modified to by move event
      //(in addition to picked face's line).
      vm.traverseTree(function(currentNode) {
        if (
          (currentNode.vrt) &&
          (currentNode.upperLeftY === hrzCommonY ||
          currentNode.lowerRightY === hrzCommonY)
        ) {
          commonLines.push(serviceSvg.getLineById(currentNode.faceId))
        }
      })
    }



    if (node.vrt) {
      console.log("found vrt seg")
    }

    return { lines: commonLines, common: commonAxis, orientation: orientation, selectedLine: selectedLine }
  }

  vm.rootNode = null
}
