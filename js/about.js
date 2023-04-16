


// Get the modal and the overlay
var modal = document.getElementById("myModal");
var overlay = document.getElementById("modalOverlay");

// Function to show the modal and the overlay
function showModal() {
  modal.style.display = "block";
  overlay.style.display = "block";
}

// Function to close the modal and the overlay
function closeModal() {
  modal.style.display = "none";
  overlay.style.display = "none";
}

// Close the modal and the overlay when the user clicks outside of them
window.onclick = function(event) {
  if (event.target == overlay) {
    closeModal();
  }
}
// Close the modal and the overlay when the user presses the "Escape" key
window.addEventListener("keydown", function(event) {
    if (event.keyCode === 27) {
      closeModal();
    }
  });
