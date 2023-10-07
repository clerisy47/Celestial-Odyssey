// import { p5 } from "p5js-wrapper";
// import WebState from "./state";

// export function sketchModel(p) {
//   let img = p.loadImage("./assets/planet_images/earth.png");
//   let video;
//   let scaleRate = 1;
//   let canvas;

//   p.setup = () => {
//     canvas = p.createCanvas(p.windowWidth, p.windowHeight);

//     canvas.parent("wrap-effect");
//     video = p.createVideo(["./assets/video/wrap.mov"]);
//     video.elt.muted = true;
//     video.size(p.width, p.height);
//     video.loop();
//     // video.hide();
//     video.addClass("wrapVideo");
//     p.imageMode(p.CENTER);
//   };

//   p.draw = () => {
//     // p.scale(1);
//     // //   p.background(255, 0, 0);
//     // p.translate(0, 0);
//     // // p.image(video, p.width / 2, p.height / 2);
//     // p.translate(p.width / 2, p.height / 2);
//     // p.scale(scaleRate);
//     // scaleRate += 0.01;
//     // p.image(img, 0, 0);
//     if (WebState.started) {
//       canvas.elt.display = "block";
//     } else {
//       canvas.elt.display = "none";
//     }
//     //   scaleRate += 0.05;
//   };
// }
// export function runSketch() {
//   new p5(sketchModel, "wrap-effect");
// }
