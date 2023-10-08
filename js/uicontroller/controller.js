import { generateCUUID, textToVoice } from "../utils";
import { enableHidePlanetsTippy, toggleSoundBoxTippy } from "../toolTips";
import { gsap } from "gsap";
import WebState from "../state";
import { ModelData } from "../modelData";
import { createTypingEffect } from "../utils";

export function ImageBox(text, img, name) {
  let imgId = generateCUUID();
  return `
    <div class="ui1 ui-model" data-name="${name}">
    <svg width="286" height="179" viewBox="0 0 286 179" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
  <pattern id="${imgId}" patternUnits="userSpaceOnUse" width="100%" height="100%">
    <image href="./assets/Location images/${img}" x="0" y="0" height="100%" width="100%" preserveAspectRatio="none" />
  </pattern>
</defs>
      <g id="uimodel1 1" clip-path="url(#clip0_24_9)">
      <path fill="url(#${imgId})" id="image" fill-rule="evenodd" clip-rule="evenodd" d="M256.499 0H74.9906L50.6391 23.3652C50.0804 23.9012 49.3362 24.2005 48.562 24.2005H9.45827L0 32.1282V167.734L9.45827 179H134.893L182.083 145.75C182.588 145.394 183.192 145.203 183.811 145.203H286V24.2005L256.499 0Z" >
      </path>
      <path id="text" d="M283 179C284.657 179 286 177.657 286 176V149.727H183.843C183.204 149.727 182.582 149.931 182.067 150.309L143 179H283Z" fill="#0072ffb3">
      </path>
      <path id="Vector_2" d="M283 179C284.657 179 286 177.657 286 176V149.727H183.843C183.204 149.727 182.582 149.931 182.067 150.309L143 179H283Z" fill="#7D6262" fill-opacity="0.48"/>
      <path id="Vector_3" d="M283 178H146.051L182.659 151.115C183.003 150.863 183.417 150.727 183.843 150.727H285V176C285 177.105 284.105 178 283 178ZM181.507 144.933L134.576 178H9.92441L1 167.37V32.5948L9.82193 25.2005H48.562C49.5943 25.2005 50.5866 24.8014 51.3314 24.0867L75.3927 1H256.142L285 24.6736V144.203H183.811C182.986 144.203 182.181 144.458 181.507 144.933Z" stroke="#81FFE8" stroke-opacity="0.87" stroke-width="2"/>
      </g>
      </svg>   
      <p>${text}</p>
  </div>
    `;
}
let i = 0;
export function appendUIModel(code, type) {
  let uiElt = document.querySelector(`.${type}`);
  uiElt.innerHTML += code;
}

export function addUI(type, obj) {
  if (type == "image-box") {
    appendUIModel(ImageBox(obj.sub_name, obj.img, obj.name), type);
  }
}

export function addDataBox(heading, data) {
  let newData = data;
  if (heading == "satellite") {
    newData = data.slice(1, data.length);
  }
  let mainPoint = newData
    .map((d) => {
      return d + "</br>";
    })
    .join(" ");
  let template = `
            <div class="dataUi data1 ${heading}">
            <h3>${
              heading == "satellite" ? heading + ":  " + data[0] : heading
            }</h3>
            <p>
              ${mainPoint}
            </p>
          </div>`;

  let data_box = document.querySelector(".data-box");
  data_box.innerHTML += template;
}

var planet_sound;
var isPlaying = false;
const sound_box = document.querySelector(".sound-box");

export function toggleSound(planet_name) {
  if (!planet_name || isPlaying) {
    if (WebState.isMusicOn) WebState.ui_music.play();
    stopSound();
    return;
  }
  toggleSoundBoxTippy("pause");
  planet_sound = new Audio(
    `../../assets/sounds/planet_sounds/${planet_name}_sound.mp3`
  );
  WebState?.ui_music.pause();
  planet_sound.play();
  isPlaying = true;
  sound_box.querySelector("#cross").style.opacity = "0";
}

export function stopSound() {
  toggleSoundBoxTippy("play");
  planet_sound?.pause();
  if (WebState.isMusicOn) WebState.ui_music.play();
  isPlaying = false;
  sound_box.querySelector("#cross").style.opacity = "1";
}

var isBoxVisible = false;

export function showPlanetBox() {
  document
    .querySelector(".planet-text-box")
    .classList.add("hide-planet-text-box");
  document.querySelector(".planet-box").classList.add("show-planet-box");
  document.querySelector(".vec1").classList.add("vec1-expand");
  document.querySelector(".vec2").classList.add("vec2-expand");
  gsap.from(".vec1", { duration: 0.5, x: "21rem" });
  gsap.from(".vec2", { duration: 0.5, x: "-20.7rem" });
  gsap.from(".planet-box", {
    duration: 0.4,
    y: "-130%",
    delay: 0.2,
  });
  isBoxVisible = true;
  enableHidePlanetsTippy(true);
}

var click_sound = new Audio("./assets/sounds/ui_sounds/click_sound.mp3");

export function hidePlanetBox() {
  if (!isBoxVisible) return;
  click_sound.play();
  document
    .querySelector(".planet-text-box")
    .classList.remove("hide-planet-text-box");
  document.querySelector(".planet-box").classList.remove("show-planet-box");
  document.querySelector(".vec1").classList.remove("vec1-expand");
  document.querySelector(".vec2").classList.remove("vec2-expand");
  gsap.from(".vec1", { duration: 0.6, x: "-21rem" });
  gsap.from(".vec2", { duration: 0.6, x: "20.7rem" });
  gsap.from(".planet-text-box", {
    duration: 0.8,
    opacity: 0,
  });
  isBoxVisible = false;
  enableHidePlanetsTippy(false);
}

var isInfoOpen = false;

export async function showInfo() {
  if (!WebState.model) return;
  gsap.to(".info-box", { duration: 0.6, opacity: 0 });
  document.querySelector(".info-text-box").classList.add("show-info-text-box");
  await gsap.from(".info-text-box", {
    duration: 0.8,
    width: "0",
  });
  let element = document.querySelector(".info-text");
  let text = ModelData[WebState.modelName].ui.info;
  createTypingEffect(element, text);
  textToVoice(text);
  gsap.from(".info-text", { duration: 0.5, opacity: 0 });
  isInfoOpen = true;
}
export async function closeInfo() {
  if (!isInfoOpen) return;
  gsap.to(".info-box", { duration: 0.6, opacity: 1 });
  document.querySelector(".info-text").textContent = "";
  await gsap.to(".info-text-box", {
    duration: 0.8,
    width: "0",
  });
  document
    .querySelector(".info-text-box")
    .classList.remove("show-info-text-box");
  document.querySelector(".info-text-box").style.width = "43vw";
}

var isInputBoxExpanded = false;

var hover_sound = new Audio("../../assets/sounds/ui_sounds/hover_sound.mp3");

export function toggleInpuBox() {
  hover_sound.play();
  if (isInputBoxExpanded) hideInputBox();
  else showInputBox();
}

export function showInputBox() {
  document.querySelector(".input-box").classList.add("show-input-box");
  document.querySelector(".chatbot").classList.add("expand-chatbot");
  document.querySelector(".askAI").style.display = "none";
  gsap.fromTo(
    ".chatbot",
    { width: "130px", left: "65%" },
    { width: "752px", left: "25%", duration: 0.8 }
  );
  document.querySelector(".close-ai-btn").classList.add("show-close-ai-btn");
  gsap.from(".close-ai-btn", { duration: 0.4, opacity: 0, delay: 0.7 });
  gsap.from(".input-box", { duration: 0.8, opacity: 0, delay: 0.5 });
  isInputBoxExpanded = true;
}

export function hideInputBox() {
  document.querySelector(".chatbot").classList.remove("expand-chatbot");
  document.querySelector(".close-ai-btn").classList.remove("show-close-ai-btn");
  document.querySelector(".askAI").style.display = "inline";
  gsap.from(".askAI", { opacity: 0, duration: 0.5, delay: 0.6 });
  gsap.fromTo(
    ".chatbot",
    { width: "752px", left: "25%" },
    { width: "130px", left: "65%", duration: 0.8 }
  );
  isInputBoxExpanded = false;
  document.querySelector(".input-box").classList.remove("show-input-box");
  document.querySelector(".input-box").style.opacity = 1;
}
