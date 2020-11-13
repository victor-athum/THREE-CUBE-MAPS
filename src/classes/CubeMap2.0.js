import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

class CubeMap {
  constructor(container) {
    this.container = container;
  }

  init = () => {
    this.initCamera();
    this.initTexture();
    this.initScene();
    this.initLights();
    this.initRenderer();
    this.initControls();
    this.initStats();
    window.addEventListener("resize", this.onWindowResize, false);
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

  initTexture = () => {
    const cubeMap = new THREE.TextureLoader().load(
      "https://360-image-collection-3js.s3-us-west-2.amazonaws.com/e2b94523-d282-4d97-8c4d-92f84c3c45a6/28/WesterlyA1-KitchenModernF01.jpg",
      (map) => {
        cubeMap.mapping = THREE.EquirectangularReflectionMapping;
        cubeMap.magFilter = THREE.LinearFilter;
        cubeMap.minFilter = THREE.LinearMipMapLinearFilter;
        this.scene.background = cubeMap;
      }
    );
  };

  initScene = () => {
    this.scene = new THREE.Scene();
  };

  initSkybox = () => {
    const skybox = new THREE.Mesh(
      new THREE.BoxGeometry(10000, 10000, 10000),
      this.equirectMaterial
    );
    this.scene.add(skybox);
  };

  initLights = () => {
    //lights
    this.ambient = new THREE.AmbientLight(0xffffff);
    this.scene.add(this.ambient);

    this.pointLight = new THREE.PointLight(0xffffff, 2);
    this.scene.add(this.pointLight);
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
