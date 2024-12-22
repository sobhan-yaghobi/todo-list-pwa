import { clearTodosDB, getTodosFromDB, saveTodosToDB } from "./indexDBUtils"
import "./style.css"
import { Todo } from "./todo.type"

export const supabaseUrl = "https://yooiaidlyydofvfcxfuj.supabase.co/rest"
export const todoFetchUrl = `${supabaseUrl}/v1/todos`
export const authorizationToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvb2lhaWRseXlkb2Z2ZmN4ZnVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NzU3MzgsImV4cCI6MjA0OTI1MTczOH0.sM2jygdiZPFgnFwsNC85Newo1KOJd_IONlzM9mu0HcY"
export const apiKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvb2lhaWRseXlkb2Z2ZmN4ZnVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NzU3MzgsImV4cCI6MjA0OTI1MTczOH0.sM2jygdiZPFgnFwsNC85Newo1KOJd_IONlzM9mu0HcY"

// Fetch todos from Supabase API
const getTodos = async () => {
  try {
    const res = await fetch(`${todoFetchUrl}?select=*`, {
      headers: {
        apikey: apiKey,
        Authorization: authorizationToken,
      },
    })
    const todos = await res.json()

    // Save fetched todos to IndexedDB
    await saveTodosToDB(todos)
    return todos
  } catch (error) {
    console.error(
      "Failed to fetch from backend. Fetching from IndexedDB:",
      error
    )
    return await getTodosFromDB() // Fallback to offline cache
  }
}

// Create DOM elements for todos
const createTodoElements = (todos: Todo[]) =>
  todos?.map(
    (todo) => `
    <li class="todo-item" data-id="${todo.id}">
      <button class="todo-item__button todo-item__button-delete button-danger" data-action="delete">delete</button>
      <h2 class="todo-item__title">${todo.title}</h2>
      <p class="todo-item__description">${todo.description}</p>
      ${
        todo.isCompleted
          ? `<button class="todo-item__button" data-action="uncomplete">Uncomplete</button>`
          : `<button class="todo-item__button button-success" data-action="complete">Complete</button>`
      }
    </li>`
  )

// Render todo items
const renderTodoItems = async () => {
  const todos = await getTodos()
  const todosItemsElements = createTodoElements(todos)

  const todoListElm: HTMLUListElement = document.querySelector("ul#todo-list")!
  todoListElm.innerHTML = ""
  todoListElm.insertAdjacentHTML("beforeend", todosItemsElements?.join(""))

  todoListElm.addEventListener("click", (event) => {
    const target = event.target as HTMLElement
    if (target.tagName === "BUTTON") {
      const action = target.dataset.action
      const todoId = target.closest("li")?.dataset.id

      if (action === "complete") {
        console.log("action mode is complete", todoId)
      } else if (action === "uncomplete") {
        console.log("action mode is uncomplete", todoId)
      } else if (action === "delete") {
        console.log("action mode is deleted", todoId)
      }
    }
  })
}

// Sync data to backend when online
const syncTodosToBackend = async () => {
  const todos = await getTodosFromDB()

  for (const todo of todos) {
    await fetch(`${todoFetchUrl}`, {
      method: "POST",
      headers: {
        apikey: apiKey,
        Authorization: authorizationToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    })
  }

  // Clear local cache after syncing
  await clearTodosDB()
  console.log("Synced local todos with backend.")
}

// Event listener for online status
window.addEventListener("online", () => {
  console.log("Online: Syncing with backend...")
  syncTodosToBackend()
})

// Load and render todos on page load
window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => console.log("Service Worker Registered"))
      .catch((err) => console.error("Service Worker Registration Failed:", err))
  }
  renderTodoItems()
})
