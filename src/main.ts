import { syncTodosToBackend } from "./api/todo"
import { renderTodoItems } from "./dom/todo/render"
import "./style.css"


window.addEventListener("online", () => {
  console.log("Online: Syncing with backend...")
  syncTodosToBackend()
})

window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => console.log("Service Worker Registered"))
      .catch((err) => console.error("Service Worker Registration Failed:", err))
  }
  renderTodoItems()
})
