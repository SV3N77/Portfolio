import * as THREE from "/node_modules/three/build/three.module.js";

let scene, camera, renderer, cloud, uniforms, numVertices;
init();
animate();

function init() {
  // Setting up scene
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: document.getElementById("bg"),
    THREE,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0); // the default

  // point cloud geometry
  var geometry = new THREE.SphereBufferGeometry(100, 16, 8);
  // add an attribute
  numVertices = geometry.attributes.position.count;
  var alphas = new Float32Array(numVertices * 1); // 1 values per vertex
  for (var i = 0; i < numVertices; i++) {
    // set alpha randomly
    alphas[i] = Math.random();
  }
  geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
  // uniforms
  var randColor = new THREE.Color(0xffffff);
  randColor.setHex(Math.random() * 0xffffff);

  uniforms = {
    color: { type: "c", value: new THREE.Color(randColor) },
  };
  // point cloud material
  var shaderMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById("vertexshader").textContent,
    fragmentShader: document.getElementById("fragmentshader").textContent,
    transparent: false,
  });
  // point cloud
  cloud = new THREE.Points(geometry, shaderMaterial);
  scene.add(cloud);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  var alphas = cloud.geometry.attributes.alpha;
  var count = alphas.count;
  for (var i = 0; i < count; i++) {
    // dynamically change alphas
    alphas.array[i] *= 0.95;
    if (alphas.array[i] < 0.01) {
      alphas.array[i] = 1.0;
    }
  }
  alphas.needsUpdate = true; // important!
  cloud.rotation.x += 0.005;
  cloud.rotation.y += 0.005;
  renderer.render(scene, camera);
}
