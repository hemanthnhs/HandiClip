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
    let btnIds = [];
    let delBtnIds = [];
    for (const [key, value] of Object.entries(clips)) {
      let id = key.replace(/\s/g, "-").toLowerCase();
      let newInnerHTML =
        "<div class='card'><div class='card-header row'><div class='col-8'>" +
        key +
        "</div>" +
        "<div class='col-2'><button id='" +
        "btn-" +
        id +
        "' class='btn btn-outline-success btn-sm copy-btn float-end'>Copy</button></div>" +
        "<div class='col-2'><button id='" +
        "del-btn-" +
        id +
        "' class='btn btn-outline-danger btn-sm copy-btn float-end'>Delete</button></div></div>" +
        "<textarea type='text' id='" +
        "text-" +
        id +
        "' class='card-body form-control card-text' readonly>" +
        value +
        "</textarea></div>";
      btnIds.push("btn-" + id);
      delBtnIds.push("del-btn-" + id);
      newClips = newClips + newInnerHTML;
    }
    clipsTable.innerHTML = newClips;
    btnIds.forEach((btnId) => {
      document.getElementById(btnId).addEventListener("click", copyToClipboard);
    });
    delBtnIds.forEach((btnId) => {
      document
        .getElementById(btnId)
        .addEventListener("click", deleteFromClipboard);
    });
  }

  function addClip(name, text) {
    clips[name] = text;
    chrome.storage.sync.set({ clips }, function () {
      renderClips();
    });
  }

  function copyToClipboard(ev) {
    let btnId = ev.target.id;
    let id = btnId.split("btn-")[1];
    let textId = "text-" + id;
    document.getElementById(textId).select();
    document.execCommand("copy");
  }

  function deleteFromClipboard(ev) {
    let btnId = ev.target.id;
    let id = btnId.split("del-btn-")[1];
    delete clips[id];
    chrome.storage.sync.set({ clips }, function () {
      renderClips();
    });
  }

  document.getElementById("add-new-btn").addEventListener("click", function () {
    addSection.style.display = "block";
    clipSection.style.display = "none";
  });

  document.getElementById("submit-btn").addEventListener("click", function () {
    let cNameDom = document.getElementById("cname");
    let cTextDom = document.getElementById("ctext");
    let name = cNameDom.value;
    let text = cTextDom.value;
    addClip(name, text);
    addSection.style.display = "none";
    clipSection.style.display = "block";
  });

  document.getElementById("cancel-btn").addEventListener("click", function () {
    addSection.style.display = "none";
    clipSection.style.display = "block";
  });
});
