//helper functions for SVG shape drawing and event handling
angular.module('app').service('serviceSvg', serviceSvg)

function serviceSvg() {
  var vm = this

  vm.getSvgPoint = function(domX, domY) {
    let pt = vm.svgEl.createSVGPoint();
    pt.x = domX;
    pt.y = domY;
    let svgP = pt.matrixTransform(vm.svgEl.getScreenCTM().inverse())
    return svgP;
  }

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

  vm.getLineById = function(idn) {
    let selector = 'line[id="'+idn+'"]'
    return vm.svgEl.querySelector(selector)
  }

  vm.getRectById = function(idn) {
    let selector = 'rect[id="'+idn+'"]'
    return vm.svgEl.querySelector(selector)
  }

  function getSvgPoint(clientX, clientY) {
    let pt = vm.svgEl.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    let svgP = pt.matrixTransform(vm.svgEl.getScreenCTM().inverse())
    return svgP;
  }

}
