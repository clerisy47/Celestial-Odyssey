import "./style.css";

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import load3d from "./js/3dmodelloader";
import Initilize from "./js/uicontroller/uiMain";
import { initWebState } from "./js/state";
import addToolTip from "./js/toolTips";
import {
  toggleSound,
  showPlanetBox,
  hidePlanetBox,
  showInfo,
  closeInfo,
  toggleInpuBox,
} from "./js/uicontroller/controller";
import WebState from "./js/state";
import { resetLocation } from "./js/uicontroller/uiMain";
import { stopInterval, stopSpeech } from "./js/utils";

addToolTip();
const elt3d = document.querySelector(".scene");

const scene = new THREE.Scene();
scene.background = new THREE.Color("rgb(0,0,0)");

export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
window.camera = camera;
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
elt3d.appendChild(renderer.domElement);

camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.minDistance = 2;
controls.maxDistance = 10;
controls.rotateSpeed = 0.8;
controls.zoomSpeed = 1;

const ambientLight = new THREE.AmbientLight(
  new THREE.Color("rgb(255,255,255)"),
  2
);
scene.add(ambientLight);

// const gridHelper = new THREE.GridHelper(10, 10);
// scene.add(gridHelper);

// const axesHelper = new THREE.AxesHelper(10);
// scene.add(axesHelper);

const sphereGeometry = new THREE.SphereGeometry(50, 32, 32); // Adjust the radius and resolution as needed
sphereGeometry.scale(-1, 1, 1);

const textureLoader = new THREE.TextureLoader();
const sphereMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load(`/assets/8k_stars.jpg`),
});
sphereMaterial.map.colorSpace = THREE.SRGBColorSpace;

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

window.addEventListener("resize", () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(newWidth, newHeight);
});
function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

initWebState(scene);
animate();
// runSketch();
load3d(scene, "earth");

var hover_sound = new Audio("./assets/sounds/ui_sounds/hover_sound.mp3");
var click_sound = new Audio("./assets/sounds/ui_sounds/click_sound.mp3");
var spaceship_sound = new Audio(
  "./assets/sounds/ui_sounds/spaceship_sound.mp3"
);

document.querySelectorAll(".planet").forEach((p) => {
  p.addEventListener("click", function () {
    hover_sound.play();
    disablePlanetClick();
    setTimeout(() => {
      enablePlanetClick();
    }, 5000);
    load3d(scene, this.classList[1]);
    setTimeout(() => {
      spaceship_sound.play();
    }, 300);
  });
});

function disablePlanetClick() {
  document.querySelectorAll(".planet").forEach((p) => {
    p.style.pointerEvents = "none";
  });
}
function enablePlanetClick() {
  document.querySelectorAll(".planet").forEach((p) => {
    p.style.pointerEvents = "auto";
  });
}

document.querySelectorAll(".planet").forEach((p) => {
  p.addEventListener("mouseenter", function () {
    console.log("hovered");
  });
});

document.querySelector(".sound-box").addEventListener("click", () => {
  toggleSound(WebState.modelName);
});

document.querySelector(".planet-text-box").addEventListener("click", () => {
  showPlanetBox();
  click_sound.play();
});
document.querySelector(".vec1").addEventListener("click", hidePlanetBox);
document.querySelector(".vec2").addEventListener("click", hidePlanetBox);
document.querySelector(".info-box").addEventListener("click", () => {
  showInfo();
  click_sound.play();
});
document.querySelector(".close-info-text-btn").addEventListener("click", () => {
  click_sound.play();
  closeInfo();
  stopInterval();
  stopSpeech();
});
document.querySelector(".bot-img").addEventListener("click", toggleInpuBox);
document.querySelector(".askAI").addEventListener("click", toggleInpuBox);
document
  .querySelector(".location-info-box-closebtn")
  .addEventListener("click", () => {
    click_sound.play();
    resetLocation();
    stopInterval();
    stopSpeech();
  });
