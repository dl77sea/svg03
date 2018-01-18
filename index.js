class Node {
  constructor(w, h) {
    this.width = w;
    this.height = h;
    this.h = false;
    this.v = false;
    this.children = [];
  }
}

const n0 = new Node(10,20)


var svgcanvas = document.querySelector('svg');

function test(event) {
  let recOriginX = event.target.getAttribute('x')
  let recOriginY = event.target.getAttribute('y')

  let svgHitPt = getSvgPoint(event.clientX, event.clientY)

  recHitPt = {
    x: svgHitPt.x - recOriginX,
    y: svgHitPt.y - recOriginY
  }

  console.log(recHitPt)
}

// add event listeners
document.addEventListener("touchstart", start);
document.addEventListener("mousedown", start);
document.addEventListener("touchmove", move);
document.addEventListener("mousemove", move);
document.addEventListener("mouseup", end);

document.getElementById("rec").addEventListener("click", test);

let pickedEl = null;
var mouseDown = false;

/* event listener functions */
// on mouse or touch down
function start(e) {
  getSvgPoint(e.clientX, e.clientY)
  if (e.target.getAttribute('class') === 'lineseg') {
    mouseDown = true
    let segId = e.target.getAttribute('id')
    pickedEl = document.querySelector('#' + segId)
    console.log (pickedEl)
    pickedEl.setAttribute('class', 'linesegselected')
  }
}

function getSvgPoint(domX, domY) {
  console.log("dom x: ", domX)
  console.log("dom y: ", domY)
  let pt = svgcanvas.createSVGPoint();
  pt.x = domX;
  pt.y = domY;
  let svgP = pt.matrixTransform(svgcanvas.getScreenCTM().inverse())
  console.log("svg x: ", svgP.x)
  console.log("svg y: ", svgP.y)
  return svgP;
}

// on move (when down) refresh line points
function move(e) {
  if (pickedEl !== null) {


    let seg = pickedEl.getAttribute('id');
    let svgPt = getSvgPoint(e.clientX, e.clientY)
    // let svgPt = {}
    // svgPt.x = e.clientX
    // svgPt.y = e.clientY

    //don't let line be dragged outside viewport
    // if (svgPt.x < -50) svgPt.x = -50
    // if (svgPt.x > 50) svgPt.x = 50
    // if (svgPt.y < -50) svgPt.y = -50
    // if (svgPt.y > 50) svgPt.y = 50

    switch (seg) {

      case 'seg0':
        document.querySelector('#' + seg).setAttribute('y1', svgPt.y)
        document.querySelector('#' + seg).setAttribute('y2', svgPt.y)
        document.querySelector('#seg1').setAttribute('y1', svgPt.y)
        document.querySelector('#seg3').setAttribute('y2', svgPt.y)

        // document.querySelector('#corner-ul').setAttribute('cy', svgPt.y)
        // document.querySelector('#corner-ur').setAttribute('cy', svgPt.y)
        break;

      case 'seg1':
        document.querySelector('#' + seg).setAttribute('x1', svgPt.x)
        document.querySelector('#' + seg).setAttribute('x2', svgPt.x)
        document.querySelector('#seg0').setAttribute('x2', svgPt.x)
        document.querySelector('#seg2').setAttribute('x1', svgPt.x)

        // document.querySelector('#corner-ur').setAttribute('cx', svgPt.x)
        // document.querySelector('#corner-lr').setAttribute('cx', svgPt.x)
        break;

      case 'seg2':
        document.querySelector('#' + seg).setAttribute('y1', svgPt.y)
        document.querySelector('#' + seg).setAttribute('y2', svgPt.y)
        document.querySelector('#seg1').setAttribute('y2', svgPt.y)
        document.querySelector('#seg3').setAttribute('y1', svgPt.y)

        // document.querySelector('#corner-lr').setAttribute('cy', svgPt.y)
        // document.querySelector('#corner-ll').setAttribute('cy', svgPt.y)
        break;

      case 'seg3':
        document.querySelector('#' + seg).setAttribute('x1', svgPt.x)
        document.querySelector('#' + seg).setAttribute('x2', svgPt.x)
        document.querySelector('#seg0').setAttribute('x1', svgPt.x)
        document.querySelector('#seg2').setAttribute('x2', svgPt.x)

        // document.querySelector('#corner-ll').setAttribute('cx', svgPt.x)
        // document.querySelector('#corner-ul').setAttribute('cx', svgPt.x)
        break;

    }
  }
}

//on mouse or touch up
function end(e) {
  if (pickedEl !== null) {
    pickedEl.setAttribute('class', 'lineseg')
    pickedEl = null;
  }
  mouseDown = false;
}
