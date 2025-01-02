import { getTodos } from "../../api/todo"
import { Todo } from "../../types/todo"
import { todoActionsHandler } from "./eventHandler"

const createTodoElement = (todo: Todo) => `
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

export const createTodoElements = (todos: Todo[]) =>
  todos?.map(createTodoElement)

export const renderTodoItems = async () => {
  try {
    const todos = await getTodos()
    if (!todos) throw new Error("Failed to fetch todos")

    const todosItemsElements = createTodoElements(todos)
    const todoListElm: HTMLUListElement =
      document.querySelector("ul#todo-list")!

    todoListElm.innerHTML = ""
    todoListElm.insertAdjacentHTML(
      "beforeend",
      todosItemsElements?.join("") || ""
    )

    todoActionsHandler(todoListElm)
  } catch (error) {
    console.error("Error rendering todo items:", error)
  }
}
