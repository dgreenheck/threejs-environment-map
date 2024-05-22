import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x505050);
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.toneMapping = THREE.NeutralToneMapping;

document.body.appendChild(renderer.domElement);

// SETUP CAMERA
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(-0.2, 1.5, 6.5);
controls.target.set(-0.2, 0.5, 0);
controls.autoRotate = false;
controls.autoRotateSpeed = 1;
controls.update();

// SETUP SCENE
const floorTexture = new THREE.TextureLoader().load('grid.png');
floorTexture.repeat = new THREE.Vector2(20, 20);
floorTexture.wrapS = THREE.ReplaceWrapping;
floorTexture.wrapT = THREE.ReplaceWrapping;

const scene = new THREE.Scene();

const ambient = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambient);

const light = new THREE.DirectionalLight(0xffffff, 5);
light.position.set(0, 10, 0);
light.castShadow = true;
scene.add(light);

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: floorTexture
  }));
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

const hdriLoader = new RGBELoader()
hdriLoader.load('lonely_road_afternoon_puresky_1k.hdr', function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

new GLTFLoader().load('ferrari_488_pista_widebody.glb', (gltf) => {
  const mesh = gltf.scene;
  console.log(mesh);

  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.traverse((child) => {
    if (child.material) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.material.envMapIntensity = 1;
    }
  });
  scene.add(mesh);
});

// RENDER LOOP

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}

// Events
window.addEventListener('resize', () => {
  // Resize camera aspect ratio and renderer size to the new window size
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
