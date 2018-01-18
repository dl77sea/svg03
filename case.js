var svgEl = document.querySelector('svg');

class Stick {
  constructor(strOrientation) {
    this.vrt = false;
    this.hrz = false;
    if(strOrientation === "hrz") this.hrz = true
    if(strOrientation === "vrt") this.vrt = true
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
    this.width  = this.lowerRightX - faceUlX
    this.height = this.upperLeftY - faceLrY

    //stick (this is where info about the stick is contained if node has stick)
    this.hrz = false
    this.vrt = false
    if(stick.hrz) this.hrz = true
    if(stick.vrt) this.vrt = true

    //children (left and right or top and bottom partitions)
    this.children = []
  }
}

// use for naming IDs uniquely
let idTicker = 0

//partition: adds a stick to clicked on face node, and two children (one for each partition)
function partition(clickedFaceNode, faceEventX, faceEventY, orientation) {

  //add children and stick

  if(orientation === "hrz") {
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
}

function partitionEquals(clickedFaceNode, divisions, orientation) {

  //get partition width and height for equal divisions
  let partitionWidth = clickedFaceNode.width/divisions
  let partitionHeight = clickedFaceNode.height/divisions

  if(orientation === "hrz") {
    //hrz
    for(let i=0; i < divisions; i++) {
      idTicker++
      if(i === divisions-1) {stick = stickNone} else {stick = stickHrz}
      clickedFaceNode.children.push(new Node(
        //submit upper-left face point
        clickedFaceNode.upperLeftX,
        clickedFaceNode.lowerRightY + partitionHeight*(i+1),
        //submit lower-right face point
        clickedFaceNode.lowerRightX,
        clickedFaceNode.lowerRightY + partitionHeight*i,
        idTicker,
        stick))

    }
  }

  if(orientation === "vrt") {
    for(let i=0; i < divisions; i++) {
      idTicker++
      if(i === 0) {stick = stickNone} else {stick = stickVrt}
      clickedFaceNode.children.push(new Node(
        //submit upper-left face point
        clickedFaceNode.upperLeftX + partitionWidth*i,
        clickedFaceNode.upperLeftY,
        //submit lower-right face point
        clickedFaceNode.upperLeftX + partitionWidth*(i+1),
        clickedFaceNode.lowerRightY,
        idTicker,
        stick))
    }
  }
}

//faceUlX, faceUlY, faceLrX, faceLrY, strData
var rootWidth = 100
var rootHeight = 100
var rootNode = new Node(  (rootWidth/2)*(-1),rootHeight,
                          (rootWidth/2),0,
                          0, stickNone)

const nodeA = new Node(0,10,10,0,0, stickNone)

//ui modes
let orientation = null

function traverseTree(fn) {
  let nodes = [rootNode]

  while(nodes.length > 0) {
    let node = nodes.pop()

    // //handle node 0
    // if(node)
    // fn(node)

    if(node.children.length > 0) {
      for(node of node.children) {
        fn(node)
        nodes.push(node)
      }
    }
  }
}

function findNode(faceId) {
  let n = null
  traverseTree(function(node){if(faceId === node.faceId) n = node})
  return n
}

function snarf(node) {
  console.log(node.faceId)
}

function createLine(x1, y1, x2, y2, id) {
  let line = document.createElementNS('http://www.w3.org/2000/svg','line')
  line.setAttribute('id', "seg"+id)
  line.setAttribute('class', 'lineseg')
  line.setAttribute('x1', x1)
  line.setAttribute('y1', y1)
  line.setAttribute('x2', x2)
  line.setAttribute('y2', y2)
  return line
}

function plotCase() {
  let lineTop = createLine(rootNode.upperLeftX, rootNode.upperLeftY, rootNode.lowerRightX, rootNode.upperLeftY, rootNode.faceId)
  let lineRight = createLine(rootNode.lowerRightX, rootNode.upperLeftY, rootNode.lowerRightX, rootNode.lowerRightY, rootNode.faceId)
  let lineBottom = createLine(rootNode.lowerRightX, rootNode.lowerRightY, rootNode.upperLeftX, rootNode.lowerRightY, rootNode.faceId)
  let lineLeft = createLine(rootNode.upperLeftX, rootNode.lowerRightY, rootNode.upperLeftX, rootNode.upperLeftY, rootNode.faceId)
  svgEl.append(lineTop)
  svgEl.append(lineRight)
  svgEl.append(lineBottom)
  svgEl.append(lineLeft)

  traverseTree(plotPartition)
}

function plotPartition(node) {

  if(node.hrz) {
    //on upperLeftY
    let line=createLine(node.upperLeftX, node.upperLeftY, node.lowerRightX, node.upperLeftY, node.faceId)
    svgEl.append(line)
  }
  if(node.vrt) {
    console.log(node)
    // on lowerRightX
    // let line=createLine(node.lowerRightX, node.upperLeftY, node.lowerRightX, node.lowerRightY, node.faceId)
    let line=createLine(node.upperLeftX, node.upperLeftY, node.upperLeftX, node.lowerRightY, node.faceId)
    svgEl.append(line)
  }
}

//build a tree
// orientation: "hrz" "vrt"
partition(rootNode, 3, 75, "hrz")
partitionEquals(findNode(2), 3, "vrt")
partition(findNode(4), 3, 38, "hrz")
partitionEquals(findNode(5), 3, "hrz")
partition(findNode(1), 10, 3, "vrt")
partitionEquals(findNode(7), 3, "vrt")
console.log(findNode(1))
// partition(traverseTree(5, snarf),   2.5,1, "hrz")
plotCase()
// console.log("---")
// traverseTree(7, snarf)
