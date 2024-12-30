import { clearTodosDB, getTodosFromDB, saveTodosToDB } from "../db/todo/todo"
import { renderTodoItems } from "../dom/todo/render"
import { TodosSyncQueue } from "../types/todo"

export const todoFetchUrl = `${
  import.meta.env.VITE_PUBLIC_SUPABASE_URL
}/v1/todos`

export const getTodos = async () => {
  try {
    const res = await fetch(`${todoFetchUrl}?select=*`, {
      headers: {
        apikey: import.meta.env.VITE_PUBLIC_API_KEY,
        Authorization: import.meta.env.VITE_PUBLIC_AUTHORIZATION_TOKEN,
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

export const syncTodosToBackend = async () => {
  const todos = await getTodosFromDB()

  for (const todo of todos) {
    await fetch(`${todoFetchUrl}`, {
      method: "POST",
      headers: {
        apikey: import.meta.env.VITE_PUBLIC_API_KEY,
        Authorization: import.meta.env.VITE_PUBLIC_AUTHORIZATION_TOKEN,
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
    const res = await fetch(todoFetchUrl, {
      method: "POST",
      headers: {
        apikey: import.meta.env.VITE_PUBLIC_API_KEY,
        Authorization: import.meta.env.VITE_PUBLIC_AUTHORIZATION_TOKEN,
        "Content-Type": "application/json",
        Perfer: "return=minimal",
      },
      body: JSON.stringify(newTodo),
    })

    const data = await res.json()
    console.log("data", data)
    console.log("res", res)
  } catch (error) {
    console.error(
      "Failed to fetch from backend. Fetching from IndexedDB:",
      error
    )
  } finally {
    renderTodoItems()
  }
}
