import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader.js";
import Stats from "three/examples/jsm/libs/stats.module";

const pcd = require("../assets/living_contemporary.pcd");

class CubeMap {
  constructor(container) {
    this.container = container;
  }

  init = () => {
    this.initCamera();
    this.initScene();
    this.initLoader();
    this.initLights();
    this.initRenderer();
    this.initControls();
    this.initStats();
    window.addEventListener("resize", this.onWindowResize, false);
    window.addEventListener("keypress", this.keyboard);
  };

  initCamera = () => {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      1,
      5000
    );
  };

  initLoader = () => {
    var loader = new PCDLoader();
    loader.load(pcd, (points) => {
      this.scene.add(points);
      const center = points.geometry.boundingSphere.center;
      this.controls.target.set(center.x, center.y, center.z);
      this.controls.update();
    });
  };

  initScene = () => {
    this.scene = new THREE.Scene();
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
    this.controls = new TrackballControls(
      this.camera,
      this.renderer.domElement
    );
    this.controls.rotateSpeed = 2.0;
    this.controls.zoomSpeed = 0.3;
    this.controls.panSpeed = 0.2;

    this.controls.staticMoving = true;

    this.controls.minDistance = 0.3;
    this.controls.maxDistance = 0.3 * 100;
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

    this.controls.handleResize();
  };

  animate = () => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.render();
  };

  render = () => {
    this.renderer.render(this.scene, this.camera);
    this.stats.update();
  };

  keyboard = (ev) => {
    var points = this.scene.getObjectByName("living_contemporary.32d8def2.pcd");

    switch (ev.key || String.fromCharCode(ev.keyCode || ev.charCode)) {
      case "+":
        points.material.size *= 1.2;
        points.material.needsUpdate = true;
        break;

      case "-":
        points.material.size /= 1.2;
        points.material.needsUpdate = true;
        break;

      case "c":
        points.material.color.setHex(Math.random() * 0xffffff);
        points.material.needsUpdate = true;
        break;

      default:
        break;
    }
  };
}
export default CubeMap;
