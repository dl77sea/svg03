// functions to partition case tree (serviceCase)
angular.module('app').service('servicePartition', servicePartition)
servicePartition.$inject = ['serviceSvg', 'serviceCase']

function servicePartition(serviceSvg, serviceCase) {
  var vm = this

  vm.partitionNums = 2
  vm.orientation = "hrz"
  vm.type = "single"

  vm.connections = null

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
      vm.plotPartition(child)
    }
  }

  vm.createRect = function(x, y, w, h, id) {
    let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('id', id)
    rect.setAttribute('data', "face")
    rect.setAttribute('class', "touchface")
    rect.setAttribute('x', x + serviceCase.panelThickness / 2)
    rect.setAttribute('y', y + serviceCase.panelThickness / 2)
    rect.setAttribute('width', w - serviceCase.panelThickness)
    rect.setAttribute('height', h - serviceCase.panelThickness)

    return rect
  }

  vm.modRect = function(idn, ulX, ulY, lrX, lrY) {
    console.log("entered modRect args: ", ulX, ulY, lrX, lrY)
    let rect = serviceSvg.getRectById(idn)
    console.log("entered modRect rect: ", rect)

    rect.setAttribute('x',ulX + serviceCase.panelThickness / 2)
    rect.setAttribute('y',lrY + serviceCase.panelThickness / 2)
    rect.setAttribute('width', lrX-ulX - serviceCase.panelThickness)
    rect.setAttribute('height',ulY-lrY - serviceCase.panelThickness)
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

  //called from workspace
  vm.eventOnDown = function(event) {
    //make new partitions
    if (event.target.getAttribute('data') === "face") {
      vm.eventOnDownFace(event)
    }

    //init move partitions
    if (event.target.getAttribute('data') === "seg") {
      vm.eventOnDownSeg(event)
      // vm.commonAxis = serviceCase.findNode(parseInt(event.target.getAttribute('id'))).common
      let connections = serviceCase.getConnections(serviceCase.findNode(parseInt(event.target.getAttribute('id'))))
      console.log("common: ", connections.common)
      //build array of line-ends to be modied by move, from connections lines
      let endConnections = []
      for (let line of connections.lines) {
        if (parseInt(line.getAttribute('y1')) === parseInt(connections.common)) {
          console.log("found y1: ", line)
          endConnections.push({
            line: line,
            end: 'y1'
          })
        } else {
          endConnections.push({
            line: line,
            end: 'y2'
          })
        }
      }
      connections.endConnections = endConnections
      vm.connections = connections
      serviceCase.editMode = "movePartition"
    }
  }

  //move partitions (only handles lines)
  vm.eventOnMove = function(event) {
    if (vm.connections !== null) {

      if (vm.connections.orientation === "hrz") {
        console.log("move")
        vm.connections.selectedLine.setAttribute('y1', serviceSvg.getSvgPoint(event.clientX, event.clientY).y)
        vm.connections.selectedLine.setAttribute('y2', serviceSvg.getSvgPoint(event.clientX, event.clientY).y)
        for (let connection of vm.connections.endConnections) {
          console.log("connection: ", connection)
          connection.line.setAttribute(connection.end, serviceSvg.getSvgPoint(event.clientX, event.clientY).y)
        }
      }
    }
  }

  vm.updateSelectedPartition = function (node) {
    console.log("entered updateSelectedPartition prm", node) //2
    console.log("entered updateSelectedPartition adj", serviceCase.findNode(1)) //1
    node.faceId = 1000

    if(node.hrz) {
      // node. // use findNode to get reference to modifcation .. 
    }
  }

  //updates tree nodes representing connections to selected and svg touch-face rects based on lines
  vm.cbUpdateConnections = function(currentNode) {
    console.log("currentNode", currentNode)
    // console.log("tt node: ", currentNode)
    //for each node in tree, check if it contains children...
    if (currentNode.children.length > 0) {
      //...check if one of the children is an affected line...
      for (let i = 0; i < currentNode.children.length; i++) {
        console.log("A: currentNode children length: ", currentNode.children.length)
        if (currentNode.children[i].vrt || currentNode.children[i].hrz) {
          console.log("B")
          for (let line of vm.connections.lines) {
            console.log("C")
            console.log("currentNode i: ", i)
            if (parseInt(currentNode.children[i].faceId) === parseInt(line.id)) {
              console.log("D")
              //...update that node's face and rect, and it's sibling to the left (on vrt partitions)...
              console.log("match node: ", currentNode.children[i])
              if (currentNode.children[i].vrt) {
                console.log("match line: ", serviceSvg.getLineById(parseInt(currentNode.children[i].faceId)))
                let matchLine = serviceSvg.getLineById(parseInt(currentNode.children[i].faceId))
                currentNode.children[i].upperLeftY = matchLine.getAttribute('y1')
                currentNode.children[i].lowerRightY = matchLine.getAttribute('y2')
                currentNode.children[i].height = matchLine.getAttribute('y1') - matchLine.getAttribute('y2')
                console.log("matchline new height: ", matchLine.getAttribute('y1')-matchLine.getAttribute('y2'))
                vm.modRect(
                  parseInt(currentNode.children[i].faceId),
                  currentNode.children[i].upperLeftX,
                  currentNode.children[i].upperLeftY,
                  currentNode.children[i].lowerRightX,
                  currentNode.children[i].lowerRightY )
              } else {
                //hrz
                // currentNode.children[i].upperLeftX =
                // currentNode.children[i].upperLeftY =
                // currentNode.children[i].lowerRightX =
                // currentNode.children[i].lowerRightY =
              }

              console.log("adjacent node: ", currentNode.children[i - 1])
              if (currentNode.children[i].vrt) {
                console.log("match line: ", serviceSvg.getLineById(parseInt(currentNode.children[i].faceId)))
                matchLine = serviceSvg.getLineById(parseInt(currentNode.children[i].faceId))
                currentNode.children[i-1].upperLeftY = matchLine.getAttribute('y1')
                currentNode.children[i-1].lowerRightY = matchLine.getAttribute('y2')
                console.log("matchline new height: ", matchLine.getAttribute('y1')-matchLine.getAttribute('y2'))
                currentNode.children[i-1].height = matchLine.getAttribute('y1')-matchLine.getAttribute('y2')
                vm.modRect(
                  parseInt(currentNode.children[i-1].faceId),
                  currentNode.children[i-1].upperLeftX,
                  currentNode.children[i-1].upperLeftY,
                  currentNode.children[i-1].lowerRightX,
                  currentNode.children[i-1].lowerRightY )
              } else {
                //hrz
                // currentNode.children[i].upperLeftX =
                // currentNode.children[i].upperLeftY =
                // currentNode.children[i].lowerRightX =
                // currentNode.children[i].lowerRightY =
              }

            }
          }
        }
      }
    }
  }

  vm.eventOnUp = function(event) {
    console.log("service partition up")
    if (vm.connections !== null) {
      vm.updateSelectedPartition(serviceCase.findNode(parseInt(vm.connections.selectedLine.getAttribute('id'))))

      if (vm.connections.orientation === "hrz") {
        console.log("service partition up: hrz")
        //update tree
        serviceCase.traverseTree(vm.cbUpdateConnections)
      }
      if (vm.connections.orientation === "vrt") {
        console.log("service partition up: vrt")
      }
    }
  }
}
