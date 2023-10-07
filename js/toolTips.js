//Gives a tooltip showing names of planets when hovered over

import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
const addToolTip = () => {
  const planets = [
    "Mercury",
    "Venus",
    "Earth",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
  ];
  planets.forEach((p) => {
    tippy("." + p.toLowerCase(), {
      content: p,
      animation: "scale",
      theme: "tomato",
      arrow: false,
    });
  });
  tippy(".sound-box", {
    content: "play",
    animation: "scale",
    theme: "tomato",
    placement: "bottom",
  });
  tippy(".planet-text-box", {
    content: "show planets",
    animation: "scale",
    theme: "tomato",
    placement: "bottom",
    arrow: false,
  });
  tippy(".info-box", {
    content: "show info",
    animation: "scale",
    theme: "tomato",
    placement: "bottom",
    arrow: false,
  });
  tippy(".bot-img", {
    content: "Ask Me",
    animation: "scale",
    theme: "tomato",
    placement: "top",
    arrow: false,
  });
};

function toggleSoundBoxTippy(content) {
  tippy(document.querySelector(".sound-box")).destroy();
  tippy(".sound-box", {
    content: content,
    animation: "scale",
    theme: "tomato",
    placement: "bottom",
  });
}

function enableHidePlanetsTippy(enable) {
  if (!enable) {
    tippy(document.querySelector(".vec1")).destroy();
    tippy(document.querySelector(".vec2")).destroy();
    return;
  }
  tippy(".vec1", {
    content: "hide planets",
    animation: "scale",
    theme: "tomato",
    placement: "bottom",
    arrow: false,
  });
  tippy(".vec2", {
    content: "hide planets",
    animation: "scale",
    theme: "tomato",
    placement: "bottom",
    arrow: false,
  });
}

export { toggleSoundBoxTippy, enableHidePlanetsTippy };
export default addToolTip;
