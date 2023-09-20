import * as THREE from 'three';
import {gsap} from 'gsap';
import {GUI} from 'lil-gui';
import CANNON, {Quaternion, Vec3} from 'cannon';

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const parameters = {
  postionSphere: {
    x: 0,
    y: 5,
    z: 0,
  },
  color: '#000000',
  Spherecolor: '#ffffff',
};
const gui = new GUI({width: 200});

const material = new THREE.MeshStandardMaterial({
  color: parameters.color,
  side: 2,
});
const materialSphere = new THREE.MeshStandardMaterial({
  color: parameters.Spherecolor,
  metalness: 0.01,
  roughness: 0.01,
});
gui.add(parameters.postionSphere, 'y').min(1).max(100).step(0.01);
gui.addColor(material, 'color');
gui.add(materialSphere, 'metalness').min(-100).max(100).step(0.001);
gui.add(materialSphere, 'roughness').min(-100).max(10).step(0.001);
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  1000,
);

window.addEventListener('resize', () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
});

const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
// renderer.shadowMap = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
camera.position.z = 5;
camera.position.y = 2.5;
camera.position.x = 5;
camera.rotation.y = Math.PI / 4;
const clock = new THREE.Clock();
//ADDLIGHTS
const directionalligth = new THREE.DirectionalLight(0xffffff, 1);
const ambient = new THREE.AmbientLight(0xffffff, 1);
directionalligth.position.set(1, 1, 0);
//ADD Plane and sphere with sam material
const sphereGeo = new THREE.SphereGeometry(0.5, 32, 16, 0);
const sphereMesh = new THREE.Mesh(sphereGeo, materialSphere);

const planeGeo = new THREE.PlaneGeometry(16, 16, 1, 1);
const planeMesh = new THREE.Mesh(planeGeo, material);

sphereMesh.position.set(-1, parameters.postionSphere.y, 0);
planeMesh.rotation.set(-Math.PI / 2, 0, 0);
gui
  .add(planeMesh.rotation, 'x')
  .min(-Math.PI * 2)
  .max(Math.PI * 2)
  .step(0.1);

////PHYSICS STARTa
const world = new CANNON.World();
world.gravity.set(0, -9.86, 0);
//create material and contact material
const concretematerial = new CANNON.Material('concrete');
const plasticmaterial = new CANNON.Material('plastic');

//create a body
const sphereshape = new CANNON.Sphere(0.5);

const sphere = new CANNON.Body({
  shape: sphereshape,
  allowSleep: false,
  mass: 1,
  position: new Vec3(-1, parameters.postionSphere.y, 0),
  material: plasticmaterial,
});

//shape for body

const floor = new CANNON.Plane();
const floorbdy = new CANNON.Body({
  shape: floor,
  mass: 0,
  material: concretematerial,
  position: new Vec3(
    planeMesh.position.x,
    planeMesh.position.y,
    planeMesh.position.z,
  ),
});

floorbdy.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);
console.log(floorbdy);
world.addBody(floorbdy);
//add shape to body
console.log(planeMesh.rotation);
console.log(floor.rotation);
///PHYSICS END
//world add body like mesh
const contactmat = new CANNON.ContactMaterial(
  concretematerial,
  plasticmaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  },
);
world.addBody(sphere);
world.addContactMaterial(contactmat);
//scene me add karo
scene.add(planeMesh);
scene.add(directionalligth);
scene.add(sphereMesh);
scene.add(ambient);
directionalligth.castShadow = true;
renderer.shadowMap.enabled = true;
sphereMesh.castShadow = true;
planeMesh.receiveShadow = true;
let lasttime = 0;

function tick() {
  const time = clock.getElapsedTime();
  const delta = time - lasttime;
  //console.log(delta);
  lasttime = time;
  //update cannon js world to update youself
  //step function
  //console.log(sphere.position.y);
  world.step(1 / 60, delta * 0.8, 1);
  // console.log(sphere.position.y);
  sphereMesh.position.set(
    sphere.position.x,
    sphere.position.y,
    sphere.position.z,
  );
  //console.log(sphere.position.z);
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);

  window.requestAnimationFrame(tick);

  renderer.render(scene, camera);
}
tick();
