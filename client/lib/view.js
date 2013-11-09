// https://github.com/snagy/voxel-view

// Save THREE if it is browser global
var THREE_ = THREE
// Passed in THREE will be stored here
var THREE

function View(three, opts) {
  opts = opts || {}
  THREE = three || THREE_
  this.fov = opts.fov || 45
  this.width = opts.width || window.innerWidth
  this.height = opts.height ||  window.innerHeight
  this.aspectRatio = opts.aspectRatio || this.width / this.height
  this.nearPlane = opts.nearPlane || 1
  this.farPlane = opts.farPlane || 1e10
  this.spaceColor = opts.spaceColor || 0x000000
  this.ortho = opts.ortho
  this.camera = this.ortho
      ? (new THREE.OrthographicCamera(this.width/-2, this.width/2, this.height/2, this.height/-2, this.nearPlane, this.farPlane))
      : (new THREE.PerspectiveCamera(this.fov, this.aspectRatio, this.nearPlane, this.farPlane))
  this.camera.position = opts.position || new THREE.Vector3()
  this.camera.lookAt(new THREE.Vector3(0, 0, 0))

  // if (!process.browser) return

  this.createRenderer(opts)
  this.element = this.renderer.domElement
}

View.prototype.createRenderer = function(opts) {
  opts = opts || {}
  opts.antialias = opts.antialias || true
  this.renderer = new THREE.WebGLRenderer(opts)
  this.renderer.setSize(this.width, this.height)
  this.renderer.setClearColor(new THREE.Color(this.spaceColor), 1.0)
  this.renderer.clear()
}

View.prototype.bindToScene = function(scene) {
  scene.add(this.camera)
}

View.prototype.getCamera = function() {
  return this.camera
}

View.prototype.cameraPosition = function() {
  temporaryPosition.multiplyScalar(0)
  temporaryPosition.applyMatrix4(this.camera.matrixWorld)
  return [temporaryPosition.x, temporaryPosition.y, temporaryPosition.z]
}

View.prototype.cameraVector = function() {
  temporaryVector.multiplyScalar(0)
  temporaryVector.z = -1
  temporaryVector.transformDirection( this.camera.matrixWorld )
  return [temporaryVector.x, temporaryVector.y, temporaryVector.z]
}

View.prototype.resizeWindow = function(width, height) {
  if (this.element.parentElement) {
    width = width || this.element.parentElement.clientWidth
    height = height || this.element.parentElement.clientHeight
  }

  this.camera.aspect = this.aspectRatio = width / height
  this.width = width
  this.height = height

  this.camera.updateProjectionMatrix()

  this.renderer.setSize( width, height )
}

View.prototype.render = function(scene) {
  this.renderer.render(scene, this.camera)
}

View.prototype.appendTo = function(element) {
  if (typeof element === 'object') {
    element.appendChild(this.element)
  }
  else {
    document.querySelector(element).appendChild(this.element)
  }

  this.resizeWindow(this.width,this.height)
}

module.exports = View
