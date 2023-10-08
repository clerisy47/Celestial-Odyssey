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
import { showIntro, stopInterval, stopSpeech } from "./js/utils";
import { gsap } from "gsap";

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

// initWebState(scene);
animate();
// runSketch();
// load3d(scene, "earth");

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
  .querySelector(".close-ai-btn")
  .addEventListener("click", toggleInpuBox);
document
  .querySelector(".location-info-box-closebtn")
  .addEventListener("click", () => {
    click_sound.play();
    resetLocation();
    stopInterval();
    stopSpeech();
  });

document.querySelector(".start-btn").addEventListener("click", () => {
  gsap.to(document.querySelector(".overlay"), {
    scale: 10,
    opacity: 0,
    transformOrigin: "center",
    onComplete() {
      document.querySelector(".overlay").remove();
      initWebState(scene);
      load3d(scene, "earth");
    },
  });
});

document.querySelector(".background-sound").addEventListener("click", (e) => {
  let elt = e.target;
  if (elt.parentElement.dataset.played == "true") {
    WebState?.ui_music.pause();
    WebState.isMusicOn = false;
    elt.innerHTML = `<svg width="85" height="156" viewBox="0 0 85 156" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M78.2015 0.0131009C76.115 0.0196009 73.8075 0.955601 71.7015 3.0551L34.528 45.1036H6.5C2.9185 45.1036 0 48.0221 0 51.6036V103.604C0 107.185 2.9185 110.104 6.5 110.104H34.5345L71.5 151.951C78 158.451 84.5 155.123 84.5 146.263V7.9236C84.5 2.7821 81.6855 -0.0193989 78.2015 0.000101114V0.0131009Z" fill="black"/>
</svg>
`;
    elt.parentElement.dataset.played = "false";
  } else {
    WebState?.ui_music.play();
    WebState.isMusicOn = true;
    elt.innerHTML = `          <svg
            width="169"
            height="156"
            viewBox="0 0 169 156"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M78.2015 0.0131009C76.115 0.0196009 73.8075 0.955601 71.7015 3.0551L34.528 45.1036H6.5C2.9185 45.1036 0 48.0221 0 51.6036V103.604C0 107.185 2.9185 110.104 6.5 110.104H34.5345L71.5 151.951C78 158.451 84.5 155.123 84.5 146.263V7.9236C84.5 2.7821 81.6855 -0.0193989 78.2015 0.000101114V0.0131009ZM125.326 13.0131C123.944 13.2543 122.677 13.9363 121.714 14.9574C120.751 15.9784 120.145 17.2836 119.986 18.6778C119.826 20.072 120.122 21.4804 120.829 22.6924C121.537 23.9044 122.617 24.855 123.91 25.4021C133.579 30.2636 141.704 37.7228 147.372 46.9431C153.04 56.1634 156.028 66.7804 156 77.6036C156 100.51 143 120.179 123.903 129.805C123.034 130.107 122.239 130.591 121.571 131.223C120.902 131.856 120.376 132.623 120.027 133.474C119.677 134.325 119.512 135.241 119.543 136.161C119.573 137.08 119.799 137.983 120.204 138.809C120.61 139.635 121.186 140.365 121.895 140.952C122.604 141.539 123.43 141.968 124.317 142.212C125.204 142.456 126.133 142.508 127.042 142.366C127.951 142.224 128.82 141.891 129.59 141.388C152.945 129.604 169 105.476 169 77.6036C169 49.7316 152.938 25.6036 129.59 13.8191C128.478 13.1983 127.208 12.918 125.938 13.0131C125.734 13.0035 125.53 13.0035 125.326 13.0131ZM109.889 38.1941C108.489 38.2969 107.161 38.8498 106.101 39.7704C105.042 40.6909 104.309 41.9295 104.012 43.3011C103.715 44.6726 103.87 46.1035 104.454 47.3797C105.037 48.656 106.018 49.7091 107.25 50.3816C117.28 56.6151 123.5 66.4886 123.5 77.6036C123.5 88.7966 117.182 98.8001 107.049 105.027C106.252 105.442 105.551 106.018 104.988 106.718C104.426 107.418 104.015 108.227 103.78 109.094C103.546 109.96 103.494 110.866 103.627 111.754C103.76 112.642 104.076 113.493 104.554 114.253C105.032 115.013 105.663 115.665 106.406 116.169C107.149 116.673 107.989 117.018 108.872 117.181C109.755 117.345 110.662 117.324 111.536 117.119C112.41 116.914 113.233 116.531 113.951 115.993C127.406 107.738 136.5 93.6976 136.5 77.6036C136.5 61.6071 127.485 47.4891 114.153 39.2146C113.064 38.5188 111.792 38.1635 110.5 38.1941C110.296 38.1845 110.093 38.1845 109.889 38.1941Z"
              fill="black"
            />
          </svg>
`;
    elt.parentElement.dataset.played = "true";
  }
});
