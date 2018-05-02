import * as THREE from 'libs/three.min.js';
require('libs/OrbitControls.js');
require('libs/GLTF2Loader.js');
import HelperFunctions from 'HelperFunctions.js';
import config from 'config.js';

var ctx = canvas.getContext('webgl', {
  antialias: true,
  preserveDrawingBuffer: true
});

const WIN_RATIO = window.innerWidth / window.innerHeight;
var renderer = new THREE.WebGLRenderer({ context: ctx, canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(65, WIN_RATIO, 0.1, 1000);
// camera.position.set(0, 0, 3);
// camera.zoom = 0.5;
var controls;

/**
 * --------For loading--------(If you don't need it, remove it)
*/
var manager = new THREE.LoadingManager();
manager.onStart = function(item, loaded, total){
  console.log('Loading start...');
  wx.showLoading({
    title: 'Loading',
  });
};
manager.onLoad = function(){
  console.log('Loading complete');
  wx.hideLoading();
  wx.showModal({
    title: 'ThreeJS Demo',
    content: 'Tips: Tap the rabbit ear, starting recording; Tap its mouth to hear what you have recorded.',
    showCancel: false,
    confirmText:'Start!',
    success: function(res){
      if(res.confirm){
        initControls();
      }
    },
  });
}
manager.onProgress = function(item, loaded, total){
  let msg = 'Loaded: ' + Math.round(loaded/total*100, 2)+'%';
  console.log(msg + '\n' + item);
  wx.showLoading({
    title: msg,
  });
};
manager.onError = function(url){
  console.log('[Error] on loading: ' + url);
}
var loader = new THREE.GLTF2Loader(manager);

/**
 * skybox as env map
*/
const path = config.skyboxPath;
const format = config.skyboxFormat;
var envMap = new THREE.CubeTextureLoader(manager).load([
  path + 'px' + format, path + 'nx' + format,
  path + 'py' + format, path + 'ny' + format,
  path + 'pz' + format, path + 'nz' + format, 
]);
scene.background = envMap;

/**
 * load glb models
*/
var rabbitMainMeshes = [];
var rabbitEarsMeshes = [];
var rabbitMouthMeshes = [];
loader.load(
  config.rabbitUrl,
  function(gltf){
    scene.add(gltf.scene);
    gltf.scene.traverse(function(child){
      if(child.isMesh){
        child.name = 'rabbitMain';
        child.material.envMap = envMap;
        child.material.roughness = 0.5;
        rabbitMainMeshes.push(child);
      }
    });
  }
);
/**
 * add lights
*/
var ambientLight = new THREE.AmbientLight(0xaaaaaa);
scene.add(ambientLight);
var light = new THREE.DirectionalLight(0xFFCF89, 0.5);
light.position.set(-2.24, 2.57, 6.70);
scene.add(light);


export default class Main{
  constructor(){

    this.loop();
  }

  

  update(){
  }

  render(){
    renderer.render(scene, camera);
  }

  loop(){
    this.update();
    this.render();

    window.requestAnimationFrame(this.loop.bind(this), canvas);
  }
}

function initControls() {
  camera.position.set(0, 1, 3);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  // controls = new THREE.OrbitControls(camera);
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.target.set(0, 1, 0);
  controls.update();
}
