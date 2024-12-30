import { clearTodosDB, getTodosFromDB, saveTodosToDB } from "../db/todo/todo"
import { renderTodoItems } from "../dom/todo/render"
import { HttpClient } from "../lib/fetch"
import { Todo, TodosSyncQueue } from "../types/todo"

const todoFetch = new HttpClient({
  baseURl: `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/v1/todos`,
  headers: {
    apikey: import.meta.env.VITE_PUBLIC_API_KEY,
    Authorization: import.meta.env.VITE_PUBLIC_AUTHORIZATION_TOKEN,
  },
})

export const getTodos = async () => {
  try {
    const todos = await todoFetch.request<Todo[]>("?select=*")

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

export const syncTodosToBackend = async () => {
  const todos = await getTodosFromDB()

  for (const todo of todos) {
    await todoFetch.request(undefined, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    })
  }

  // Clear local cache after syncing
  await clearTodosDB()
  console.log("Synced local todos with backend.")
}

export const createTodo = async (newTodo: TodosSyncQueue) => {
  try {
    const data = await todoFetch.request(undefined, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    })

    console.log("data", data)
  } catch (error) {
    console.error(
      "Failed to fetch from backend. Fetching from IndexedDB:",
      error
    )
  } finally {
    renderTodoItems()
  }
}
