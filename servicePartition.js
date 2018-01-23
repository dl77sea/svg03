//single source of truth, state data and controller functions for partitioning
//only casePartition modifies the data, but all components may use the functions.
//all components that need to, reference this data for partitioning state info.
angular.module('app').service('servicePartition', servicePartition)
angular.module('app').service('serviceCase', serviceCase);

// app.service('service2',['service1', function(service1) {}]);

function servicePartition(serviceCase) {
  var vm = this

  vm.partitionNums = 3
  vm.orientation = "hrz"
  vm.type = "single"

  //will always recieve newly created nodes upon partition-edit-mode user click
  vm.plotPartition = function(node) {
    console.log(node.children)

    //add touch face
    serviceCase.plotTouchFace(node)

    // plot partition line (for every node with an hrz or vrt true)

    //hrz plotted on upperLeftY
    if (node.hrz) {
      //on upperLeftY
      let line = serviceCase.createLine(node.upperLeftX, node.upperLeftY, node.lowerRightX, node.upperLeftY, node.faceId)

      // update all updatePartitions with move on down event
      // line.addEventListener('mousedown', function(event) {
      //   partitionEvent(getEditState(), line)
      // })

      serviceCase.svgEl.append(line)
    }

    //vrt plotted on upperLeftX
    if (node.vrt) {
      console.log(node)
      // on lowerRightX
      // let line=createLine(node.lowerRightX, node.upperLeftY, node.lowerRightX, node.lowerRightY, node.faceId)
      let line = serviceCase.createLine(node.upperLeftX, node.upperLeftY, node.upperLeftX, node.lowerRightY, node.faceId)
      serviceCase.svgEl.append(line)
    }
  }

  vm.deleteTouchFace = function() {
    console.log("delete palceholder")
  }

  //receives node clicked on
  //partition: adds a stick to clicked on face node, and two children (one for each partition)
  vm.partition = function(clickedFaceNode, faceEventX, faceEventY, orientation) {
    console.log("entered partition(): ", clickedFaceNode)

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

  // function partitionEquals(clickedFaceNode, divisions, orientation) {
  //
  //   //get partition width and height for equal divisions
  //   let partitionWidth = clickedFaceNode.width / divisions
  //   let partitionHeight = clickedFaceNode.height / divisions
  //
  //   if (orientation === "hrz") {
  //     //hrz
  //     for (let i = 0; i < divisions; i++) {
  //       idTicker++
  //       if (i === divisions - 1) {
  //         stick = stickNone
  //       } else {
  //         stick = stickHrz
  //       }
  //       clickedFaceNode.children.push(new Node(
  //         //submit upper-left face point
  //         clickedFaceNode.upperLeftX,
  //         clickedFaceNode.lowerRightY + partitionHeight * (i + 1),
  //         //submit lower-right face point
  //         clickedFaceNode.lowerRightX,
  //         clickedFaceNode.lowerRightY + partitionHeight * i,
  //         idTicker,
  //         stick))
  //     }
  //   }
  //
  //   if (orientation === "vrt") {
  //     for (let i = 0; i < divisions; i++) {
  //       idTicker++
  //       if (i === 0) {
  //         stick = stickNone
  //       } else {
  //         stick = stickVrt
  //       }
  //       clickedFaceNode.children.push(new Node(
  //         //submit upper-left face point
  //         clickedFaceNode.upperLeftX + partitionWidth * i,
  //         clickedFaceNode.upperLeftY,
  //         //submit lower-right face point
  //         clickedFaceNode.upperLeftX + partitionWidth * (i + 1),
  //         clickedFaceNode.lowerRightY,
  //         idTicker,
  //         stick))
  //     }
  //   }
  //   //attach touch faces
  //   for (child of clickedFaceNode.children) {
  //     plotPartition(child)
  //   }
  // }
}
