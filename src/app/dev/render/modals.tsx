let createdModals: Map<string, HTMLElement | undefined> = new Map<string, HTMLElement>();

const DeleteModalFromMap = (modalName: string) => {
    createdModals.delete(modalName);
};

const GetModal = (modalName: string): HTMLElement | undefined => {
    return createdModals.get(modalName);
};

// TODO: make a modal root to more versatile uses in create modal
export const CreateModalTextBox = (modalName: string, innerHTML: string) => {
    let alreadyCreatedModal: HTMLElement | undefined = GetModal(modalName);
    if (alreadyCreatedModal) {
        // Ensure the modal is visible if it was hidden
        alreadyCreatedModal.style.display = 'block';
        return alreadyCreatedModal;
    }

    let modal: HTMLElement = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.padding = '20px';
    modal.style.color = 'white';
    modal.style.borderRadius = '10px';
    modal.style.textAlign = 'center';
    modal.style.zIndex = '1000';
    modal.innerHTML = innerHTML + `<button id="modal-${modalName}-close">Close</button>`;

    document.body.appendChild(modal);

    const closeModalBtn = modal.querySelector(`#modal-${modalName}-close`);
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            CloseModalTextBox(modalName);
        });
    }

    createdModals.set(modalName, modal);
    return modal;
};

export const CloseModalTextBox = (modalName: string) => {
    let modal: HTMLElement = createdModals.get(modalName) as HTMLElement;
    if (modal) {
        DeleteModalFromMap(modalName);
        modal.style.display = 'none';
    }
};