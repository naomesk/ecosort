const trashItems = document.querySelectorAll(".trash");
const bins = document.querySelectorAll(".bin");

const scoreDisplay = document.getElementById("score");
const message = document.getElementById("message");

let draggedItem = null;
let score = 0;

// Drag Start
trashItems.forEach(item => {
  item.addEventListener("dragstart", () => {
    draggedItem = item;
  });
});

// Allow Drop
bins.forEach(bin => {

  bin.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  // Drop Event
  bin.addEventListener("drop", () => {

    const trashType = draggedItem.dataset.type;
    const binType = bin.dataset.bin;

    if (trashType === binType) {

      score += 10;
      scoreDisplay.textContent = score;

      message.textContent = "✅ Correct!";
      message.style.color = "green";

      draggedItem.remove();

    } else {

      score -= 5;
      scoreDisplay.textContent = score;

      message.textContent = "❌ Wrong Bin!";
      message.style.color = "red";
    }

  });

});


bin.addEventListener("drop", () => {

  const trashType = draggedItem.dataset.type;
  const binType = bin.dataset.bin;

  if (trashType === binType) {

    // ADD POINTS
    score += 10;

    // UPDATE HTML
    scoreDisplay.textContent = score;

    draggedItem.remove();

  } else {

    // REMOVE POINTS
    score -= 5;

    // UPDATE HTML
    scoreDisplay.textContent = score;
  }

});