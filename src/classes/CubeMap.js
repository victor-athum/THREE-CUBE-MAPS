import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

const px = require('../assets/px.jpg');
const nx = require('../assets/nx.jpg');
const py = require('../assets/py.jpg');
const ny = require('../assets/ny.jpg');
const pz = require('../assets/pz.jpg');
const nz = require('../assets/nz.jpg');

class CubeMap {
  constructor(container) {
    this.container = container;
  }

  init = (urls) => {
    this.urls = urls;
    this.initCamera();
    this.initCubeMap();
    this.initScene();
    this.initLights();
    this.initRenderer();
    this.initControls();
    this.initStats();
    window.addEventListener('resize', this.onWindowResize, false);
  };

  initCamera = () => {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      1,
      5000
    );
    this.camera.position.z = 2000;
  };

  initCubeMap = () => {
    this.reflectionCube = new THREE.CubeTextureLoader().load(this.urls);
  };

  initScene = () => {
    this.scene = new THREE.Scene();
    this.scene.background = this.reflectionCube;
  };

  initLights = () => {
    //lights
    this.ambient = new THREE.AmbientLight(0xffffff);
    // this.scene.add(this.ambient);

    this.pointLight = new THREE.PointLight(0xffffff, 2);
    // this.scene.add(this.pointLight);
  };

  initRenderer = () => {
    //renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.container.appendChild(this.renderer.domElement);
  };

  initControls = () => {
    //controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false;
    this.controls.enableZoom = true;
    this.controls.enableDamping = true;
    this.controls.minPolarAngle = 0.8;
    this.controls.maxPolarAngle = 2.4;
    this.controls.dampingFactor = 0.2;
    // negating makes invert this.controls.
    this.controls.rotateSpeed = -0.2;

    this.controls.update();
  };

  initStats = () => {
    //stats
    this.stats = new Stats();
    this.container.appendChild(this.stats.dom);
  };

  onWindowResize = () => {
    this.camera.aspect =
      this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
  };

  animate = () => {
    requestAnimationFrame(this.animate);
    this.render();
  };

  render = () => {
    this.renderer.render(this.scene, this.camera);
    this.stats.update();
  };
}
export default CubeMap;
