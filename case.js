


function deleteTouchFace(clickedNode) {
  console.log("delete this node's face in 3d version: ", clickedNode)
}




// const nodeA = new Node(0,10,10,0,0, stickNone)
//ui modes
let orientation = null


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
