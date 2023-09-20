import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const gui = new GUI({width: 500});
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  100,
);

camera.position.z = 5;
// const textureloader = new THREE.TextureLoader();
// const partexture = textureloader.load('textures/particles/11.png');
// const geometry = new THREE.BufferGeometry(1, 32, 32);

// // create a simple square shape. We duplicate the top left and bottom right
// // vertices because each vertex needs to appear once per triangle.
// const numStars = 5000;
// const galaxyRadius = 100.0;

// const stars = new Float32Array(numStars * 3);
// const colors = new Float32Array(numStars * 3);
// const positions = new Float32Array(numStars * 3);
// for (let i = 0; i < numStars; i++) {
//   const theta = Math.random() * Math.PI * 2; // Angle around the center
//   const phi = Math.random() * Math.PI - Math.PI / 2; // Angle above/below the equator
//   const radius = Math.random() * galaxyRadius; // Distance from the center

//   const x = radius * Math.cos(theta) * Math.cos(phi);
//   const y = radius * Math.sin(phi);
//   const z = radius * Math.sin(theta) * Math.cos(phi);

//   stars[i * 3] = x;
//   stars[i * 3 + 1] = y;
//   stars[i * 3 + 2] = z;

//   // positions[i] = (Math.random() - 0.5) * 10;
//   colors[i] = Math.random() * 1;
// }

// // itemSize = 3 because there are 3 values (components) per vertex
// geometry.setAttribute('position', new THREE.BufferAttribute(stars, 3));
// geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
// const material = new THREE.PointsMaterial();
// material.size = 0.8;
// material.vertexColors = true;
// material.sizeAttenuation = true;
// material.transparent = true;
// material.alphaTest = 0.001;
// material.alphaHash = false;
// material.color = new THREE.Color('#d4a373');
// const particles = new THREE.Points(geometry, material);
// material.alphaMap = partexture;
// material.blending = THREE.AdditiveBlending;
// // material.depthTest = false;
// material.depthWrite = false;
// scene.add(particles);
window.addEventListener('resize', () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
});
let material = null;
let mesh = null;
let geometry = null;
const parameters = {
  count: 31322,
  size: 0.01,
  radius: 6.4,
  branchSize: 5,
  spin: 0.41,
  randomness: 0.78,
  power: 3.6,
  insideColor: '#ff3c30',
  outsideColor: '#1b7184',
};
function createGalaxy() {
  // const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);
  geometry = new THREE.BufferGeometry();
  for (let i = 0; i <= parameters.count; i++) {
    //123456789
    //012 012 012 %3

    const radius = Math.random() * parameters.radius;
    const spin = radius * parameters.spin;
    const randomX =
      Math.pow(Math.random(), 2) *
      parameters.randomness *
      (Math.random() < 0.5 ? 1 : -1);
    const randomY =
      Math.pow(Math.random(), 2) *
      parameters.randomness *
      (Math.random() < 0.5 ? 1 : -1);
    const randomZ =
      Math.pow(Math.random(), 2) *
      parameters.randomness *
      (Math.random() < 0.5 ? 1 : -1);
    const angle =
      ((i % parameters.branchSize) / parameters.branchSize) * (Math.PI * 2);

    positions[i * 3] = Math.cos(angle + spin) * radius + randomX;
    positions[i * 3 + 1] = 0 + randomY;

    positions[i * 3 + 2] = Math.sin(angle + spin) * radius + randomZ;
    // 0 .33 .66 /3
    // angle angle angle 2pi

    //use sin cos 2pi
    ///=====================================COLOR
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / 7);
    colors[i * 3] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;
  }
  // create a simple square shape. We duplicate the top left and bottom right
  // vertices because each vertex needs to appear once per triangle.

  // itemSize = 3 because there are 3 values (components) per vertex

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  /// ====================================POINT MATERIAL
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: 2,
    vertexColors: true,
  });
  mesh = new THREE.Points(geometry, material);
  scene.add(mesh);
}
gui
  .add(parameters, 'size')
  .min(0)
  .max(10)
  .step(0.01)
  .onFinishChange(() => {
    if (mesh !== null) {
      geometry.dispose();
      material.dispose();
      scene.remove(mesh);
    }
    createGalaxy();
  });
gui
  .add(parameters, 'randomness')
  .min(0)
  .max(1)
  .step(0.01)
  .onFinishChange(() => {
    if (mesh !== null) {
      geometry.dispose();
      material.dispose();
      scene.remove(mesh);
    }
    createGalaxy();
  });
gui
  .add(parameters, 'spin')
  .min(0.1)
  .max(1)
  .step(0.01)
  .onFinishChange(() => {
    if (mesh !== null) {
      geometry.dispose();
      material.dispose();
      scene.remove(mesh);
    }
    createGalaxy();
  });
gui
  .add(parameters, 'branchSize')
  .min(0)
  .max(10)
  .step(1)
  .onFinishChange(() => {
    if (mesh !== null) {
      geometry.dispose();
      material.dispose();
      scene.remove(mesh);
    }
    createGalaxy();
  });
gui
  .add(parameters, 'count')
  .min(10)
  .max(100000)
  .step(1)
  .onFinishChange(() => {
    if (mesh !== null) {
      geometry.dispose();
      material.dispose();
      scene.remove(mesh);
    }
    createGalaxy();
  });
gui
  .add(parameters, 'radius')
  .min(1)
  .max(10)
  .step(0.1)
  .onFinishChange(() => {
    if (mesh !== null) {
      geometry.dispose();
      material.dispose();
      scene.remove(mesh);
    }
    createGalaxy();
  });
gui
  .add(parameters, 'power')
  .min(1)
  .max(10)
  .step(0.1)
  .onFinishChange(() => {
    if (mesh !== null) {
      geometry.dispose();
      material.dispose();
      scene.remove(mesh);
    }
    createGalaxy();
  });
gui
  .addColor(parameters, 'insideColor')

  .onFinishChange(() => {
    if (mesh !== null) {
      geometry.dispose();
      material.dispose();
      scene.remove(mesh);
    }
    createGalaxy();
  });
gui
  .addColor(parameters, 'outsideColor')

  .onFinishChange(() => {
    if (mesh !== null) {
      geometry.dispose();
      material.dispose();
      scene.remove(mesh);
    }
    createGalaxy();
  });
createGalaxy();
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
const control = new OrbitControls(camera, canvas);
control.enableDamping = true;
control.dampingFactor = 0.01;
const clock = new THREE.Clock();
function tick() {
  control.update();
  // particles.rotation.y = clock.getElapsedTime() * 0.001;
  // particles.rotation.x = -clock.getElapsedTime() * 0.15;

  // for (let i = 0; i <= numStars; i++) {
  //   const i3 = i * 3;
  //   const x = particles.geometry.attributes.position.array[i3];
  //   particles.geometry.attributes.position.array[i3 + 1] = Math.sin(
  //     clock.getElapsedTime() + x,
  //   );
  // }
  // particles.geometry.attributes.position.needsUpdate = true;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
  window.requestAnimationFrame(tick);
  renderer.render(scene, camera);
}
tick();
