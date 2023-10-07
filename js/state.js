import { gsap } from "gsap";
import Initilize from "./uicontroller/uiMain";

var WebState = {
  model: null,
  scene: null,
  tracker: [],
  modelName: "",
  started: false,
  static: true,
  ended: true,
  ui_music: new Audio("../../assets/sounds/ui_sounds/background_sound.mp3"),
};
window.WebState = WebState;

export function initWebState(scene) {
  WebState.scene = scene;
  stopVideoNoAnimation();
  WebState.ui_music.loop = true;
  WebState.ui_music.play();
}
export function removeTracker() {
  WebState.tracker.forEach((track) => {
    WebState.scene.remove(track);
  });
}

export function deleteModel() {
  if (WebState.model) {
    WebState.scene.remove(WebState.model);
  }
  removeTracker();
  WebState.model = null;
  WebState.modelName = "";
}

export function deleteUI() {
  WebState?.ui_music.pause();
  let boxes = document.querySelectorAll(".uiBox");
  boxes.forEach((elt) => {
    elt.innerHTML = "";
  });
  document.querySelector(".sound-box").classList.remove("show-sound-box");
  document
    .querySelector(".location-info-box")
    .classList.remove("show-location-info-box");
  document.querySelector(".location-info-text-box").textContent = "";
  document.querySelector(".info-box").classList.remove("show-info-box");
}

export function changeModel(model, name) {
  removeTracker();
  const tl = gsap.timeline();
  const unchangedModel = WebState.model;
  const newModel = model;
  let scale = 0.0001;
  newModel.scale.set(scale, scale, scale);

  let secondTimelinePlayed = false;
  if (unchangedModel) {
    deleteUI();
    tl.fromTo(
      unchangedModel.scale,
      {
        x: unchangedModel.scale.x,
        y: unchangedModel.scale.y,
        z: unchangedModel.scale.z,
      },
      {
        duration: 2,
        x: scale,
        y: scale,
        z: scale,
        onUpdate: () => {
          let p = tl.progress();
          console.log(p);
          if (p > 0.2) {
            playVideo();
          }
        },
      }
    ).call(() => {
      playVideo();
      deleteModel();
      // deleteUI();
    });
  } else {
    playVideo();
  }

  tl.fromTo(
    newModel.scale,
    {
      x: newModel.scale.x,
      y: newModel.scale.y,
      z: newModel.scale.z,
    },
    {
      duration: 2,
      x: 0.005,
      y: 0.005,
      z: 0.005,
      onUpdate: () => {
        let p = tl.progress();
        if (p > 0.5) {
          stopVideo();
        }
      },
      onComplete: () => {
        stopVideo();
        WebState.model = model;
        WebState.modelName = name;
        Initilize();
      },
    }
  );

  tl.play().then(() => {
    WebState.ui_music.play();
  });
}

export function addTracker(track) {
  WebState.tracker.push(track);
}

function playVideo() {
  let wrapVideo = document.querySelector(".wrapVideo");
  wrapVideo.play();
  gsap.to(wrapVideo, { css: { opacity: 1 }, duration: 0.5 });
}

function stopVideo() {
  let wrapVideo = document.querySelector(".wrapVideo");
  gsap.to(wrapVideo, { css: { opacity: 0 }, duration: 0.5 });
  wrapVideo.pause();
}
function stopVideoNoAnimation() {
  let wrapVideo = document.querySelector(".wrapVideo");
  wrapVideo.style.opacity = "0";
}

export default WebState;
