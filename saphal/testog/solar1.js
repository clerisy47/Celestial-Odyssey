const sun = document.getElementById("sun");
const mer = document.getElementById("mercury");
const ven = document.getElementById("venus");
const ear = document.getElementById("earth");
const mar = document.getElementById("mars");
const jup = document.getElementById("jupiter");
const satn = document.getElementById("saturn");
const urns = document.getElementById("uranus");
const nep = document.getElementById("neptune");

const sunLeft = parseInt(sun.getBoundingClientRect().left);
const sunWidth = parseInt(sun.offsetWidth);
const sunTop = parseInt(sun.getBoundingClientRect().top);
const sunHeight = parseInt(sun.offsetHeight);
var h = parseInt(sunLeft + sunWidth / 2);
var k = parseInt(sunTop + sunHeight / 2);
// console.log(x,y)

var planet = (planetName) => {
  var r = parseInt(planetName.getBoundingClientRect().left) - h;
  let x = parseInt(planetName.getBoundingClientRect().left);
  return x
}
if (document.documentElement.scrollWidth > 5000) {
  x=planet(jup);
} 

const planetLoop=()=>{
  let dum1 = Math.pow(x - h, 2);
  let dum2 = Math.pow(r, 2);
  let dum3 = Math.sqrt(dum2 - dum1);
  
  var y = dum3 + k;
  // planetName.style.left = x + "px";
  // planetName.style.top = y + "px";
  // // console.log('hi')
  // console.log(x);
  x=x-1
  if (x == h - r) {
    clearInterval(planet(jup));
  }
  console.log(x,y)
}

const jupiter=()=>{
  planetLoop(x)
}
if (document.documentElement.scrollWidth > 5000) {
  console.log("hi");
  setInterval(jupiter,1000)
}


