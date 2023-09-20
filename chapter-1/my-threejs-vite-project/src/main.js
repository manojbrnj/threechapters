import * as three from 'three';
import {gsap} from 'gsap';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {TransformControls} from 'three/examples/jsm/controls/TransformControls.js';
import * as dat from 'lil-gui';
import imageSource from './public/WM_IndoorWood-44_1024.png';
// const scene = new three.Scene();
// const camera = new three.PerspectiveCamera(47, 800 / 600, 0.1, 1000);
// const geometry = new three.BoxGeometry(1, 1, 1);
// const material = new three.MeshBasicMaterial({color: 0xff0000});
// const mesh = new three.Mesh(geometry, material);
// scene.add(mesh);
// camera.position.z = 5;
// const canvas = document.querySelector('#app');
// const renderer = new three.WebGLRenderer({canvas: canvas});
// renderer.setSize(800, 600);
// renderer.render(scene, camera);
// console.log(OrbitControls);
const gui = new dat.GUI();
const loadingManager = new three.LoadingManager();
loadingManager.onStart = (url, loaded, total) => {
  console.log(url, loaded, total);
};
const textureloader = new three.TextureLoader(loadingManager);
const texture = textureloader.load('./door/color.jpg');

// texture.repeat.x = 2;
// texture.repeat.y = 3;
texture.wrapS = three.MirroredRepeatWrapping;
texture.wrapT = three.MirroredRepeatWrapping;
// texture.offset.x = 0.5;
// texture.offset.y = 0.5;
// texture.rotation = 1;
// gui.add(texture, 'rotation').name('texture rotate').min(-180).max(180).step(1);
//console.log(texture);
gui.add(texture.repeat, 'x').name('textureSzizeX').min(-180).max(180).step(1);
gui.add(texture.repeat, 'y').name('textureSzizeY').min(-180).max(180).step(1);
gui.add(texture.offset, 'x').name('textureOffsetX').min(-180).max(180).step(1);
gui.add(texture.offset, 'y').name('textureOffsetY').min(-180).max(180).step(1);
gui
  .add(texture, 'rotation')
  .name('texturerotationY')
  .min(-180)
  .max(180)
  .step(1);
// console.log(gui);

//press karke rakho power up
const parameters = {
  color: 0xff0000,
  spin: () => {
    gsap.to(mesh.rotation, {
      y: (Math.PI / 2) * clock.getElapsedTime() * 2,
      duration: 2,
    });
  },
};
const clock = new three.Clock();
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const scene = new three.Scene();
const camera = new three.PerspectiveCamera(
  45,
  size.width / size.height,
  0.1,
  100,
);
const axisHelper = new three.AxesHelper(3);
scene.add(axisHelper);
const gridHelper = new three.GridHelper(10);
scene.add(gridHelper);
const mesh = new three.Mesh(
  new three.BoxGeometry(1),
  new three.MeshStandardMaterial({map: texture}),
);
const ambientLight = new three.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const light = new three.DirectionalLight(0xffffff, 2);
light.position.set(1, 1, 1);

scene.add(light);
scene.add(mesh);
const canvas = document.querySelector('#app');
const renderer = new three.WebGLRenderer({canvas: canvas, antialias: true});
camera.position.z = 5;
//Debug
gui
  .add(mesh.position, 'x')
  .min(-3)
  .max(3)
  .step(0.1)
  .onChange(() => {
    console.log('color changed');
  });
gui
  .add(mesh.position, 'y')
  .min(-3)
  .max(3)
  .step(0.1)
  .onChange(() => {
    console.log('color changed');
  });
gui
  .add(mesh.position, 'z')
  .min(-3)
  .max(3)
  .step(0.1)
  .onChange(() => {
    console.log('color changed');
  });
gui
  .add(mesh.rotation, 'y')
  .min(-3)
  .max(3)
  .step(0.1)
  .name('ratation-y')
  .onChange(() => {
    console.log('rotation changed');
  });
//camera.position.y = 1.1;
//camera.lookAt(mesh.position);
//create a bufferGeometry  ==> go reverse  bufferAttributes to create attributes get position and vertex count ==> float32Array
//generate random position

// const count = 5;
// 0;

// const positionArr = new Float32Array(count * 3 * 3);
// for (let i = 0; i < count * 3 * 3; i++) {
//   positionArr[i] = Math.random() + 0.5;
// }

// const posAttr = new three.BufferAttribute(positionArr, 3);
// const bfrGeometry = new three.BufferGeometry();
// bfrGeometry.setAttribute('position', posAttr);

// const bfrmat = new three.MeshBasicMaterial({
//   wireframe: true,
//   color: 'green',
// });
// const bfrmesh = new three.Mesh(bfrGeometry, bfrmat);
// scene.add(bfrmesh);
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener('mousemove', (e) => {
  cursor.x = e.clientX / 800 - 0.5;
  cursor.y = e.clientY / 600 - 0.5;
  //console.log(cursor.x);
});
//rotate box on y axis

//const clock = new three.Clock();
// const masterTl = gsap.timeline({repeat: -1});
// masterTl
//   .to(mesh.position, {
//     x: 2,
//     duration: 1,
//     delay: 1,
//     ease: 'bounce',
//   })
//   .to(mesh.position, {
//     x: 0,
//     duration: 1,
//     delay: 1,
//     ease: 'bounce',
//   })
//   .to(camera.position, {
//     x: 2,
//     duration: 1,
//     delay: 1,
//     ease: 'bounce',
//   });
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;
window.addEventListener('resize', (e) => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
});
//controls.enabled = false;
// //const controlsTrans = new TransformControls(mesh, canvas);
// //scene.add(controlsTrans);
// const control = new TransformControls(camera, canvas);
// control.addEventListener('dragging-changed', function (event) {
//   controls.enabled = !event.value;
// });
// // control.addEventListener('change', renderer);
// control.attach(mesh);
// scene.add(control);
gui.add(mesh, 'visible');
gui.add(mesh.material, 'wireframe');

gui.addColor(parameters, 'color').onChange(() => {
  mesh.material.setValues({color: parameters.color});
});
gui.add(parameters, 'spin');
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
window.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});
texture.magFilter = three.NearestFilter;
function tick() {
  // mesh.rotation.y = (Math.PI / 2) * clock.getElapsedTime();
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  // camera.position.y = Math.sin(cursor.y * -5);
  //camera.lookAt(new three.Vector3());
  // console.log(clock.getElapsedTime());
  controls.update();
  camera.updateProjectionMatrix();
  requestAnimationFrame(tick);
  renderer.setSize(size.width, size.height);
  renderer.render(scene, camera);
}

tick();
