import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

class AnimationStateClass {
    constructor() {
        this._states = {};
        this._currentState = null;
    }

    _AddState(name, type) {
        this._states[name] = type;
    }

    _SetState(name) {
        const prevState = this._currentState;

        if (prevState) {
            if (prevState.Name == name) {
                return;
            }
            prevState.Exit();
        }

        const state = new this._states[name](this);

        this._currentState = state;
        state.Enter(prevState);
    }

    Update(timeElapsed, input) {
        if (this._currentState) {
            this._currentState.Update(timeElapsed, input);
        }
    }
}

class BasicCharacterControllerClass {
    constructor(params) {
        // params incldue camera and scene
        this.__Initialize(params);
    }

    __Initialize = (params) => {
        this._camera = params._camera;
        this._scene = params._scene;
        // module acceleration and deccelaration
        this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
        this._acceleration = new THREE.Vector3(1, 0.25, 50.0);
        this._velocity = new THREE.Vector3(0, 0, 0);
        // animations
        this._animations = {};
        // character state
        // this._characterState = 
    }
}

class CharacterControllMainClass {
    constructor() {
        this.__Initialize();
    }

    __Initialize = () => {
        // canvas
        const canvas = document.querySelector('canvas.webgl');
        // canvas size
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        // renderer
        this._threejs = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
        });
        this._threejs.setSize(sizes.width, sizes.height);
        // shadow map
        this._threejs.shadowMap.enabled = true;
        this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
        this._threejs.physicallyCorrectLights = true;
        this._threejs.toneMapping = THREE.ACESFilmicToneMapping;
        this._threejs.outputEncoding = THREE.sRGBEncoding;
        this._threejs.setPixelRatio(window.devicePixelRatio);
        // camera
        const fov = 60;
        const aspect = sizes.width / sizes.height;
        const near = 1.0;
        const far = 1000.0;
        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this._camera.position.set(15, 15, 20);
        // scene
        this._scene = new THREE.Scene();
        // light
        let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        light.position.set(-100, 100, 100);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.bias = -0.001;
        light.shadow.mapSize.width = 4096;
        light.shadow.mapSize.height = 4096;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.left = 50;
        light.shadow.camera.right = -50;
        light.shadow.camera.top = 50;
        light.shadow.camera.bottom = -50;
        this._scene.add(light);
        light = new THREE.AmbientLight(0xFFFFFF, 0.25);
        this._scene.add(light);
        // controls
        this._controls = new OrbitControls(this._camera, canvas);
        // this._controls.enableDamping = true;
        this._controls.target.set(0, 10, 0);
        this._controls.update();
        // plane for shadow catching
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100, 10, 10),
            new THREE.MeshStandardMaterial({
                color: 0x808080,
            }));
        plane.castShadow = false;
        plane.receiveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        this._scene.add(plane);
    };
}


let _APP = null;
window.addEventListener('DOMContentLoaded', () => {
    _APP = new CharacterControllMainClass();
});
