import { getTodosFromDB, saveTodosToDB } from "../db/todo/todo"
import { saveTodosSyncQueue } from "../db/todo/todoSyncQueue"
import { renderTodoItems } from "../dom/todo/render"
import { HttpClient } from "../lib/fetch"
import {
  Todo,
  TodoSchema,
  TodosSyncQueue,
  TodosSyncQueueSchema,
} from "../types/todo"

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
    await saveTodosToDB(todos)

    return todos
  } catch (error) {
    console.error(
      "Failed to fetch from backend. Fetching from IndexedDB:",
      error
    )
    return await getTodosFromDB()
  }
}

export const syncTodosToBackend = async () => {}

export const createTodo = async (newTodo: TodosSyncQueue) => {
  try {
    const res = await todoFetch.request<Response>(undefined, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        prefer: "return=representation",
      },
      body: JSON.stringify(newTodo),
    })

    if (!res.ok) throw await res.json()

    const data = await res.json()
    const todoSchemaChecker = TodoSchema.safeParse(data)

    if (!todoSchemaChecker.success) throw todoSchemaChecker.error.message

    saveTodosToDB([todoSchemaChecker.data])
  } catch (error) {
    console.error(
      "Failed to fetch from backend. Fetching from IndexedDB:",
      error
    )

    const todoSyncQueueChecker = TodosSyncQueueSchema.safeParse(newTodo)
    if (todoSyncQueueChecker.success)
      saveTodosSyncQueue([todoSyncQueueChecker.data])
  } finally {
    renderTodoItems()
  }
}
