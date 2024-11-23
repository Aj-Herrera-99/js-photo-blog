const hoverOn = "hover-on";
// media query list on toggling all hover effects
const toggleHover = window.matchMedia("(max-width: 1200px)");
// run mediaQueryList listener function in run time
handleMediaChange(toggleHover);
// media query list change event
toggleHover.addEventListener("change", function () {
    handleMediaChange(this);
});

function handleMediaChange(x) {
    // se max_width < 992px entra nel primo ramo => togli la classe
    // hoverOn a cui sono attaccati tutti gli hover della pagina
    // senno riaggiungi la classe al body
    console.log(x);
    x.matches
        ? document.body.classList.remove(hoverOn)
        : document.body.classList.add(hoverOn);
}
