try {
  {
    var text = document.getElementById("planetName");
    var qnText = document.getElementById("qn");
    function planetIn(element) {
      console.log("in");
      var name = element.id.toUpperCase();
      console.log(name);
      text.innerHTML = name;
    }

    function planetOut(element) {
      console.log("out");
      text.innerHTML = " ";
    }
  }
  setInterval(
    (test = () => {
      if (document.documentElement.scrollWidth > 5000) {
        qnText.innerHTML = "";
      }
    }),
    100
  );
} catch (error) {
  console.log("error");
}
