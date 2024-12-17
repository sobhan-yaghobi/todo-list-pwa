import { openDB } from "idb"
import { Todo } from "./todo.type"

// Initialize IndexedDB
const initDB = async () => {
  return await openDB("todosDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("todos")) {
        db.createObjectStore("todos", { keyPath: "id" })
      }
    },
  })
}

// Add or update a todo in IndexedDB
const saveTodosToDB = async (todos : Todo[]) => {
  const db = await initDB()
  const tx = db.transaction("todos", "readwrite")
  const store = tx.objectStore("todos")
  todos.forEach((todo) => store.put(todo))
  await tx.done
}

// Get all todos from IndexedDB
const getTodosFromDB = async () => {
  const db = await initDB()
  return await db.getAll("todos")
}

// Clear IndexedDB store
const clearTodosDB = async () => {
  const db = await initDB()
  const tx = db.transaction("todos", "readwrite")
  await tx.objectStore("todos").clear()
}

export { initDB, saveTodosToDB, getTodosFromDB, clearTodosDB }
