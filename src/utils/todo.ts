import { TodosSyncQueue } from "../types/todo"

export class Todo {
  generateUsingFormData(formData: FormData) {
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

    return newTodo
  }
}
