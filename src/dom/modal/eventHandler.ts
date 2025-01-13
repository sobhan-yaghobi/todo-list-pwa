const openModalButton = document.querySelector("[data-open-modal]")
const closeModalButton = document.querySelector("[data-close-modal]")
const modal: HTMLDialogElement | null = document.querySelector("[data-modal]")!

openModalButton?.addEventListener("click", () => {
  modal?.showModal()
})

closeModalButton?.addEventListener("click", () => {
  modal?.close()
})

export const closeModal = ()=>{
    modal?.close()
}
