import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import * as THREE from "three";
import { Text } from "troika-three-text";
import { ModelData } from "./modelData";
import WebState, { addTracker, changeModel, removeTracker } from "./state";
import { closeInfo, toggleSound } from "./uicontroller/controller";
import { gsap } from "gsap";
import { camera } from "../main";

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
loader.setDRACOLoader(dracoLoader);

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

function latLonToCart(userLat, userLng, r) {
  removeTracker();
  const lat = userLat * (Math.PI / 180);
  const lng = userLng * (Math.PI / 180);

  const z = r * Math.cos(lat) * Math.cos(lng);
  const x = r * Math.cos(lat) * Math.sin(lng);
  const y = r * Math.sin(lat);
  return [x, y, z];
}

function plotPointOnEarth(radius, lat, lon, scene, pointScale) {
  let [x, y, z] = latLonToCart(lat, lon, radius);
  animateRotate(lat, lon, 1, WebState.model);

  const sphereGeometry = new THREE.SphereGeometry(pointScale);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x049ef4,
    depthTest: true,
  });
  const point = new THREE.Mesh(sphereGeometry, sphereMaterial);
  point.position.set(x, y, z);

  const torusGeometry = new THREE.TorusGeometry(0.1, 0.01, 16, 100);
  const torusMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color("hsl(173, 63%, 56%)"),
    transparent: true,
    opacity: 1,
  });

  const torus = new THREE.Mesh(torusGeometry, torusMaterial);
  torus.position.set(x, y, z);
  let tLoc = torus.position.clone().normalize();
  let axis = new THREE.Vector3(0, 0, 1);
  let rAxis = axis.clone().cross(tLoc).normalize();
  let angleTorus = Math.acos(axis.dot(tLoc));
  torus.rotateOnAxis(rAxis, angleTorus);
  torus.scale.set(0, 0, 0);

  scene.add(torus);

  let torusTl = gsap.timeline();
  torusTl
    .to(torus.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 2,
      repeat: -1,
      ease: "linear",
    })
    .to(
      torus.material,
      {
        opacity: 0.5,
        duration: 2,
        repeat: -1,
      },
      "<"
    );
  torusTl.play();

  let d = 0.01;
  let h = 0.5;

  const box = new THREE.CylinderGeometry(d, d, h);
  let boxMat = new THREE.MeshLambertMaterial({
    color: 0x049ef4,
  });
  const boxMesh = new THREE.Mesh(box, boxMat);

  let direction = new THREE.Vector3(x, y, z).normalize();

  let rotationAxis = new THREE.Vector3(0, 1, 0).cross(direction).normalize();

  let angle = Math.acos(new THREE.Vector3(0, 1, 0).dot(direction));

  boxMesh.position.set(x, y, z);
  boxMesh.rotateOnAxis(rotationAxis, angle);

  // scene.add(boxMesh);
  // scene.add(point);

  let w = 0.1;

  const boxGeometry = new THREE.BoxGeometry(0.01, w * 2, w * 5);
  const boxMaterial = new THREE.MeshLambertMaterial({
    color: 0x049ef4,
  });
  // const boxMeshTop = new THREE.Mesh(boxGeometry, boxMaterial);

  // let boxPos = new THREE.Vector3(x, y, z);
  // let boxR = boxPos.length();
  // boxPos = boxPos.normalize();
  // boxPos = boxPos.multiplyScalar(h / 2 + boxR);
  // boxMeshTop.position.set(boxPos.x, boxPos.y, boxPos.z);

  // const myText = new Text();
  // myText.font = "./assets/fonts/Game Of Squids.otf";
  // myText.text = "Hello world!";
  // myText.fontSize = 0.01;
  // myText.color = 0x9966ff;
  // myText.rotateY(Math.PI / -2);

  // boxMeshTop.add(myText);
  // myText.sync();

  // scene.add(boxMeshTop);
  let group = new THREE.Group();
  group.add(boxMesh, point, torus);
  scene.add(group);
  addTracker(group);
}

function load3d(scene, model) {
  let obj = {};
  obj.scale = ModelData[model].scale;
  obj.r = ModelData[model].r;

  window.scene = scene;
  window.plotPointOnEarth = plotPointOnEarth;

  if (ModelData[model].type == "nasa") {
    loader.load(
      `./assets/3d/${model}.glb`,
      function (gltf) {
        const earthModel = gltf.scene;

        const textureLoader = new THREE.TextureLoader();

        if (obj && obj.scale) {
          earthModel.scale.set(obj.scale, obj.scale, obj.scale);
        }

        window.model = earthModel;
        earthModel.rotateY(Math.PI);
        scene.add(earthModel);
        changeModel(earthModel, model);

        earthModel.children[0].geometry.computeBoundingSphere();

        let r =
          earthModel.children[0].geometry.boundingSphere.radius * obj.scale;

        window.r = r;

        // ModelData[model].ui.location.forEach((location) => {
        //   plotPointOnEarth(r, location.lat, location.lon, scene, 0.02);
        // });

        // plotPointOnEarth(r, 24.300682, 2.594174, scene, 0.02);
      },
      function (xhr) {
        // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        console.log("An error happened");
      }
    );
  } else {
    let sphere = new THREE.SphereGeometry(obj.r, 60, 60);
    const mat = new THREE.MeshStandardMaterial({
      roughness: 1,
      metalness: 0,
      map: new THREE.TextureLoader().load(`/assets/texture/${model}.jpg`),
    });
    window.r = obj.r;

    mat.map.colorSpace = THREE.SRGBColorSpace;

    mat.map.wrapS = THREE.RepeatWrapping;
    mat.map.offset.x = 1.5708 / (2 * Math.PI);

    let mesh = new THREE.Mesh(sphere, mat);
    // plotPointOnEarth(obj.r, 30, 138, scene, 0.02);

    scene.add(mesh);
    changeModel(mesh, model);
  }
  toggleSound();
  closeInfo();
}

function animateRotate(lat, long, duration, model) {
  const [x, y, z] = latLonToCart(lat, long, r);
  let loc = new THREE.Vector3(x, y, z);
  camera.updateProjectionMatrix();

  let CamLoc = camera.position;
  let lengthR = CamLoc.length();
  loc = loc.normalize().multiplyScalar(lengthR);

  let timeline = gsap.timeline();

  timeline.to(camera.position, {
    x: loc.x,
    y: loc.y,
    z: loc.z,
    duration: duration,
    onUpdate: function () {
      camera.lookAt(0, 0, 0);
    },
  });

  timeline.play();
}

window.anima = animateRotate;

export default load3d;
