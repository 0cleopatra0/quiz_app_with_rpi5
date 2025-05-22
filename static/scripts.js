const dataContainer = document.getElementById("data-container");
const messageElement = document.getElementById("message");
const counterElement = document.getElementById("counter");
const incrementButton = document.getElementById("increment-btn");

// Initialize WebSocket connection
const socket = io.connect("http://192.168.1.17:5000");

// Fetch initial data from API
fetch("/api/data")
  .then((response) => response.json())
  .then((data) => {
    updatePage(data);
  })
  .catch((error) => console.error("Error fetching initial data:", error));

// Listen for updates from the WebSocket server
socket.on("update", (data) => {
  console.log("Received update:", data);
  updatePage(data);
});

// Update the page with new data
function updatePage(data) {
  messageElement.textContent = `Message: ${data.message}`;
  counterElement.textContent = `Counter: ${data.counter}`;
}

// Send a request to increment the counter
incrementButton.addEventListener("click", () => {
  socket.emit("update", {
    counter: parseInt(counterElement.textContent.split(": ")[1]) + 1,
  });
});
