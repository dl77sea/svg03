// functions to partition case tree (serviceCase)
angular.module('app').service('servicePartition', servicePartition)

servicePartition.$inject = ['serviceSvg', 'serviceCase']

function servicePartition(serviceSvg, serviceCase) {
  var vm = this

  vm.partitionNums = 2
  vm.orientation = "hrz"
  vm.type = "single"

  //will always recieve newly created nodes upon partition-edit-mode user click
  vm.plotPartition = function(node) {

    //add touch face
    vm.plotTouchFace(node)

    // plot partition line (for every node with an hrz or vrt true)
    //hrz plotted on upperLeftY
    if (node.hrz) {
      //on upperLeftY
      let line = serviceSvg.createLine(node.upperLeftX, node.upperLeftY, node.lowerRightX, node.upperLeftY, node.faceId)
      serviceSvg.svgEl.append(line)
    }

    //vrt plotted on upperLeftX
    if (node.vrt) {
      // on lowerRightX
      // let line=createLine(node.lowerRightX, node.upperLeftY, node.lowerRightX, node.lowerRightY, node.faceId)
      let line = serviceSvg.createLine(node.upperLeftX, node.upperLeftY, node.upperLeftX, node.lowerRightY, node.faceId)
      serviceSvg.svgEl.append(line)
    }
  }

  vm.deleteTouchFace = function() {
    console.log("delete palceholder")
  }

  //receives node clicked on
  //partition: adds a stick to clicked on face node, and two children (one for each partition)
  vm.partition = function(clickedFaceNode, faceEventX, faceEventY, orientation) {

    //delete touch face from clicked face's node (useful for 3d version)
    vm.deleteTouchFace(clickedFaceNode)

    //add children and stick
    if (orientation === "hrz") {
      //hrz

      //add face id (used for associating stick with face, when stick is selected)
      //update id ticker to get unique name for IDs
      serviceCase.idTicker++

        //left node (top partition)
        clickedFaceNode.children.push(new serviceCase.Node(
          clickedFaceNode.upperLeftX,
          clickedFaceNode.upperLeftY,
          clickedFaceNode.lowerRightX,
          faceEventY + clickedFaceNode.lowerRightY,
          serviceCase.idTicker,
          serviceCase.stickNone))

      serviceCase.idTicker++
        //right node (bottom partition):
        clickedFaceNode.children.push(new serviceCase.Node(
          clickedFaceNode.upperLeftX,
          faceEventY + clickedFaceNode.lowerRightY,
          clickedFaceNode.lowerRightX,
          clickedFaceNode.lowerRightY,
          serviceCase.idTicker,
          serviceCase.stickHrz))
    } else {
      //vrt

      //add face id (used for associating stick with face, when stick is selected)
      //update id ticker to get unique name for IDs
      serviceCase.idTicker++
        //left node (left partition)
        clickedFaceNode.children.push(new serviceCase.Node(
          clickedFaceNode.upperLeftX,
          clickedFaceNode.upperLeftY,
          faceEventX + clickedFaceNode.upperLeftX,
          clickedFaceNode.lowerRightY,
          serviceCase.idTicker,
          serviceCase.stickNone))

      serviceCase.idTicker++
        //right node (right partition)
        clickedFaceNode.children.push(new serviceCase.Node(
          faceEventX + clickedFaceNode.upperLeftX,
          clickedFaceNode.upperLeftY,
          clickedFaceNode.lowerRightX,
          clickedFaceNode.lowerRightY,
          serviceCase.idTicker,
          serviceCase.stickVrt))
    }

    vm.plotPartition(clickedFaceNode.children[0]) //attach a touch face
    vm.plotPartition(clickedFaceNode.children[1]) //attach a touch face and a stick
  }

  vm.partitionEquals = function(clickedFaceNode, divisions, orientation) {
    //get partition width and height for equal divisions
    let partitionWidth = clickedFaceNode.width / divisions
    let partitionHeight = clickedFaceNode.height / divisions

    if (orientation === "hrz") {

      //hrz
      for (let i = 0; i < divisions; i++) {
        serviceCase.idTicker++
        if (i === divisions - 1) {
          stick = serviceCase.stickNone
        } else {
          stick = serviceCase.stickHrz
        }
        clickedFaceNode.children.push(new serviceCase.Node(
          //submit upper-left face point
          clickedFaceNode.upperLeftX,
          clickedFaceNode.lowerRightY + partitionHeight * (i + 1),
          //submit lower-right face point
          clickedFaceNode.lowerRightX,
          clickedFaceNode.lowerRightY + partitionHeight * i,
          serviceCase.idTicker,
          stick))
      }
    }

    if (orientation === "vrt") {
      for (let i = 0; i < divisions; i++) {
        serviceCase.idTicker++
        if (i === 0) {
          stick = serviceCase.stickNone
        } else {
          stick = serviceCase.stickVrt
        }
        clickedFaceNode.children.push(new serviceCase.Node(
          //submit upper-left face point
          clickedFaceNode.upperLeftX + partitionWidth * i,
          clickedFaceNode.upperLeftY,
          //submit lower-right face point
          clickedFaceNode.upperLeftX + partitionWidth * (i + 1),
          clickedFaceNode.lowerRightY,
          serviceCase.idTicker,
          stick))
      }
    }
    //attach touch faces
    for (child of clickedFaceNode.children) {
      console.log("pc")
      vm.plotPartition(child)
    }
  }

  vm.createRect = function(x, y, w, h, id) {
    let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('id', id)
    rect.setAttribute('data', "face")
    rect.setAttribute('class', "touchface")
    rect.setAttribute('x', x + serviceCase.panelThickness / 2)
    rect.setAttribute('y', y - serviceCase.panelThickness / 2)
    rect.setAttribute('width', w - serviceCase.panelThickness / 2)
    rect.setAttribute('height', h - serviceCase.panelThickness / 2)

    return rect
  }

  vm.plotTouchFace = function(node) {
    // plot touch rectangles (for every empty node)
    if (node.children.length === 0) {
      // <rect x="100" y="0" width="50" height="100">
      let rect = vm.createRect(node.upperLeftX, node.lowerRightY, node.width, node.height, node.faceId)
      serviceSvg.svgEl.append(rect)
    }
  }

  vm.getFaceHitPt = function(event) {
    let recOriginX = event.target.getAttribute('x')
    let recOriginY = event.target.getAttribute('y')

    let svgHitPt = serviceSvg.getSvgPoint(event.clientX, event.clientY)

    recHitPt = {
      x: svgHitPt.x - recOriginX,
      y: svgHitPt.y - recOriginY
    }

    return recHitPt
  }

  vm.eventOnDownFace = function() {
    let hitPt = vm.getFaceHitPt(event)
    let orientation = vm.orientation
    let partitionNums = vm.partitionNums
    let partitionType = vm.type
    if (partitionType === "single") {
      vm.partition(serviceCase.findNode(parseInt(event.target.getAttribute('id'))), hitPt.x, hitPt.y, vm.orientation)
    }
    if (partitionType === "equal") {
      vm.partitionEquals(serviceCase.findNode(parseInt(event.target.getAttribute('id'))), vm.partitionNums, vm.orientation)
    }
  }

  vm.eventOnDownSeg = function(event) {
    console.log("eventOnDownSeg placeholder")
  }

  vm.eventOnDown = function(event) {
    if (event.target.getAttribute('data') === "face") {      
      vm.eventOnDownFace(event)
    }
    if (event.target.getAttribute('data') === "seg") {
      vm.eventOnDownSeg(event)
    }
  }

}
