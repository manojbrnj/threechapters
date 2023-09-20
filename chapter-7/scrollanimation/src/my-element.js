import * as THREE from 'three';
import GUI from 'lil-gui';
const scene = new THREE.Scene();
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const parameters = {
  move: 7,
};
const cursor = {
  cursonX: 0,
  cursoreY: 0,
};
const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  100,
);
// create GUI
const gui = new GUI({widht: 500});
camera.position.z = 5;
//create Particles

const count = 1000;
const particlesGeo = new THREE.BufferGeometry();
const radius = 15;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
for (let i = 0; i <= count * 3; i++) {
  positions[i * 3] = (Math.random() - 0.5) * radius;
  positions[i * 3 + 1] = 4.4 - Math.random() * 24;
  positions[i * 3 + 2] = (Math.random() - 0.5) * radius;
  colors[i * 3] = Math.random();
  colors[i * 3 + 1] = Math.random();
  colors[i * 3 + 2] = Math.random();
}
particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particlemat = new THREE.PointsMaterial({
  size: 0.2,
  sizeAttenuation: true,
  vertexColors: true,
});
particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
const particleMesh = new THREE.Points(particlesGeo, particlemat);
//create Light
const directlight = new THREE.DirectionalLight(0xffffff, 0.5);
directlight.position.set(2, 2, 0);
//add MESHES
const textureloader = new THREE.TextureLoader();
const toontext = textureloader.load('textures/gradients/3.jpg');
toontext.magFilter = THREE.NearestFilter;
const torusmat = new THREE.MeshToonMaterial({
  color: 0xffffff,
  gradientMap: toontext,
});

const torus = new THREE.TorusGeometry(1, 0.4, 12, 48, Math.PI * 2);
const torusmesh = new THREE.Mesh(torus, torusmat);

const conegeo = new THREE.ConeGeometry(1, 1, 32, 1, false, 0, Math.PI * 2);
const coneMesh = new THREE.Mesh(conegeo, torusmat);

const torusKnot = new THREE.TorusKnotGeometry(1, 0.4, 64, 8, 2, 3);
const torusknotmesh = new THREE.Mesh(torusKnot, torusmat);
scene.add(torusmesh);
scene.add(coneMesh);
scene.add(torusknotmesh);
coneMesh.position.set(3, -7, 0);
torusmesh.position.set(3, 0, 0);
torusknotmesh.position.set(3, -14, 0);
scene.add(directlight);
scene.add(particleMesh);
// END MESSES
const group = new THREE.Group();
group.add(camera);
scene.add(group);
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
window.addEventListener('mousemove', (event) => {
  cursor.cursonX = event.clientX;
  cursor.cursoreY = event.clientY;
});

window.addEventListener('scroll', (event) => {
  //ScrollX and ScrollY
  camera.position.y =
    Math.round(window.scrollY / size.height) * -parameters.move;
  // camera.position.y

  console.log(Math.round(window.scrollY) / size.height);
});
window.addEventListener('resize', () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
});
window.addEventListener('move', () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
});
//gui properties

gui.addColor(torusmat, 'color');
gui.add(parameters, 'move').min(1).max(10).step(0.01);
const clock = new THREE.Clock();

function tick() {
  const time = clock.getElapsedTime();

  renderer.setSize(size.width, size.height);
  torusmesh.rotation.set(
    clock.getElapsedTime() * 0.2,
    clock.getElapsedTime() * 0.2,
    clock.getElapsedTime() * 0.2,
  );
  coneMesh.rotation.set(
    clock.getElapsedTime() * 0.2,
    clock.getElapsedTime() * 0.2,
    clock.getElapsedTime() * 0.2,
  );
  torusknotmesh.rotation.set(
    clock.getElapsedTime() * 0.2,
    clock.getElapsedTime() * 0.2,
    clock.getElapsedTime() * 0.2,
  );

  group.position.x = (cursor.cursonX / size.width) * 0.3;
  group.position.y = (cursor.cursoreY / -size.height) * 0.3;
  camera.updateProjectionMatrix();
  window.requestAnimationFrame(tick);
  renderer.render(scene, camera);
}
tick();
