import { openDB } from "idb"
import { TodosSyncQueue } from "../../types/todo"
const todosSyncQueueStoreName = "TodosSyncQueue"

export const initTodosSyncQueue = async () => {
  return await openDB("todosSyncQueueDB", 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains(todosSyncQueueStoreName)) {
        db.createObjectStore(todosSyncQueueStoreName, { keyPath: "id" })
      }
    },
  })
}

export const saveTodosSyncQueue = async (todosActions: TodosSyncQueue[]) => {
  const db = await initTodosSyncQueue()
  const tx = db.transaction(todosSyncQueueStoreName, "readwrite")
  const store = tx.objectStore(todosSyncQueueStoreName)
  todosActions.forEach((TodosSyncQueue) => store.put(TodosSyncQueue))
}

export const getTodosSyncQueue = async () => {
  const db = await initTodosSyncQueue()
  return await db.getAll(todosSyncQueueStoreName)
}

export const cleatTodosSyncQueueDB = async () => {
  const db = await initTodosSyncQueue()
  const tx = db.transaction(todosSyncQueueStoreName, "readwrite")
  await tx.objectStore(todosSyncQueueStoreName).clear()
}
