function addTask() {
  const input = document.getElementById("taskInput");
  const taskText = input.value.trim();
  
  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const li = document.createElement("li");
  li.innerHTML = `
    ${taskText}
    <button onclick="removeTask(this)">❌</button>
  `;
  li.addEventListener('click', function() {
    li.classList.toggle('done');
  });

  document.getElementById("taskList").appendChild(li);
  input.value = "";
}

function removeTask(btn) {
  btn.parentElement.remove();
}
