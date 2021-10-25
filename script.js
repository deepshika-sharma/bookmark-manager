const container = document.querySelector(".container");
const addBtn = document.getElementById("add");
const bookmarks = document.querySelector(".bookmarks-container");
const overlay = document.querySelector(".overlay");
const cancelForm = document.getElementById("cancel-form");
const saveBtn = document.getElementById("save");
const webName = document.getElementById("website-name");
const webUrl = document.getElementById("website-url");
const bookmarkForm = document.querySelector(".bookmark-form");

// Global Variables
let removeBookmark;
let bookmarkObj = {};

// Creating Bookmark Elements
const createBookmark = (name, url) => {
  // Bookmark
  let bookmark = document.createElement("div");
  bookmark.classList.add("bookmark");
  // Title
  let title = document.createElement("div");
  title.classList.add("title");
  // Close Icon
  let icon = document.createElement("i");
  icon.classList.add("fas", "fa-times", "remove");
  icon.setAttribute("title", "Delete Bookmark");
  // Info --> favicon + link
  let info = document.createElement("div");
  info.classList.add("info");
  // Favicon
  let favicon = document.createElement("img");
  favicon.setAttribute("src", `${url}/favicon.ico`);
  favicon.setAttribute("alt", "favicon");
  // Link
  let link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("target", "_blank");
  link.textContent = name;
  title.appendChild(icon);
  bookmark.appendChild(title);
  info.appendChild(favicon);
  info.appendChild(link);
  bookmark.appendChild(info);
  bookmarks.appendChild(bookmark);

  removeBookmark = document.querySelectorAll(".remove");
  // Adding event listener for every bookmark created
  for (let i = 0; i < removeBookmark.length; i++) {
    removeBookmark[i].addEventListener("click", () => {
      removeBookmark[i].parentElement.parentElement.remove();
      let key =
        removeBookmark[i].parentElement.parentElement.children[1].children[1]
          .textContent;
      delete bookmarkObj[key];

      // Deleting bookmark info from local storage
      localStorage.setItem("bookmarks", JSON.stringify(bookmarkObj));

      // Remove object from local storage if no bookmarks
      if (Object.keys(bookmarkObj).length === 0) {
        localStorage.removeItem("bookmarks");
      }
    });
  }
};

// Loading Bookmarks
const loadBookmarks = () => {
  if (localStorage.getItem("bookmarks")) {
    bookmarkObj = JSON.parse(localStorage.getItem("bookmarks"));
    if (Object.keys(bookmarkObj).length) {
      for (let key in bookmarkObj) {
        createBookmark(key, bookmarkObj[key]);
      }
    }
  }
};

// Add New Bookmark
addBtn.addEventListener("click", () => {
  container.style.position = "absolute";
  overlay.classList.add("show-overlay");
  webName.focus();
});

// Hiding Overlay
const removeOverlay = () => {
  container.style.position = "static";
  overlay.classList.remove("show-overlay");
};

// Cancel Form Event Listener
cancelForm.addEventListener("click", removeOverlay);

// Save Event Listener
bookmarkForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let name = webName.value;
  let url = webUrl.value;

  if (!url.includes("http://", "https://")) {
    url = `https://${url}`;
  }

  if (!validateForm(name, url)) {
    return false;
  } else if (Object.keys(bookmarkObj).includes(name)) {
    alert("Bookmark already exists!");
  } else {
    bookmarkObj[name] = url;
    createBookmark(name, url);
    // Local Storage
    localStorage.setItem("bookmarks", JSON.stringify(bookmarkObj));
    // resetting input
    webUrl.value = "";
    webName.value = "";
    container.style.position = "static";
    overlay.classList.remove("show-overlay");
  }
});

// Window event Listener
window.addEventListener("click", (e) => {
  if (e.target.classList.contains("overlay")) {
    removeOverlay();
  }
});

const validateForm = (name, url) => {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  let regex = new RegExp(expression);
  if (!name || !url) {
    alert("Please fill in appropriate inputs");
    return false;
  }
  if (!url.match(regex)) {
    alert("Please provide a valid URL");
    return false;
  }
  // Valid
  return true;
};

// OnLoad
loadBookmarks();
