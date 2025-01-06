window.addEventListener('DOMContentLoaded', () => {
    const pdfFiles = ['18.HÜ.pdf', '19.HÜ.pdf', '20.HÜ.pdf'];

    const fileList = document.getElementById('fileNameList');
    const ul = document.createElement('ul');

    const modalContainer = document.createElement('div');
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0';
    modalContainer.style.left = '0';
    modalContainer.style.width = '100%';
    modalContainer.style.height = '100%';
    modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalContainer.style.display = 'none';
    modalContainer.style.justifyContent = 'center';
    modalContainer.style.alignItems = 'center';
    modalContainer.style.zIndex = '1000';
    document.body.appendChild(modalContainer);

    const embedElement = document.createElement('embed');
    embedElement.style.width = '80%';
    embedElement.style.height = '80%';
    modalContainer.appendChild(embedElement);

    const closeModalButton = document.createElement('button');
    closeModalButton.textContent = 'Close';
    closeModalButton.style.position = 'absolute';
    closeModalButton.style.top = '10px';
    closeModalButton.style.right = '10px';
    closeModalButton.onclick = () => {
        modalContainer.style.display = 'none';
    };
    modalContainer.appendChild(closeModalButton);

    pdfFiles.forEach(file => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `docs/${file}`;
        a.textContent = file;
        a.target = '_blank';

        const previewButton = document.createElement('button');
        previewButton.textContent = 'Preview';
        previewButton.style.marginLeft = '10px';
        previewButton.onclick = () => {
            embedElement.src = `docs/${file}`;
            modalContainer.style.display = 'flex';
        };

        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download';
        downloadButton.style.marginLeft = '10px';
        downloadButton.onclick = () => {
            const link = document.createElement('a');
            link.href = `docs/${file}`;
            link.download = file;
            link.click();
        };

        li.appendChild(a);
        li.appendChild(previewButton);
        li.appendChild(downloadButton);
        ul.appendChild(li);
    });

    if (fileList) {
        fileList.appendChild(ul);
    } else {
        console.error('File list container not found');
    }
});
