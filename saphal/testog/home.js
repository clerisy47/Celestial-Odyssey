const btn=document.getElementsByClassName("btn")
console.log(btn)

window.addEventListener("DOMContentLoaded", (event) => {
  const btn = document.getElementById('btn');
  if (btn) {
    btn.addEventListener('click', start, false);
  }
});

const start=()=>{
  window.open("solar.html","_self")
}
