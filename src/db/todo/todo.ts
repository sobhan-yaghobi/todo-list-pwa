import { openDB } from "idb"
import { Todo } from "../../types/todo"
const todosStoreName = "todos"

export const initTodosDB = async () => {
  return await openDB("todosDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(todosStoreName)) {
        db.createObjectStore(todosStoreName, { keyPath: "id" })
      }
    },
  })
}
export const saveTodosToDB = async (todos: Todo[]) => {
  const db = await initTodosDB()
  const tx = db.transaction(todosStoreName, "readwrite")
  const store = tx.objectStore(todosStoreName)
  todos.forEach((todo) => store.put(todo))
  await tx.done
}
export const getTodosFromDB = async () => {
  const db = await initTodosDB()
  return await db.getAll(todosStoreName)
}

export const clearTodosDB = async () => {
  const db = await initTodosDB()
  const tx = db.transaction(todosStoreName, "readwrite")
  await tx.objectStore(todosStoreName).clear()
}
