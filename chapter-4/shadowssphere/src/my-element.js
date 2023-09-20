import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
const scene = new THREE.Scene();
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const stextireloader = new THREE.TextureLoader();
const simpleshadow = stextireloader.load('/textures/simpleShadow.jpg');
const camera = new THREE.PerspectiveCamera(
  47,
  size.width / size.height,
  0.1,
  100,
);
camera.position.z = 5;
camera.position.y = 0.5;
const canvas = document.querySelector('.webgl');

const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setSize(size.width, size.height);
window.addEventListener('resize', () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
});

//shadow
const planeGeos = new THREE.PlaneGeometry(4, 4, 4, 4);

const planemats = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: 2,
});
const planeMeshs = new THREE.Mesh(planeGeos, planemats);

scene.add(planeMeshs);

const sphereGeo = new THREE.SphereGeometry(0.5, 15, 15);
const spheremat = new THREE.MeshBasicMaterial({
  color: 0xff0000,
});
const clock = new THREE.Clock();
const sphereMesh = new THREE.Mesh(sphereGeo, spheremat);

scene.add(sphereMesh);

//add Plane

const planeGeo = new THREE.PlaneGeometry(1, 1, 1, 1);

const planemat = new THREE.MeshBasicMaterial({
  color: 0x000000,
  transparent: true,
  alphaMap: simpleshadow,
  side: 2,
});
const planeMesh = new THREE.Mesh(planeGeo, planemat);

planeMesh.position.z = 0.01;

scene.add(planeMesh);
const orbitCotrol = new OrbitControls(camera, canvas);
function tick() {
  sphereMesh.position.x = Math.cos(clock.getElapsedTime());
  sphereMesh.position.y = Math.sin(clock.getElapsedTime());
  sphereMesh.position.z =
    0.5 + Math.abs(Math.sin(clock.getElapsedTime() * 2) * 1);
  planeMesh.position.x = sphereMesh.position.x;
  planeMesh.position.y = sphereMesh.position.y;
  planemat.opacity = 1.8 - sphereMesh.position.z;
  orbitCotrol.update();
  camera.updateProjectionMatrix();
  window.requestAnimationFrame(tick);
  renderer.render(scene, camera);
}
tick();
