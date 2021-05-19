let that = this;

window.addEventListener("load", () => {
  let addSection = document.getElementById("add-section");
  let clipSection = document.getElementById("clip-section");
  let clipsTable = document.getElementById("clipsTable");
  let cNameDom = document.getElementById("cname");
  let cTextDom = document.getElementById("ctext");

  // Hiding add section/page by default
  addSection.style.display = "none";

  // Getting saved clips from storage
  chrome.storage.sync.get("clips", ({ clips }) => {
    that.clips = clips;
    renderClips();
  });

  // Render clips to screen

  function renderClips() {
    if (Object.keys(clips).length == 0) {
      clipsTable.innerHTML =
        "<div class='no-results'>No clips found...add to seamlessly paste reponses !!</div>";
      return;
    }
    clipsTable.innerHTML = "Loading...";
    let newClips = "";
    let btnIds = [];
    let delBtnIds = [];
    let editBtnIds = [];
    for (const [key, value] of Object.entries(clips)) {
      let id = key.replace(/\s/g, "-").toLowerCase();
      let newInnerHTML =
        "<div class='card'>" +
        "<div class='card-header row'>" +
        "<div class='col-10'>" +
        "<button class='card-header-btn' id='" +
        "btn-" +
        id +
        "'>" +
        "<i class='bi bi-files'></i>&nbsp;&nbsp;" +
        key +
        "</button>" +
        "</div>" +
        "<div class='col-1'>" +
        "<button class='edit-btn bi bi-pencil' id='" +
        "edit-btn-" +
        id +
        "'></button></div>" +
        "<div class='col-1'><button class='delete-btn bi bi-trash' id='" +
        "del-btn-" +
        id +
        "'></button>" +
        "</div>" +
        "</div>" +
        "<textarea type='text' id='" +
        "text-" +
        id +
        "' class='card-body form-control card-text' readonly>" +
        value +
        "</textarea>" +
        "</div>";
      btnIds.push("btn-" + id);
      delBtnIds.push("del-btn-" + id);
      editBtnIds.push("edit-btn-" + id);
      newClips = newClips + newInnerHTML;
    }
    clipsTable.innerHTML = newClips;
    btnIds.forEach((btnId) => {
      document.getElementById(btnId).addEventListener("click", copyToClipboard);
      $("#" + btnId).tooltip({
        trigger: "manual",
        title: "Copied to clipboard",
        placement: "top",
      });
    });
    delBtnIds.forEach((btnId) => {
      document
        .getElementById(btnId)
        .addEventListener("click", deleteFromClipboard);
    });
    editBtnIds.forEach((btnId) => {
      document.getElementById(btnId).addEventListener("click", editClip);
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
    $("#" + btnId).tooltip("show");
    setTimeout(function () {
      $("#" + btnId).tooltip("hide");
    }, 1200);
  }

  function deleteFromClipboard(ev) {
    let btnId = ev.target.id;
    let id = btnId.split("del-btn-")[1];
    delete clips[id];
    chrome.storage.sync.set({ clips }, function () {
      renderClips();
    });
  }

  function editClip(ev) {
    let btnId = ev.target.id;
    let id = btnId.split("edit-btn-")[1];
    text = clips[id];
    cNameDom.value = id;
    cTextDom.value = text;
    cNameDom.disabled = true;
    showAddNewPage();
  }

  // To show Add Page
  function showAddNewPage() {
    addSection.style.display = "block";
    clipSection.style.display = "none";
  }

  // To hide Add Page
  function hideAddNewPage() {
    resetAddPage();
    addSection.style.display = "none";
    clipSection.style.display = "block";
  }

  function resetAddPage() {
    cNameDom.value = "";
    cTextDom.value = "";
    cNameDom.disabled = false;
    cTextDom.disabled = false;
  }

  document.getElementById("add-new-btn").addEventListener("click", function () {
    showAddNewPage();
  });

  document.getElementById("submit-btn").addEventListener("click", function () {
    let name = cNameDom.value;
    let text = cTextDom.value;
    addClip(name, text);
    hideAddNewPage();
  });

  document.getElementById("cancel-btn").addEventListener("click", function () {
    hideAddNewPage();
  });
});
