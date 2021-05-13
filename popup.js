let clips2 = {};
let that = this;

window.addEventListener("load", () => {
  let addSection = document.getElementById("add-section");
  let clipSection = document.getElementById("clip-section");
  let clipsTable = document.getElementById("clipsTable");

  // Hiding add section/page by default
  addSection.style.display = "none";

  // Getting saved clips from storage
  chrome.storage.sync.get("clips", ({ clips }) => {
    that.clips = clips;
    renderClips();
  });

  // Render clips to screen

  function renderClips() {
    clipsTable.innerHTML = "Hola";
    let newClips = "";
    for (const [key, value] of Object.entries(clips)) {
      let newInnerHTML =
        "<div class='card'><div class='card-header row'><div class='col-8'>" +
        key +
        "</div>" +
        "<div class='col-2'><button class='btn btn-outline-success btn-sm copy-btn float-end'>Copy</button></div>" +
        "<div class='col-2'><button class='btn btn-outline-danger btn-sm copy-btn float-end'>Delete</button></div></div>" +
        "<div class='card-body'> <p class='card-text'>" +
        value +
        "</p> </div> </div>";
      newClips = newClips + newInnerHTML;
    }
    clipsTable.innerHTML = newClips;
  }

  function addClip(name, text) {
    clips[name] = text;
    chrome.storage.sync.set({ clips }, function () {
      renderClips();
    });
  }

  document.getElementById("submit-btn").addEventListener("click", function () {
    let cNameDom = document.getElementById("cname");
    let cTextDom = document.getElementById("ctext");
    let name = cNameDom.value;
    let text = cTextDom.value;
    addClip(name, text);
  });
});
