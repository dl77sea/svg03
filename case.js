var svgEl = document.querySelector('svg');

class Stick {
  constructor(strOrientation) {
    this.vrt = false;
    this.hrz = false;
    if (strOrientation === "hrz") this.hrz = true
    if (strOrientation === "vrt") this.vrt = true
  }
}

const stickHrz = new Stick("hrz")
const stickVrt = new Stick("vrt")
const stickNone = new Stick("")

class Node {
  //get click event origin x and y, orientation mode (assume event coords already translated to face clicked)
  constructor(faceUlX, faceUlY, faceLrX, faceLrY, dataId, stick) {
    //ID
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

function deleteTouchFace(clickedNode) {
  console.log("delete this node's face in 3d version: ", clickedNode)
}

// use for naming IDs uniquely
let idTicker = 0

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

function traverseTree(fn) {
  //handle node 0
  fn(rootNode)

  // handle rest of nodes in tree
  let nodes = [rootNode]

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

function createLine(x1, y1, x2, y2, id) {
  let line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  line.setAttribute('id', "seg" + id)
  line.setAttribute('class', 'lineseg')
  line.setAttribute('x1', x1)
  line.setAttribute('y1', y1)
  line.setAttribute('x2', x2)
  line.setAttribute('y2', y2)
  return line
}

function getSvgPoint(domX, domY) {
  let pt = svgEl.createSVGPoint();
  pt.x = domX;
  pt.y = domY;
  let svgP = pt.matrixTransform(svgEl.getScreenCTM().inverse())
  return svgP;
}

function getFaceHitPt(event) {
  let recOriginX = event.target.getAttribute('x')
  let recOriginY = event.target.getAttribute('y')

  let svgHitPt = getSvgPoint(event.clientX, event.clientY)

  recHitPt = {
    x: svgHitPt.x - recOriginX,
    y: svgHitPt.y - recOriginY
  }

  return recHitPt
}

function faceOnDown(event) {
  let hitPt = getFaceHitPt(event)

  //put a stick here
  // console.log()
  //event.target.getAttribute('data')
  radioButtonsPartitionType = document.getElementsByName('partition-orientation')

  if (radioButtonsPartitionType[0].checked) {
    orientation = "hrz"
  } else {
    orientation = "vrt"
  }

  // partition(findNode(parseInt(event.target.getAttribute('data'))), hitPt.x, hitPt.y, orientation)
  partitionEquals(findNode(parseInt(event.target.getAttribute('data'))), 3, orientation)
}

function createRect(x, y, w, h, id) {
  // <rect x="100" y="0" width="50" height="100">
  let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  rect.setAttribute('id', "face" + id)
  rect.setAttribute('data', id)
  rect.setAttribute('class', "touchface")
  rect.setAttribute('x', x)
  rect.setAttribute('y', y)
  rect.setAttribute('width', w)
  rect.setAttribute('height', h)

  rect.addEventListener('mousedown', faceOnDown)
  return rect
}

function plotPartition(node) {
  console.log(node.children)
  // plot touch rectangles (for every empty node)
  if (node.children.length === 0) {
    // <rect x="100" y="0" width="50" height="100">
    console.log("rect")
    console.log("x: ", node.upperLeftX, "y: ", node.lowerRightY, "w: ", node.width, "h: ", node.height, "id: ", node.faceId)
    let rect = createRect(node.upperLeftX, node.lowerRightY, node.width, node.height, node.faceId)
    console.log(rect)
    svgEl.append(rect)
  }

  // plot partition line (for every node with an hrz or vrt true)
  if (node.hrz) {
    //on upperLeftY
    let line = createLine(node.upperLeftX, node.upperLeftY, node.lowerRightX, node.upperLeftY, node.faceId)
    svgEl.append(line)
  }

  if (node.vrt) {
    console.log(node)
    // on lowerRightX
    // let line=createLine(node.lowerRightX, node.upperLeftY, node.lowerRightX, node.lowerRightY, node.faceId)
    let line = createLine(node.upperLeftX, node.upperLeftY, node.upperLeftX, node.lowerRightY, node.faceId)
    svgEl.append(line)
  }
}


var rootNode

function plotCase(w, h) {
  let rootWidth = w
  let rootHeight = h

  idTicker = 0;

  while (svgEl.firstChild) {
    svgEl.removeChild(svgEl.firstChild);
  }

  rootNode = new Node(
    (rootWidth / 2) * (-1), rootHeight,
    (rootWidth / 2), 0,
    0,
    stickNone)

  // partition(rootNode, 3, 75, "hrz")

  // partitionEquals(findNode(2), 3, "vrt")
  // partition(findNode(4), 3, 38, "hrz")
  // partitionEquals(findNode(5), 3, "hrz")
  // partition(findNode(1), 10, 3, "vrt")
  // partitionEquals(findNode(7), 3, "vrt")

  let lineTop = createLine(rootNode.upperLeftX, rootNode.upperLeftY, rootNode.lowerRightX, rootNode.upperLeftY, rootNode.faceId)
  let lineRight = createLine(rootNode.lowerRightX, rootNode.upperLeftY, rootNode.lowerRightX, rootNode.lowerRightY, rootNode.faceId)
  let lineBottom = createLine(rootNode.lowerRightX, rootNode.lowerRightY, rootNode.upperLeftX, rootNode.lowerRightY, rootNode.faceId)
  let lineLeft = createLine(rootNode.upperLeftX, rootNode.lowerRightY, rootNode.upperLeftX, rootNode.upperLeftY, rootNode.faceId)
  svgEl.append(lineTop)
  svgEl.append(lineRight)
  svgEl.append(lineBottom)
  svgEl.append(lineLeft)
  console.log("splarf")
  traverseTree(plotPartition)
}

document.getElementById('form-overall').addEventListener('submit', (event) => {
  event.preventDefault();
  plotCase(event.target.width.value, event.target.height.value)
})

let partitionTypes = document.getElementsByName('partition-type')
for (pt of partitionTypes) {
  if (pt.checked === true) {
    console.log(pt.value)
  }
}


//build a tree
// orientation: "hrz" "vrt"

// console.log("---")
// traverseTree(7, snarf)
