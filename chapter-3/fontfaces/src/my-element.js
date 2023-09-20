import * as THREE from 'three';

import {gsap} from 'gsap';
import GUI from 'lil-gui';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
const scene = new THREE.Scene();
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(
  45,
  size.width / size.height,
  0.1,
  100,
);
const gui = new GUI();
const canvas = document.querySelector('.webgl');
camera.position.z = 5;

//============================================================Create Text
const textureLoader = new THREE.TextureLoader();
const mattex = textureLoader.load(
  '/textures/matcaps/1.png',
  () => {
    console.log('loaded');
  },
  () => {},
  () => {
    console.log('tesxture Failed');
  },
);

//====================================Control Orbit

const ambient = new THREE.AmbientLight({intensity: 1});
//scene.add(ambient);
const fontloader = new FontLoader();
let fontvalue;
const textmaterial = new THREE.MeshMatcapMaterial({
  matcap: mattex,
});
const Font = fontloader.load(
  './fonts/helvetiker_bold.typeface.json',
  (font) => {
    const textGeometry = new TextGeometry('manoj', {
      font: font,

      size: 0.5,

      height: 0.1,

      curveSegments: 3,

      bevelEnabled: true,

      bevelThickness: 0.01,

      bevelSize: 0.002,

      bevelOffset: 0.01,

      bevelSegments: 2,
    });

    const textMesh = new THREE.Mesh(textGeometry, textmaterial);
    //centaer text using
    textGeometry.center();

    //gui.add(textMesh, 'size').min(0).max(10).step(0.1);
    scene.add(textMesh);
  },
  () => {},

  () => {
    console.log('fontfailedS');
  },
);
const torusGeo = new THREE.TorusGeometry(0.5, 0.4, 12, 48);

//create 100 torus
for (let i = 0; i < 100; i++) {
  const torusmesh = new THREE.Mesh(torusGeo, textmaterial);
  torusmesh.position.x = (Math.random() - 0.5) * 20;
  torusmesh.position.y = (Math.random() - 0.5) * 20;
  torusmesh.position.z = (Math.random() - 0.5) * 20;
  const scale = Math.random();
  torusmesh.scale.set(scale, scale, scale);

  scene.add(torusmesh);
}
window.addEventListener('resize', () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
});
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.shadowMap.enabled = true;
const OrbitControl = new OrbitControls(camera, renderer.domElement);

function tick() {
  OrbitControl.update();
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);

  window.requestAnimationFrame(tick);
  renderer.render(scene, camera);
}

tick();
