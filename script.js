let editingTaskId = null;

const authDiv = document.getElementById('auth');
const appDiv = document.getElementById('app');
const taskList = document.getElementById('task-list');
const addTaskBtn = document.getElementById('add-task-button');

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth.signInWithEmailAndPassword(email, password)
    .then(() => console.log('Logged in'))
    .catch(err => alert(err.message));
}

function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => console.log('Signed up'))
    .catch(err => alert(err.message));
}

function logout() {
  auth.signOut();
  editingTaskId = null;
  clearForm();
}

function addTask() {
  const title = document.getElementById('task-title').value.trim();
  const desc = document.getElementById('task-desc').value.trim();
  const date = document.getElementById('task-date').value;
  const status = document.getElementById('task-status').value;
  const user = auth.currentUser;

  if (!user || !title) return;

  const taskData = {
    uid: user.uid,
    title,
    desc,
    date,
    status,
    created: firebase.firestore.FieldValue.serverTimestamp()
  };

  if (editingTaskId) {
    db.collection("tasks").doc(editingTaskId).update(taskData)
      .then(() => {
        editingTaskId = null;
        clearForm();
      });
  } else {
    db.collection("tasks").add(taskData)
      .then(() => clearForm());
  }
}

function renderTasks(user) {
  db.collection("tasks")
    .where("uid", "==", user.uid)
    .orderBy("created", "desc")
    .onSnapshot(snapshot => {
      taskList.innerHTML = '';
      snapshot.forEach(doc => {
        const task = doc.data();
        const taskId = doc.id;

        taskList.innerHTML += `
          <div class="task">
            <h3>${task.title}</h3>
            <p>${task.desc}</p>
            <p>📅 Due: ${task.date || 'Not set'}</p>
            <p>Status: ${task.status}</p>
            <button onclick="editTask('${taskId}', \`${task.title}\`, \`${task.desc}\`, '${task.date}', '${task.status}')">✏️ Edit</button>
            <button onclick="deleteTask('${taskId}')">🗑️ Delete</button>
          </div>
        `;
      });
    });
}

function deleteTask(id) {
  db.collection("tasks").doc(id).delete();
}

function editTask(id, title, desc, date, status) {
  document.getElementById('task-title').value = title;
  document.getElementById('task-desc').value = desc;
  document.getElementById('task-date').value = date;
  document.getElementById('task-status').value = status;
  editingTaskId = id;
  addTaskBtn.textContent = "Update Task";
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function clearForm() {
  document.getElementById('task-title').value = '';
  document.getElementById('task-desc').value = '';
  document.getElementById('task-date').value = '';
  document.getElementById('task-status').value = 'To Do';
  addTaskBtn.textContent = 'Add Task';
  editingTaskId = null;
}

// Google login
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(result => console.log("Google login success"))
    .catch(err => alert("Google login error: " + err.message));
}

// Auth state listener
auth.onAuthStateChanged(user => {
  if (user) {
    authDiv.classList.add('hidden');
    appDiv.classList.remove('hidden');
    document.getElementById('user-name').textContent = user.displayName || user.email;
    renderTasks(user);
  } else {
    authDiv.classList.remove('hidden');
    appDiv.classList.add('hidden');
    taskList.innerHTML = '';
    clearForm();
  }
});

function toggleProfileMenu() {
  document.getElementById('profile-dropdown').classList.toggle('hidden');
}
