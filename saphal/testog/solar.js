try {
  {
    var text = document.getElementById("planetName");
    var qnText = document.getElementById("qn");
    function planetIn(element) {
      if (document.documentElement.scrollWidth < 5000) {
        console.log("in");
        var name = element.id.toUpperCase();
        console.log(name);
        text.innerHTML = name;
      }
    }

    function planetOut(element) {
      if (document.documentElement.scrollWidth < 5000) {
        console.log("out");
        text.innerHTML = " ";
      }
    }
  }
  setInterval(
    (test = () => {
      if (document.documentElement.scrollWidth > 5000) {
        qnText.innerHTML = "";
      } else {
        qnText.innerHTML = "Where do you want to start your journey from?";
      }
    }),
    100
  );
} catch (error) {
  console.log("error");
}

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

var xValue = (planetName) => {
  var r = parseInt(planetName.getBoundingClientRect().left) - h;
  return x;
};
var rValue = (planetName) => {
  var r = parseInt(planetName.getBoundingClientRect().left) - h;
  return r;
};
if (document.documentElement.scrollWidth > 5000) {
  var x = parseInt(xValue(jup))
  var r = parseInt(rValue(jup))
}

const planetLoop = () => {
  let dum1 = Math.pow(x - h, 2);
  let dum2 = Math.pow(r, 2);
  let dum3 = Math.sqrt(dum2 - dum1);

  var y = dum3 + k;
  // planetName.style.left = x + "px";
  // planetName.style.top = y + "px";
  // // console.log('hi')
  // console.log(x);
  x = x - 1;
  if (x == h - r) {
    clearInterval(planet(jup));
  }
  console.log(x, y);
};

const jupiter = () => {
  planetLoop(x);
};
if (document.documentElement.scrollWidth > 5000) {
  console.log("hi");
  setInterval(jupiter, 1000);
}
