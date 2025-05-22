import { io } from "socket.io-client";

const user_id = "your_user_id";  // Replace dynamically if needed

async function fetchQuestionList() {
  try {
    const res = await fetch("http://localhost:5000/questions");
    const data = await res.json();
    const list = document.getElementById("questionList");
    list.innerHTML = "";

    data.questions.forEach((q) => {
      const li = document.createElement("li");
      li.className = "bg-gray-800 p-4 rounded-lg";
      li.textContent = `${new Date(q.timestamp).toLocaleTimeString()} — ${q.question}`;
      list.appendChild(li);
    });
  } catch (e) {
    console.error("Failed to fetch questions list", e);
  }
}

setInterval(fetchQuestionList, 3000);

function displayAnswer(answer) {
  const ques = document.getElementById("question");
  ques.textContent = "Answer:";
  const answers = document.getElementById("answers") || document.createElement("ul");
  answers.id = "answers";
  answers.innerHTML = `
    <li class="col-span-2 bg-green-900 p-6 rounded-lg text-xl animate-fadeIn">
      ${answer}
    </li>
  `;
  if (!document.getElementById("answers")) {
    document.body.appendChild(answers);
  }
}

document.getElementById("askBtn").addEventListener("click", async () => {
  const userId = document.getElementById("user_id").value.trim();
  const question = document.getElementById("question").value.trim();
  const responseDiv = document.getElementById("response");

  if (!userId || !question) {
    responseDiv.textContent = "Please provide both user ID and question.";
    return;
  }

  responseDiv.textContent = "Thinking...";

  await fetch("http://localhost:5000/ask_async", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, question }),
  });

  const interval = setInterval(async () => {
    const res = await fetch(`http://localhost:5000/check_answer?user_id=${userId}&question=${encodeURIComponent(question)}`);
    const data = await res.json();

    if (data.ready) {
      clearInterval(interval);
      responseDiv.textContent = data.answer;
    }
  }, 3000);
});
