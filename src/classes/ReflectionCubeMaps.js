import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import Tween from '@tweenjs/tween.js';
import DataImage from '../assets/Data';

class SegmentedCubeMaps {
  constructor(container) {
    this.container = container;
  }

  init = () => {
    this.initCamera();
    this.initScene();
    this.initializeSkyBox();
    this.initializeRaycaster();
    this.initRenderer();
    this.initStats();
    this.container.appendChild(this.renderer.domElement);
    this.container.addEventListener('mousemove', this.onMouseMove, false);
    this.container.addEventListener('pointerdown', this.onMouseDown, false);
    this.container.addEventListener('touchstart', this.onMouseDown, false);
    // this.container.addEventListener('touchend', this.onTouchEnd, false);
    this.container.addEventListener('touchmove', this.onMouseMove, false);
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
    this.onRaycaster();
  };

  onMouseDown = (event) => {
    console.log('MOuseDown', event);
    this.getMouse(event);
    this.onRaycaster();
  };

  onRaycaster = () => {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    if (intersects.length > 0) {
      const { object, faceIndex } = intersects[0];
      console.log(object, faceIndex);
      object.geometry.faces[faceIndex].color.set(Math.random() * 0xffffff);
      object.geometry.colorsNeedUpdate = true;
      if (!this.hotspotExist(object)) {
        const { x, y, z } = this.getHotspotPosition(object, faceIndex);
        this.createHotspot(
          {
            x,
            y,
            z,
            name: `${object.name}-hotspot`,
            key: 'test',
            img: DataImage.Arrow,
            level: 1
          },
          object
        );
      }
    }
  };

  getHotspotPosition = (object, faceIndex) => {
    const { geometry } = object;
    const { faces, vertices } = geometry;
    const face = faces[faceIndex];

    const v1 = vertices[face.a];
    const v2 = vertices[face.b];
    const v3 = vertices[face.c];

    const x = (v1.x + v2.x + v3.x) / 3;
    const y = (v1.y + v2.y + v3.y) / 3;
    const z = (v1.z + v2.z + v3.z) / 3;
    return { x, y, z };
  };

  hotspotExist = (object) => {
    let exist = false;
    if (object.children.length > 0) {
      for (let i = object.children.length - 1; i >= 0; i -= 1) {
        const children = object.children[i];
        if (children.name === `${object.name}-hotspot`) {
          exist = true;
          break;
        }
      }
    }

    return exist;
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
  };

  initCamera = () => {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      1,
      5000
    );
    this.camera.position.z = 0.1;
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
    // const mat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
    // const wireframe = new THREE.LineSegments(skyBoxGeometry, mat);
    this.skyboxMiddle = new THREE.Mesh(skyBoxGeometry, materialArray);
    // this.skyboxMiddle.add(wireframe);
    this.skyboxMiddle.name = 'middle';

    this.scene.add(this.skyboxMiddle);
  };

  setImages = (urls) => {
    this.urls = urls;
  };

  initializeSkyBox = () => {
    const time = new Date().getTime();
    const cubeMapTexture = new THREE.TextureLoader().load(
      `https://360-image-collection-3js.s3-us-west-2.amazonaws.com/e2b94523-d282-4d97-8c4d-92f84c3c45a6/28/WesterlyA1-KitchenModernF01.jpg?${time}`,
      () => {
        cubeMapTexture.mapping = THREE.EquirectangularReflectionMapping;
        cubeMapTexture.magFilter = THREE.LinearFilter;
        cubeMapTexture.minFilter = THREE.LinearMipMapLinearFilter;

        const meshPhong = new THREE.MeshPhongMaterial({
          opacity: 1,
          transparent: false,
          side: THREE.DoubleSide,
          envMap: cubeMapTexture,
          vertexColors: true,
          wireframe: true
        });

        const skyBoxGeometry = new THREE.BoxGeometry(
          1000,
          1000,
          1000,
          10,
          10,
          10
        );
        const mesh = new THREE.Mesh(skyBoxGeometry, meshPhong);
        this.scene.add(mesh);
        this.scene.background = cubeMapTexture;
        console.log(this.scene);
      }
    );
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
    // console.log(this.camera.position);
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
