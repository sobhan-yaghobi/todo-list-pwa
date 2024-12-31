import { createTodo, syncTodosToBackend } from "../../api/todo"
import { TodosSyncQueue } from "../../types/todo"
import { renderTodoItems } from "./render"

const todoSubmitFormElem: HTMLFormElement = document.querySelector(
  "form#todo-submit-form"
)!

todoSubmitFormElem.addEventListener("submit", async (e) => {
  e.preventDefault()
  const formData = new FormData(todoSubmitFormElem)
  const descriptionFormData = formData.get("description")
  const titleFormData = formData.get("title")

  const newTodo: TodosSyncQueue = {
    title: typeof titleFormData === "string" ? titleFormData : "",
    description:
      typeof descriptionFormData === "string" ? descriptionFormData : "",
    isCompleted: false,
    created_at: new Date(),
    updated_at: null,
  }

  await createTodo(newTodo)
  todoSubmitFormElem.reset()
})

window.addEventListener("online", () => {
  console.log("Online: Syncing with backend...")
  syncTodosToBackend()
})

window.addEventListener("load", () => {
  renderTodoItems()
})
