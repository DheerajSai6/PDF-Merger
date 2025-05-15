document.getElementById('merge-button').addEventListener('click', async () => {
    const input = document.getElementById('file-input');
    const output = document.getElementById('output');
    output.innerHTML = '';

    if (!input.files.length) {
        output.textContent = 'Please select PDF files.';
        return;
    }

    const mergedPdf = await PDFLib.PDFDocument.create();

    for (const file of input.files) {
        if (file.type !== 'application/pdf') {
            output.textContent = `${file.name} is not a PDF file. Please select only PDF files.`;
            return;
        }
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'merged.pdf';
    downloadLink.textContent = 'Download Merged PDF';
    downloadLink.className = 'download-link';
    output.appendChild(downloadLink);
});