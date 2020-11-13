import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";

const px = require("../assets/px.jpg");
const nx = require("../assets/nx.jpg");
const py = require("../assets/py.jpg");
const ny = require("../assets/ny.jpg");
const pz = require("../assets/pz.jpg");
const nz = require("../assets/nz.jpg");

class CubeMap {
  constructor(container) {
    this.container = container;
    this.target = new THREE.Vector3();
    this.lon = 90;
    this.lat = 0;
    this.phi = 0;
    this.theta = 0;
  }

  init = () => {
    this.initCamera();
    this.initScene();
    this.initCubeMap();
    this.initRenderer();
    this.initStats();

    document.addEventListener("mousedown", this.onDocumentMouseDown, false);
    document.addEventListener("wheel", this.onDocumentMouseWheel, false);
    document.addEventListener("touchstart", this.onDocumentTouchStart, false);
    document.addEventListener("touchmove", this.onDocumentTouchMove, false);
    window.addEventListener("resize", this.onWindowResize, false);
  };

  onDocumentMouseDown = (event) => {
    event.preventDefault();
    //Ensure that drag events are monitored
    document.addEventListener("mousemove", this.onDocumentMouseMove, false);
    document.addEventListener("mouseup", this.onDocumentMouseUp, false);
  };

  onDocumentMouseMove = (event) => {
    //Mouse movement distance currentEvent.movementX = currentEvent.screenX - previousEvent.screenX
    const movementX =
      event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const movementY =
      event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    this.lon -= movementX * 0.1;
    this.lat += movementY * 0.1;
  };

  onDocumentMouseUp = (event) => {
    //Ensure that drag events are monitored
    document.removeEventListener("mousemove", this.onDocumentMouseMove);
    document.removeEventListener("mouseup", this.onDocumentMouseUp);
  };

  onDocumentMouseWheel = (event) => {
    //The camera's vision pulls in or away as the mouse scrolls.
    this.camera.fov += event.deltaY * 0.05;
    this.camera.updateProjectionMatrix();
  };

  onDocumentTouchStart = (event) => {
    event.preventDefault();
    //There is no movement at the mobile end, so we use touch X touch Y directly to calculate the distance of movement.
    const touch = event.touches[0];

    this.touchX = touch.screenX;
    this.touchY = touch.screenY;
  };

  onDocumentTouchMove = (event) => {
    event.preventDefault();

    const touch = event.touches[0];

    this.lon -= (touch.screenX - this.touchX) * 0.1;
    this.lat += (touch.screenY - this.touchY) * 0.1;

    this.touchX = touch.screenX;
    this.touchY = touch.screenY;
  };

  initCamera = () => {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      1,
      1000
    );
  };

  initScene = () => {
    this.scene = new THREE.Scene();
  };

  initCubeMap = () => {
    const sides = [
      {
        url: px, //Left
        position: [-512, 0, 0],
        rotation: [0, Math.PI / 2, 0],
      },
      {
        url: nx, //Right
        position: [512, 0, 0],
        rotation: [0, -Math.PI / 2, 0],
      },
      {
        url: py, //Upper side
        position: [0, 512, 0],
        rotation: [Math.PI / 2, 0, Math.PI],
      },
      {
        url: ny, //Underside
        position: [0, -512, 0],
        rotation: [-Math.PI / 2, 0, Math.PI],
      },
      {
        url: pz, //Front
        position: [0, 0, 512],
        rotation: [0, Math.PI, 0],
      },
      {
        url: nz, //after
        position: [0, 0, -512],
        rotation: [0, 0, 0],
      },
    ];
    //Add six pictures to the scene
    for (var i = 0; i < sides.length; i += 1) {
      const side = sides[i];

      const element = document.createElement("img");
      element.width = 1026; // 2 pixels extra to close the gap.
      element.src = side.url;
      //CSS 3D Object is a way to expand. The prototype is object 3D. See CSS 3D Renderer. js.
      const object = new CSS3DObject(element);
      object.position.fromArray(side.position);
      object.rotation.fromArray(side.rotation);
      this.scene.add(object);
    }
  };

  initRenderer = () => {
    //renderer
    this.renderer = new CSS3DRenderer();
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.container.appendChild(this.renderer.domElement);
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

  rotation = () => {
    this.lon += 0.1;
    this.lat = Math.max(-85, Math.min(85, this.lat));
    this.phi = THREE.Math.degToRad(90 - this.lat); //Angle to radian
    this.theta = THREE.Math.degToRad(this.lon);
  };

  animate = () => {
    requestAnimationFrame(this.animate);
    this.rotation();
    this.target.x = Math.sin(this.phi) * Math.cos(this.theta);
    this.target.y = Math.cos(this.phi);
    this.target.z = Math.sin(this.phi) * Math.sin(this.theta);

    this.camera.lookAt(this.target);
    this.render();
  };

  render = () => {
    this.renderer.render(this.scene, this.camera);
    this.stats.update();
  };
}
export default CubeMap;
