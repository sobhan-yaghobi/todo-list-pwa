import { createTodo, syncTodosToBackend } from "../../api/todo"
import { TodosSyncQueue } from "../../types/todo"
import { renderTodoItems } from "./render"

// Elements Todos Events
export const todoActionsHandler = (todoListElm: HTMLUListElement) => {
  todoListElm.addEventListener("click", (event) => {
    const target = event.target as HTMLElement
    if (target.tagName === "BUTTON") {
      const action = target.dataset.action
      const todoId = target.closest("li")?.dataset.id

      if (action === "complete") completeTodo(todoId)
      else if (action === "uncomplete") unCompleteTodo(todoId)
      else if (action === "delete") deleteTodo(todoId)
    }
  })
}

export const completeTodo = (todoId: string | undefined) => {
  console.log("action mode is complete", todoId)
}
export const unCompleteTodo = (todoId: string | undefined) => {
  console.log("action mode is uncomplete", todoId)
}
export const deleteTodo = (todoId: string | undefined) => {
  console.log("action mode is deleted", todoId)
}

// When Form Going to Submit
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

// When Connection Back to Online
window.addEventListener("online", () => {
  console.log("Online: Syncing with backend...")
  syncTodosToBackend()
})

// When Dom Load
window.addEventListener("load", () => {
  renderTodoItems()
})
