//ek scene hai
const scene = new THREE.Scene();
//ek camera hai jisse canvas
const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
//canvas
const canvas = document.querySelector('.webgl');
//painter hai
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0xff0000});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
camera.position.z = 4;
camera.position.x = -2;
camera.position.y = -2;
renderer.setSize(800, 600);
renderer.render(scene, camera);
