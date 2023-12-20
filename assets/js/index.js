var movable_images = document.querySelectorAll(".movable-image");
var language_icons = document.querySelectorAll(".language_icon");
var popUpOpened = false;
var language = "hu";

startAnimation();

document.getElementById("hu_flag").style.filter =
  "drop-shadow(0 0 7px #1a9686)";

document.getElementById("background-div").style.backgroundImage =
  "url(./images/Marosszentgyorgy_hatter_HU_low.jpg)";

document.addEventListener(
  "touchmove",
  function (event) {
    if (event.scale !== 1) {
      event.preventDefault();
    }
  },
  { passive: false }
);

setTimeout(function () {
  document.getElementById("loading-screen").style.display = "none";
}, 3000);

document.addEventListener("click", function (event) {
  if (popUpOpened) {
    closePopUp();
  }
});

document
  .getElementById("hidden-reload")
  .addEventListener("click", function (event) {
    location.reload();
  });

movable_images.forEach((image, index) => {
  image.addEventListener(
    "onmouseover",
    function (event) {
      event.preventDefault();
    },
    { passive: false }
  );

  image.addEventListener("click", (event) => {
    if (!popUpOpened) {
      let movable_images_array = Array.from(movable_images);

      movable_images_array
        .filter((item) => item !== event.target)
        .forEach((image, index) => {
          image.style.opacity = "0.4";
        });

      document.getElementById("background-div").style.opacity = "0.4";

      // console.log(`text/${event.target.id}/${language}.txt`);

      fetch(`text/${event.target.id}/${language}.txt`)
        .then((response) => {
          if (!response.ok) {
            return false;
          }
          return response.text();
        })
        .then((data) => {
          if (!data) {
            data = "Error\nNot found";
          }

          generatePopUp(
            event.target,
            data,
            event.target.getAttribute("data-align")
          );
          popUpOpened = true;
          handleImageMoving();
        });

      event.stopPropagation();
    }
  });
});

language_icons.forEach((item, index) => {
  item.addEventListener("click", function (event) {
    language = event.target.getAttribute("data-lang");

    if (language == "hu") {
      document.getElementById("background-div").style.backgroundImage =
        "url(./images/Marosszentgyorgy_hatter_HU_low.jpg)";
    }
    if (language == "ro") {
      document.getElementById("background-div").style.backgroundImage =
        "url(./images/Marosszentgyorgy_hatter_RO_low.jpg)";
    }
    if (language == "uk") {
      document.getElementById("background-div").style.backgroundImage =
        "url(./images/Marosszentgyorgy_hatter_EN.jpg)";
    }

    handleFilter(event.target);
  });
});

function generatePopUp(target, text, direction) {
  title = text.substring(0, text.indexOf("\n"));
  description = text.substring(text.indexOf("\n")).replace(/^\s+/, "");

  const mainContainer = document.createElement("div");
  mainContainer.className = "popup popup-body";
  mainContainer.setAttribute("role", "tooltip");
  mainContainer.setAttribute("id", "popup");

  // Create the arrow div with class "arrow" and inline style for top position
  const arrowDiv = document.createElement("div");
  arrowDiv.className = "arrow";

  switch (direction) {
    case "left":
      arrowDiv.style.right = "calc((0.5rem + 1px) * -1)";
      arrowDiv.style.top = "calc(50% - 1rem)";
      break;
    case "right":
      arrowDiv.style.left = "calc((0.5rem + 1px) * -1)";
      arrowDiv.style.top = "calc(50% - 1rem)";
      arrowDiv.style.rotate = "180deg";
      break;
    case "top-right":
      arrowDiv.style.bottom = "calc((1rem + 1px) * -1)";
      arrowDiv.style.rotate = "90deg";
      break;
  }

  // Create the h3 element with class "popover-header"
  const header = document.createElement("h3");
  header.className = "popover-header";

  // Create the span element with class "text-info"
  const span = document.createElement("span");
  span.className = "text-info";

  // Create the strong element with class "title" for the castle title
  const strong = document.createElement("strong");
  strong.className = "title";
  strong.textContent = title;

  // Create the img element with class "closepop" for the close button
  const closeButton = document.createElement("img");
  closeButton.className = "closepop";
  closeButton.setAttribute("src", "images/close.png");

  closeButton.addEventListener("click", function () {
    document.getElementById("popup").remove();
    document.getElementById("background-div").style.opacity = "1";
    popUpOpened = false;
    handleImageMoving();
  });

  // Create the div for the popover body
  const popoverBody = document.createElement("div");
  popoverBody.className = "popover-body";

  // Create the span element for the text content
  const contentSpan = document.createElement("span");
  contentSpan.textContent = description;

  // Append elements to create the structure
  span.appendChild(strong);
  span.appendChild(closeButton);
  header.appendChild(span);
  mainContainer.appendChild(arrowDiv);
  popoverBody.appendChild(contentSpan);
  mainContainer.appendChild(header);
  mainContainer.appendChild(popoverBody);

  // Append the main container to the document body
  document.body.appendChild(mainContainer);

  position = target.getBoundingClientRect();
  positionOfPopUp = mainContainer.getBoundingClientRect();
  positionOfHeader = header.getBoundingClientRect();

  switch (direction) {
    case "left":
      mainContainer.style.top =
        position.bottom -
        position.height / 2 -
        positionOfPopUp.height / 2 +
        positionOfHeader.height +
        "px";
      mainContainer.style.left = `calc(${position.left}px - (${positionOfPopUp.width}px + 1rem))`;
      break;

    case "right":
      mainContainer.style.top =
        position.bottom -
        position.height / 2 -
        positionOfPopUp.height / 2 +
        positionOfHeader.height +
        "px";
      mainContainer.style.left = `calc((${position.left}px + ${position.width}px) + 1rem)`;
      break;

    case "top-right":
      mainContainer.style.top = `calc((${position.bottom}px - ${position.height}px) - ${positionOfPopUp.height}px - 1rem)`;
      mainContainer.style.left = position.left + position.width / 2 - 30 + "px";
      break;
  }
}

function handleImageMoving() {
  movable_images.forEach((image, index) => {
    if (!popUpOpened) {
      image.style.animationPlayState = `running`;
      image.style.opacity = "1";
    } else {
      image.style.animationPlayState = `paused`;
    }
  });
}

function handleFilter(target) {
  language_icons.forEach((item, index) => {
    if (target === item) {
      item.style.webkitFilter = "drop-shadow(0 0 7px #1a9686)";
    } else {
      item.style.webkitFilter = "";
    }
  });
}

function startAnimation() {
  movable_images.forEach((image, index) => {
    const delay = (index % 3) * 1000; // Adjust the delay based on your preference

    setTimeout(() => {
      image.style.animation = `pulse 2s infinite alternate`;
    }, delay);
  });
}

function closePopUp() {
  document.getElementById("popup").remove();
  document.getElementById("background-div").style.opacity = "1";
  popUpOpened = false;
  handleImageMoving();
}
