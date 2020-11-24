import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import Tween from '@tweenjs/tween.js';

class SegmentedCubeMaps {
  constructor(container) {
    this.container = container;
  }

  init = (urls) => {
    this.initScene();
    this.initCamera();
    this.setImages(urls);
    this.createMaterialArray();
    this.initializeRaycaster();
    this.initRenderer();
    this.initStats();
    this.container.appendChild(this.renderer.domElement);
    this.container.addEventListener('mousemove', this.onMouseMove, false);
    // this.container.addEventListener('pointerdown', this.clearCube, false);
    this.initControls();
    window.addEventListener('resize', this.onWindowResize, false);
  };

  getMouse = (event) => {
    const deltaX = event.touches ? event.touches[0].clientX : event.clientX;
    const deltaY = event.touches ? event.touches[0].clientY : event.clientY;
    const rect = this.renderer.domElement.getBoundingClientRect();
    const x = ((deltaX - rect.left) / rect.width) * 2 - 1;
    const y = -((deltaY - rect.top) / rect.height) * 2 + 1;
    this.mouse = new THREE.Vector2(x, y);
  };

  onMouseMove = (event) => {
    this.getMouse(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    if (intersects.length > 0) {
      const { object, faceIndex } = intersects[0];
      console.log(faceIndex);
      object.geometry.faces[faceIndex].color.set(Math.random() * 0xffffff);
      object.geometry.colorsNeedUpdate = true;
      console.log(object);
    }
  };

  clearCube = () => {
    for (let i = this.scene.children.length - 1; i >= 0; i -= 1) {
      const children = this.scene.children[i];
      if (children.name.includes('hotspot')) {
        this.scene.remove(children);
      }
    }
  };

  initScene = () => {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('black');
  };

  initCamera = () => {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      1,
      5000
    );
    this.camera.position.z = Math.PI;
  };

  initRenderer = () => {
    // renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
  };

  initSkybox = async (materialArray) => {
    const skyBoxGeometry = new THREE.BoxGeometry(1000, 1000, 1000, 2, 2, 2);
    const mat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
    const wireframe = new THREE.LineSegments(skyBoxGeometry, mat);
    this.skyboxMiddle = new THREE.Mesh(skyBoxGeometry, materialArray);
    this.skyboxMiddle.add(wireframe);
    this.skyboxMiddle.name = 'middle';

    this.scene.add(this.skyboxMiddle);
  };

  setImages = (urls) => {
    this.urls = urls;
  };

  createMaterialArray = () => {
    const materialArray = this.urls.map((image) => {
      const texture = new THREE.TextureLoader().load(image);
      return new THREE.MeshBasicMaterial({
        map: texture,
        color: 0xffffff,
        side: THREE.DoubleSide,
        vertexColors: true
      });
    });
    this.initSkybox(materialArray);
  };

  initializeRaycaster = () => {
    this.raycaster = new THREE.Raycaster();
  };

  initLights = () => {
    // lights
    this.ambient = new THREE.AmbientLight(0xffffff);
    this.scene.add(this.ambient);

    this.pointLight = new THREE.PointLight(0xffffff, 2);
    this.scene.add(this.pointLight);
  };

  initControls = () => {
    // controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false;
    this.controls.enableZoom = true;
    this.controls.enableDamping = true;
    this.controls.minPolarAngle = 0.8;
    this.controls.maxPolarAngle = 2.4;
    this.controls.dampingFactor = 0.2;
    // negating makes invert this.controls.
    this.controls.rotateSpeed = -0.2;
  };

  displayPosition = () => {
    const intersection = this.raycaster.intersectObject(this.skyboxMiddle);
    if (intersection.length > 0) {
      const { point } = intersection[0];
      console.log('hotspot location', point);
      console.log('camera position', this.camera.position);
    }
  };

  initStats = () => {
    // stats
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

  createHotspot = ({ x, y, z, name, key, img, level }, object) => {
    const point = new THREE.Vector3(x, y, z);
    const texture = new THREE.TextureLoader().load(img);
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.name = name;
    sprite.isHotspot = true;
    sprite.key = key;
    sprite.position.copy(point.clone().normalize().multiplyScalar(10));
    if (level) {
      sprite.level = level;
    }
    this.scale(sprite);

    object.add(sprite);
  };

  scale = (sprite) =>
    new Tween.Tween(sprite.scale)
      .to(
        {
          x: sprite.scale.x * 0.5,
          y: sprite.scale.y * 0.5,
          z: sprite.scale.z * 0.5
        },
        500
      )
      .onUpdate(() => {
        this.render();
      })
      .easing(Tween.Easing.Elastic.Out);
}
export default SegmentedCubeMaps;
