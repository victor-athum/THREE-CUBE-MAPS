import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import Tween from '@tweenjs/tween.js';
import DataImage from '../assets/Data';

class CubeMap {
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
    this.container.addEventListener('pointerdown', this.clearCube, false);
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
      const { object } = intersects[0];
      if (
        object.name !== 'middle' &&
        !object.name.includes('hotspot') &&
        !this.hotspotExist(object)
      ) {
        this.createHotspot(
          {
            x: object.position.x,
            y: -10,
            z: object.position.z,
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
    this.scene.background = new THREE.Color('white');
  };

  initCamera = () => {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      1,
      1000
    );
    this.camera.position.z = Math.PI;
  };

  initRenderer = () => {
    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
  };

  initSkybox = async (materialArray) => {
    const skyBoxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
    // try the rectangle approach
    const outerBoxGeometry = new THREE.BoxBufferGeometry(1, 100, 1000, 1, 1, 1);
    this.skyboxMiddle = new THREE.Mesh(skyBoxGeometry, materialArray);
    this.skyboxMiddle.name = 'middle';
    const meshOptions = {
      opacity: 1,
      transparent: true
    };
    this.skyboxRight = new THREE.Mesh(
      outerBoxGeometry,
      new THREE.MeshPhongMaterial(meshOptions)
    );
    this.skyboxRight.name = 'right';
    this.skyboxLeft = new THREE.Mesh(
      outerBoxGeometry,
      new THREE.MeshPhongMaterial(meshOptions)
    );
    this.skyboxLeft.name = 'left';
    this.skyboxFront = new THREE.Mesh(
      outerBoxGeometry,
      new THREE.MeshPhongMaterial(meshOptions)
    );
    this.skyboxFront.name = 'front';
    this.skyboxBack = new THREE.Mesh(
      outerBoxGeometry,
      new THREE.MeshPhongMaterial(meshOptions)
    );
    this.skyboxBack.name = 'back';

    // doesn´t need rotation
    this.skyboxRight.position.x = 500;
    this.skyboxRight.position.y = -50;
    this.skyboxLeft.position.x = -500;
    this.skyboxLeft.position.y = -50;
    // need rotation
    this.skyboxFront.position.z = 500;
    this.skyboxFront.position.y = -50;
    this.skyboxFront.rotation.y = 1.57;
    this.skyboxBack.position.z = -500;
    this.skyboxBack.position.y = -50;
    this.skyboxBack.rotation.y = 1.57;
    this.scene.add(this.skyboxMiddle);
    this.scene.add(this.skyboxRight);
    this.scene.add(this.skyboxLeft);
    this.scene.add(this.skyboxFront);
    this.scene.add(this.skyboxBack);
  };

  setImages = (urls) => {
    this.urls = urls;
  };

  createMaterialArray = () => {
    const materialArray = this.urls.map((image) => {
      const texture = new THREE.TextureLoader().load(image);
      return new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
        wireframe: false,
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
export default CubeMap;
