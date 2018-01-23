


function deleteTouchFace(clickedNode) {
  console.log("delete this node's face in 3d version: ", clickedNode)
}


//partition: adds a stick to clicked on face node, and two children (one for each partition)
function partition(clickedFaceNode, faceEventX, faceEventY, orientation) {
  console.log("entered partition(): ", clickedFaceNode)

  //delete touch face from clicked face's node (useful for 3d version)
  deleteTouchFace(clickedFaceNode)

  //add children and stick
  if (orientation === "hrz") {
    //hrz

    //add face id (used for associating stick with face, when stick is selected)
    //update id ticker to get unique name for IDs
    idTicker++

    //left node (top partition)
    clickedFaceNode.children.push(new Node(
      clickedFaceNode.upperLeftX,
      clickedFaceNode.upperLeftY,
      clickedFaceNode.lowerRightX,
      faceEventY + clickedFaceNode.lowerRightY,
      idTicker,
      stickNone))

    idTicker++
    //right node (bottom partition):
    clickedFaceNode.children.push(new Node(
      clickedFaceNode.upperLeftX,
      faceEventY + clickedFaceNode.lowerRightY,
      clickedFaceNode.lowerRightX,
      clickedFaceNode.lowerRightY,
      idTicker,
      stickHrz))
  } else {
    //vrt

    //add face id (used for associating stick with face, when stick is selected)
    //update id ticker to get unique name for IDs
    idTicker++
    //left node (left partition)
    clickedFaceNode.children.push(new Node(
      clickedFaceNode.upperLeftX,
      clickedFaceNode.upperLeftY,
      faceEventX + clickedFaceNode.upperLeftX,
      clickedFaceNode.lowerRightY,
      idTicker,
      stickNone))

    idTicker++
    //right node (right partition)
    clickedFaceNode.children.push(new Node(
      faceEventX + clickedFaceNode.upperLeftX,
      clickedFaceNode.upperLeftY,
      clickedFaceNode.lowerRightX,
      clickedFaceNode.lowerRightY,
      idTicker,
      stickVrt))
  }

  plotPartition(clickedFaceNode.children[0]) //attach a touch face
  plotPartition(clickedFaceNode.children[1]) //attach a touch face and a stick
}

function partitionEquals(clickedFaceNode, divisions, orientation) {

  //get partition width and height for equal divisions
  let partitionWidth = clickedFaceNode.width / divisions
  let partitionHeight = clickedFaceNode.height / divisions

  if (orientation === "hrz") {
    //hrz
    for (let i = 0; i < divisions; i++) {
      idTicker++
      if (i === divisions - 1) {
        stick = stickNone
      } else {
        stick = stickHrz
      }
      clickedFaceNode.children.push(new Node(
        //submit upper-left face point
        clickedFaceNode.upperLeftX,
        clickedFaceNode.lowerRightY + partitionHeight * (i + 1),
        //submit lower-right face point
        clickedFaceNode.lowerRightX,
        clickedFaceNode.lowerRightY + partitionHeight * i,
        idTicker,
        stick))
    }
  }

  if (orientation === "vrt") {
    for (let i = 0; i < divisions; i++) {
      idTicker++
      if (i === 0) {
        stick = stickNone
      } else {
        stick = stickVrt
      }
      clickedFaceNode.children.push(new Node(
        //submit upper-left face point
        clickedFaceNode.upperLeftX + partitionWidth * i,
        clickedFaceNode.upperLeftY,
        //submit lower-right face point
        clickedFaceNode.upperLeftX + partitionWidth * (i + 1),
        clickedFaceNode.lowerRightY,
        idTicker,
        stick))
    }
  }
  //attach touch faces
  for (child of clickedFaceNode.children) {
    plotPartition(child)
  }
}

// const nodeA = new Node(0,10,10,0,0, stickNone)
//ui modes
let orientation = null



function findNode(faceId) {
  let n = null
  traverseTree(function(node) {
    if (faceId === node.faceId) n = node
  })
  return n
}

function snarf(node) {
  console.log(node.faceId)
}



function getEditState() {
  return "move"
}

function partitionOnMove(event) {
  if (updatePSelected) {
    console.log("moving")
  }
}

//refered to from partition (line) callbacks to delegate behavior depending on edit stae
function partitionEvent(editState, line) {
  console.log("entere partitionEvent")

  if (getEditState() === "move") {
    updatePartitions = getUpdatePartitions(findNode(parseInt(line.getAttribute('data'))))
  }
}



function plotPartition(node) {
  console.log(node.children)

  // plot partition line (for every node with an hrz or vrt true)

  //hrz plotted on upperLeftY
  if (node.hrz) {
    //on upperLeftY
    let line = createLine(node.upperLeftX, node.upperLeftY, node.lowerRightX, node.upperLeftY, node.faceId)

    // update all updatePartitions with move on down event
    // line.addEventListener('mousedown', function(event) {
    //   partitionEvent(getEditState(), line)
    // })

    svgEl.append(line)
  }

  //vrt plotted on upperLeftX
  if (node.vrt) {
    console.log(node)
    // on lowerRightX
    // let line=createLine(node.lowerRightX, node.upperLeftY, node.lowerRightX, node.lowerRightY, node.faceId)
    let line = createLine(node.upperLeftX, node.upperLeftY, node.upperLeftX, node.lowerRightY, node.faceId)
    svgEl.append(line)
  }
}


var rootNode


function getUpdatePartitions(node) {
  // console.log('getUpdatePartitions: ', node)
  //hrz
  let updatePartitions = []
  if (node.hrz) {
    console.log("getUpdatePartitions hrz")
    //find all common connections on partition by line-start or end y values
    //hrz plotted on upperLeftY
    let hrzPartitionY = node.upperLeftY
    traverseTree(function(currentNode) {
      console.log(currentNode.faceId)
      console.log("hrzPartitionY: ", hrzPartitionY)
      // console.log("currentNode upperLeftX: ", currentNode.upperLeftX)
      if (
        (currentNode.faceId !== node.faceId) &&
        (currentNode.vrt) &&
        (currentNode.upperLeftY === hrzPartitionY || currentNode.lowerRightY === hrzPartitionY)
      ) {
        // console.log("blarf")
        let point
        if (currentNode.upperLeftY === hrzPartitionY) {
          point = "upperLeftY"
        } else {
          point = "lowerRightY"
        }
        // console.log(currentNode)
        updatePartitions.push({
          node: currentNode,
          end: point
        })
      }
    })
    return updatePartitions
  }
  //vrt
  if (node.orientation === "vrt") {
    //find all common connections on partition by line-start or end x values
    //vrt plotted on upperLeftX
  }
}



// add event listeners
// document.addEventListener("mousedown", editElDown);
// svgEl.addEventListener("mousemove", svgElMove);
// svgEl.addEventListener("mouseup", svgElUp);
// document.addEventListener("mouseup", editElUp);

document.getElementById('form-overall').addEventListener('submit', (event) => {
  event.preventDefault();
  plotCase(event.target.width.value, event.target.height.value)
})

document.getElementById('input-parteq').oninput = function(event) {
  if (this.length > 2)
    this.value = this.value.slice(0, 2);
}

function showVMessages() {
  document.querySelector('#form-partitions').reportValidity();
}
document.getElementById('input-parteq').onblur = function(event) {
  console.log(document.querySelector('#form-partitions'))
  setTimeout(showVMessages, 10)
}

document.getElementById('button-move').onclick = function(event) {
  console.log("snarf")
}
