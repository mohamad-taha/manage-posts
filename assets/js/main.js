let baseUrl = "https://vica-post-api.vercel.app/api/posts";

const postModal = document.querySelector(".post-modal");
const loader = document.querySelector("#loader");
const nameInput = document.querySelector("#nameInput");
const descInput = document.querySelector("#descInput");
const postForm = document.querySelector("form");
const table = document.querySelector("#table-content");
const modalTitle = document.querySelector("form h2");
const message = document.querySelector("#message");

// Toggle Modal
function togglePostModal() {
  postModal.classList.toggle("post-modal-active");
  update = false;
  modalTitle.innerHTML = `Add Post`;
  nameInput.value = "";
  descInput.value = "";
}

let update = false;
let postId;

//add and edit posts

postForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const name = nameInput.value.trim();
    const description = descInput.value.trim();

    const newPost = {
      title: name,
      description: description,
    };

    const response = await fetch(update ? baseUrl + `/${postId}` : baseUrl, {
      method: update ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    });

    if (!response.ok) {
      table.innerHTML = "Network response was not ok " + response.status;
      message.style = "box-shadow: 0 0 10px 2px red";
      message.style.background = "red";
      message.innerHTML = update ? "error updating task" : "error adding task";
    }
    showPosts();
    if (response.ok) {
      message.innerHTML = update
        ? "task updated successfully"
        : "task added successfully";
    }
    update = false;
  } catch {
    message.style = "box-shadow: 0 0 10px 2px red";
    message.style.background = "red";
    message.innerHTML = update ? "error updating task" : "error adding task";
  }
  nameInput.value = "";
  descInput.value = "";
  message.style.transform = "scale(1)";
  setTimeout(() => {
    message.style.transform = "scale(0)";
  }, 3000);
  postModal.classList.remove("post-modal-active");
});

async function edtitPost(id) {
  update = true;
  modalTitle.innerHTML = `Edit Post '${id}'`;

  const response = await fetch(baseUrl + `/${id}`);
  const data = await response.json();
  postId = id;
  nameInput.value = data.title;
  descInput.value = data.description;
  postModal.classList.add("post-modal-active");
}

//delete posts
async function deletePost(id) {
  try {
    await fetch(baseUrl + `/${id}`, {
      method: "DELETE",
    });
    showPosts();
    message.innerHTML = "task deleted successfully";
  } catch {
    message.innerHTML = "error deleting task";
    message.style = "box-shadow: 0 0 10px 2px red";
    message.style.background = "red";
  }
  message.style.transform = "scale(1)";
  setTimeout(() => {
    message.style.transform = "scale(0)";
  }, 3000);
}

//show posts
async function showPosts() {
  loader.style.display = "block";
  modalTitle.innerHTML = `Add Post`;

  const response = await fetch(baseUrl);
  const posts = await response.json();
  const data = posts
    .map((post) => {
      return `
    <tr>
      <td>${post.id}</td>
      <td>${post.title}</td>
      <td>${post.description}</td>
      <td class="table-actions">
        <button  onClick=edtitPost(${post.id})>
          <img src="./assets/imgs/edit.svg" alt="edit-icon" />
        </button>
        <button  class="delete-btn" onClick=deletePost(${post.id})>
          <img src="./assets/imgs/trash.svg" alt="delete-icon" />
        </button>
      </td>
    </tr>
    `;
    })
    .join("");
  loader.style.display = "none";
  if (posts.length == 0) {
    table.innerHTML = `<tr style=position:absolute;left:50%;transform:translateX(-50%);> 
        <td style=border:none>No posts found </td>
      </tr>`;
  } else {
    table.innerHTML = data;
  }
}

showPosts();
