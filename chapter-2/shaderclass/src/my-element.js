import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'lil-gui';
const scene = new THREE.Scene();
//=====================================================COLOR PARAMETER
const parameter = {
  color: 0xffffff,
};
const gui = new GUI();

//-------------------------------------------textures
const loadingManager = new THREE.LoadingManager();
const textureloader = new THREE.TextureLoader(loadingManager);
const alphatex = textureloader.load(
  './textures/door/alpha.jpg',
  undefined,
  undefined,
  () => {
    console.log('alpha fail');
  },
);
const ambienttext = textureloader.load(
  './textures/door/ambientOcclusion.jpg',
  () => {},
  () => {},
  () => {
    console.log('ambientOcclusion');
  },
);
const heighttext = textureloader.load(
  './textures/door/height.jpg',
  undefined,
  undefined,
  () => {
    console.log('height fail');
  },
);
const colortex = textureloader.load(
  './textures/door/color.jpg',
  undefined,
  undefined,
  () => {
    console.log('color fail');
  },
);
textureloader.load(
  './textures/door/metalness.jpg',
  undefined,
  undefined,
  () => {
    console.log('metalness fail');
  },
);
const normaltext = textureloader.load(
  './textures/door/normal.jpg',
  undefined,
  undefined,
  () => {
    console.log('normal fail');
  },
);
textureloader.load(
  './textures/door/roughness.jpg',
  undefined,
  undefined,
  () => {
    console.log('roughness fail');
  },
);

//------------------------------------------matcap
const matcap1 = textureloader.load(
  './textures/matcaps/8.png',
  undefined,
  undefined,
  () => {
    console.log('matcap-1 fail');
  },
);
// --------------------------------------------setSize
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
//--------------------------------------------create Camera
const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  100,
);

const canvas = document.querySelector('.webgl');
//---------------------------------------Add GRid AXES
const grid = new THREE.GridHelper(13);
const axes = new THREE.AxesHelper(3);
const orbitControl = new OrbitControls(camera, canvas);

//======================================================CRESTE LIGHT
const pointLight = new THREE.PointLight(0xffffff, 120, 15);
//create a point light helper
const pointlightHelper = new THREE.PointLightHelper(pointLight);
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
const spotLight = new THREE.SpotLight(0xffffff, 12, 15, Math.PI / 6);
spotLight.position.y = 2;
spotLight.position.x = 6;
//point light position
const rectHelp = new THREE.SpotLightHelper(spotLight, 0xff0000);
scene.add(pointLight);
scene.add(rectHelp);
scene.add(pointlightHelper);
pointLight.position.y = 2;
pointLight.position.x = -2;
gui.add(pointLight.position, 'x').min(-100).max(10).step(0.1);
gui.add(pointLight.position, 'y').min(-100).max(10).step(0.1);
// ------------------------------create three meshes MATERIAL
//one material for all meshes

const material = new THREE.MeshStandardMaterial({
  side: 2,
  map: colortex,
  alphaMap: alphatex,
  color: parameter.color,
  // opacity: 0.5,
  //transparent: true,
  aoMap: ambienttext,
});
const materialMatcap = new THREE.MeshPhongMaterial();

gui.addColor(parameter, 'color').onChange(() => {
  material.color.set(parameter.color);
});
material.displacementMap = heighttext;
material.displacementScale = 0.005;
material.normalMap = normaltext;

gui.add(material, 'displacementScale').min(0).max(100).step(0.001);
gui.add(material, 'metalness').min(-1000).max(100).step(0.1);
gui
  .add(material.normalScale, 'x')
  .min(-1000)
  .max(100)
  .step(0.1)
  .name('normalX');
gui
  .add(material.normalScale, 'y')
  .min(-1000)
  .max(100)
  .step(0.1)
  .name('normalY');
gui.add(material, 'roughness').min(-1000).max(100).step(0.1);
const sphereGeo = new THREE.SphereGeometry(0.5, 16, 16);
const PlaneGeo = new THREE.PlaneGeometry(1, 1, 164, 164);
const torusGeo = new THREE.TorusGeometry(0.5, 0.2, 6);

//-----------------------------------------------mesh create
const sphereMesh = new THREE.Mesh(sphereGeo, materialMatcap);
const planeMesh = new THREE.Mesh(PlaneGeo, material);
const torusMesh = new THREE.Mesh(torusGeo, material);
// colortex.minFilter = THREE.NearestFilter;
// colortex.magFilter = THREE.NearestFilter;
//----------addd on geometry cordinates
planeMesh.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(PlaneGeo.attributes.uv.array, 2),
);
// ---------------------------------------create three meshes
scene.add(sphereMesh);
scene.add(planeMesh);
scene.add(torusMesh);
scene.add(grid);
scene.add(axes);
//scene.add(ambientLight);
scene.add(spotLight);
//---------------------------------------camera POsitions
camera.position.z = 5;
planeMesh.position.x = 2;
torusMesh.position.x = -2;
camera.position.y = 0.5;
materialMatcap.specular = new THREE.Color(0xadff00);
materialMatcap.shininess = 10;
gui.add(planeMesh.rotation, 'y').min(-180).max(180).step(0.1);
gui.add(material, 'aoMapIntensity').min(-100).max(100).step(0.1);
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
//--------------------------------------- resize window
window.addEventListener('resize', () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
});
const clock = new THREE.Clock();
orbitControl.enableDamping = true;
renderer.setSize(size.width, size.height);
function tick() {
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
  // planeMesh.rotation.y = (Math.PI / 4) * clock.getElapsedTime();
  torusMesh.rotation.y = (Math.PI / 4) * clock.getElapsedTime();
  sphereMesh.rotation.y = (Math.PI / 4) * clock.getElapsedTime();
  // planeMesh.rotation.x = (Math.PI / 4) * clock.getElapsedTime() * 0.5;
  torusMesh.rotation.x = (Math.PI / 4) * clock.getElapsedTime() * 0.5;
  sphereMesh.rotation.x = (Math.PI / 4) * clock.getElapsedTime() * 0.5;
  orbitControl.update();
  window.requestAnimationFrame(tick);
  renderer.render(scene, camera);
}

tick();
