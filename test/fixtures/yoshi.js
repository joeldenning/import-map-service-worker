console.log("Yoshi module is running");
document.body.appendChild(
  Object.assign(document.createElement("p"), {
    textContent: "Yoshi module executed!"
  })
);
