import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const textureloader = new THREE.TextureLoader();
const doorColor = textureloader.load('/textures/door/color.jpg');
const grassColor = textureloader.load('/textures/grass/color.jpg');
const doorAlpha = textureloader.load('/textures/door/alpha.jpg');
const doorNormal = textureloader.load('/textures/door/normal.jpg');
const grassNormal = textureloader.load('/textures/grass/normal.jpg');
const doorHeight = textureloader.load('/textures/door/height.jpg');
const doorMetal = textureloader.load('/textures/door/metalness.jpg');
const doorAo = textureloader.load('/textures/door/ambientOcclusion.jpg');
const grassAo = textureloader.load('/textures/grass/ambientOcclusion.jpg');
const doorRough = textureloader.load('/textures/door/roughness.jpg');
const grassRough = textureloader.load('/textures/grass/roughness.jpg');

const gui = new GUI();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  105,
  size.width / size.height,
  0.1,
  100,
);
camera.position.z = 5;
camera.position.y = 1.5;

const canvas = document.querySelector('.webgl');
const gridHelper = new THREE.GridHelper(13);
const control = new OrbitControls(camera, canvas);

const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});

//create scene from here

const planeGeometry = new THREE.PlaneGeometry(16, 16, 1, 1);
const material = new THREE.MeshStandardMaterial({color: '#a9c388'});
const planematerial = new THREE.MeshStandardMaterial({
  color: '#a9c388',
  side: 1,
  map: grassColor,
  normalMap: grassNormal,
  aomap: grassAo,
  roughnessMap: grassRough,
});

const planeMesh = new THREE.Mesh(planeGeometry, planematerial);
planeMesh.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(planeMesh.geometry.attributes.uv.array, 2),
);
planeMesh.rotation.set(Math.PI / 2, 0, 0);
planeMesh.receiveShadow = true;
grassColor.repeat.set(8, 8);
grassColor.wrapS = THREE.RepeatWrapping;
grassColor.wrapT = THREE.RepeatWrapping;
grassAo.repeat.set(8, 8);
grassAo.wrapS = THREE.RepeatWrapping;
grassAo.wrapT = THREE.RepeatWrapping;
grassRough.repeat.set(8, 8);
grassRough.wrapS = THREE.RepeatWrapping;
grassRough.wrapT = THREE.RepeatWrapping;
grassRough.wrapT = THREE.RepeatWrapping;
// gui
//   .add(planeMesh.rotation, 'x')
//   .min(-Math.PI)
//   .max(Math.PI)
//   .step(0.01)
//   .onChange((data) => {
//     console.log(Math.PI / 2);
//   });
// const sphere = new THREE.SphereGeometry(0.2, 8, 8);
// const sphereMesh = new THREE.Mesh(sphere);
// sphereMesh.position.y = 0.2;
// sphereMesh.castShadow = true;

const group = new THREE.Group();
//group.add(sphereMesh);
group.add(planeMesh);
///add Lighting to the Scene
const ambientLight = new THREE.AmbientLight({intensity: 0.2});
const directionalLight = new THREE.DirectionalLight('#5555ff', 0.01);

directionalLight.position.set(11.5, 11.5, 0);
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.1);
gui.add(directionalLight.position, 'x').min(0).max(100).step(0.1);
gui.add(directionalLight.position, 'y').min(0).max(100).step(0.1);
gui.add(directionalLight.position, 'z').min(0).max(100).step(0.1);
const directonalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
);

directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 512; // default
directionalLight.shadow.mapSize.height = 512; // default
directionalLight.shadow.camera.near = 0.5; // default
directionalLight.shadow.camera.far = 25; // default

// pointlLight.shadow.camera.near = 0.5; // default
// pointlLight.shadow.camera.far = 25; // default
//Create a helper for the shadow camera (optional)
const pointlLight = new THREE.PointLight('white', 1, 100);
gui.add(pointlLight, 'intensity').min(0).max(1).step(0.1);
gui.add(pointlLight.position, 'x').min(0).max(100).step(0.1);
gui.add(pointlLight.position, 'y').min(0).max(100).step(0.1);
gui.add(pointlLight.position, 'z').min(0).max(100).step(0.1);
//const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
pointlLight.castShadow = true;
pointlLight.shadow.mapSize.width = 512; // default
pointlLight.shadow.mapSize.height = 512; // default
pointlLight.intensity = 1;
pointlLight.position.x = 0;
pointlLight.position.y = 1.6;
pointlLight.position.z = 2.3;

//scene.add(helper);
//scene.add(pointlLight);
// addd GHOST

const ghost1 = new THREE.PointLight(0xff0000, 1, 10);
const ghost2 = new THREE.PointLight(0x00ff00, 1, 10);
const ghost3 = new THREE.PointLight(0x0000ff, 1, 10);
ghost1.castShadow = true;
ghost1.shadow.mapSize.width = 512; // default
ghost1.shadow.mapSize.height = 512; // default
ghost1.intensity = 1;
ghost1.position.x = 1;
ghost1.position.y = 1.6;
ghost1.position.z = 2.1;
ghost2.castShadow = true;
ghost2.shadow.mapSize.width = 512; // default
ghost2.shadow.mapSize.height = 512; // default
ghost2.intensity = 1;
ghost2.position.x = -1;
ghost2.position.y = 1.6;
ghost2.position.z = 2.1;
ghost3.castShadow = true;
ghost3.shadow.mapSize.width = 512; // default
ghost3.shadow.mapSize.height = 512; // default
ghost3.intensity = 1;
ghost3.position.x = 0;
ghost3.position.y = 1.6;
ghost3.position.z = 2.1;
// const pointhelper = new THREE.CameraHelper(pointlLight.shadow.camera);
//scene.add(pointhelper);

//ghost1.position.set();

scene.add(ghost1);
scene.add(ghost2);
scene.add(ghost3);
//create a house

const housegeo = new THREE.BoxGeometry(4, 3, 4, 16, 16);
const housemat = new THREE.MeshStandardMaterial({color: '#2e1405'});
const houseMesh = new THREE.Mesh(housegeo, housemat);
houseMesh.position.y = 1.51;

const conegeo = new THREE.ConeGeometry(4, 1, 4, 16, 16);
const conemat = new THREE.MeshStandardMaterial({color: 'red', side: 2});
const coneMesh = new THREE.Mesh(conegeo, conemat);
houseMesh.position.y = 1.51;
coneMesh.position.y = 3.5;
coneMesh.rotation.y = Math.PI / 4;

//addDoor
const doorgeo = new THREE.PlaneGeometry(2, 2, 16, 16);
const doormat = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  map: doorColor,
  transparent: true,
  alphaMap: doorAlpha,

  displacementMap: doorHeight,
  displacementScale: 0.1,
  metalnessMap: doorMetal,
  aoMap: doorAo,
  aoMapIntensity: 1,
  normalMap: doorNormal,
  roughnessMap: doorRough,
});
const doorMesh = new THREE.Mesh(doorgeo, doormat);
doorMesh.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(doorMesh.geometry.attributes.uv.array, 2),
);

doorMesh.position.z = 2.001;
doorMesh.position.y = 1;
scene.add(houseMesh);
scene.add(coneMesh);
scene.add(doorMesh);

//create fog
const fog = new THREE.Fog(0xcccccc, 10, 15);
////===================================ADD OBJECTS TO SCENE
//scene.add(ambientLight);
scene.add(group);
scene.add(directionalLight);
//scene.add(directonalLightHelper);
scene.fog = fog;
//add Control
//directonalLightHelper.visible = false;
//scene.add(gridHelper);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//create obj on plane

for (let i = 0; i <= 30; i++) {
  const grave = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 0.2), material);
  const angle = Math.random() * Math.PI * 2; //360 me random values se angle nikalte hai  position ko angle bolte hai x and y dono ko dekh ke ange

  const radius = 2.5 + Math.random() * 5; //hem randow single  3-5 ke beech me ek digit number hona baar baar chiya random + chalenga
  const cirlclevalx = Math.sin(angle) * radius; //360 rotaate wave
  const cirlclevaly = Math.cos(angle) * radius; // 360 rotate wave dono milke cirlce banayenge 360' ka
  grave.position.set(cirlclevalx, 0.4, cirlclevaly);
  grave.castShadow = true;
  //grave 360 degree pe ban gyi hai jaha last value aayi
  grave.position.y = (Math.random() - 0.5) * 0.7;
  scene.add(grave);
}
window.addEventListener('resize', () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
});
control.enableDamping = true;
const clock = new THREE.Clock();

function tick() {
  control.update();
  ghost1.position.set(
    Math.sin(-clock.getElapsedTime() * 0.5) * 3,
    Math.sin(-1 + clock.getElapsedTime() * 2) * 2,
    Math.cos(-clock.getElapsedTime() * 0.5) * 3,
  );
  ghost2.position.set(
    Math.sin(clock.getElapsedTime() * 0.5) * 3,
    Math.sin(clock.getElapsedTime() * 2) * 1,
    Math.cos(clock.getElapsedTime() * 0.5) * 4,
  );
  ghost3.position.set(
    Math.sin(clock.getElapsedTime() * 0.5) * 3,
    -Math.sin(clock.getElapsedTime() * 2) * 1,
    -Math.cos(clock.getElapsedTime() * 0.5) * 4,
  );
  renderer.setSize(size.width, size.height);
  camera.updateProjectionMatrix();
  window.requestAnimationFrame(tick);
  renderer.render(scene, camera);
}
tick();
