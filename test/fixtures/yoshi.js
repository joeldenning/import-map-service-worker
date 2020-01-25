import DonkeyKong from "./donkey-kong.js";
import Luigi from "//importmap/luigi";

console.log("Yoshi - ", "a sentient dinosaur");
console.log("DonkeyKong - ", DonkeyKong);
console.log("Luigi - ", Luigi);

document.body.appendChild(
  Object.assign(document.createElement("p"), {
    textContent: "It worked!"
  })
);
