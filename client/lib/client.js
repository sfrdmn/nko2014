function Client() {

  // scene

  var width = window.innerWidth,
      height = window.innerHeight,
      angle = 45,
      aspectRatio = width / height,
      near = 0.1,
      far = 1e7,
      renderer = new THREE.WebGLRenderer(),
      camera = new THREE.PerspectiveCamera(angle, aspectRatio, near, far),
      scene = new THREE.Scene()

  scene.add(camera)
  camera.position.y = 200
  camera.position.z = 500
  renderer.setSize(width, height)

  document.body.appendChild(renderer.domElement)

  // sphere

  var radius = 100,
      segments = 16,
      rings = 16,
      material = new THREE.MeshLambertMaterial({color: 0xff0000})

  var sphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius, segments, rings),
      material
  )

  scene.add(sphere)

  // lights

  var pointlight = new THREE.PointLight(0xffffff)
  var ambientlight = new THREE.AmbientLight(0x0000ff)

  pointlight.position.x = 10
  pointlight.position.y = 50
  pointlight.position.z = 130

  scene.add(pointlight)
  scene.add(ambientlight)

  // for great justice!

  var controls = new THREE.OrbitControls(camera)
  controls.addEventListener('change', render)

  scene.add(new THREE.GridHelper(width, width / 25))
  scene.add(new THREE.AxisHelper(width))

  function tick() {
    controls.update()
    window.requestAnimationFrame(tick)
  }

  function render() {
    renderer.render(scene, camera)
  }

  window.requestAnimationFrame(tick)
}

module.exports = Client
