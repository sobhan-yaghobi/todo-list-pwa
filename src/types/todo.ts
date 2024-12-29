export type Todo = {
  id: number
  created_at: Date
  title: string
  description: string
  updated_at: Date | null
  isCompleted: boolean | null
}

// export type TodoGenerate = Omit<Todo, "id">
export type TodosSyncQueue = Omit<Todo, "id"> & Partial<Pick<Todo, "id">>
