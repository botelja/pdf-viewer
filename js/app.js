const url = '../docs/pdf.pdf';

let pdfDocument = null;
let pageNumber = 1;
let pageIsRendering = false;
let pageNumberIsPending = null;

const scale = 1.5;
const canvas = document.getElementById('page-render');
const ctx = canvas.getContext('2d');

//Render the page
const renderPage = (number) => {
  pageIsRendering = true;
  //Fetch the page
  pdfDocument.getPage(number).then((page) => {
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext: ctx,
      viewport
    };

    page.render(renderContext).promise.then(() => {
      pageIsRendering = false;
      console.log(pageNumberIsPending);
      if (pageNumberIsPending !== null) {
        renderPage(pageNumberIsPending);
        pageNumberIsPending = null;
      }
    });
    //Output page number
    document.getElementById('page-num').textContent = number;
  });
};

//Check if is rendering
const queueRenderPage = (number) => {
  if (pageIsRendering) {
    pageNumPending = num;
  } else {
    renderPage(number);
  }
};

// Prev page
const onPrevPage = () => {
  if (pageNumber <= 1) {
    return;
  }
  pageNumber--;
  queueRenderPage(pageNumber);
};

// Next page
const onNextPage = () => {
  if (pageNumber >= pdfDocument.numPages) {
    return;
  }
  pageNumber++;
  queueRenderPage(pageNumber);
};

//Get pdf documnet
pdfjsLib.getDocument(url).promise.then((pdfDoc) => {
  pdfDocument = pdfDoc;
  document.getElementById('page-count').textContent = pdfDocument.numPages;
  renderPage(pageNumber);
});

//Display prev page
document.getElementById('prev-page').addEventListener('click', onPrevPage);
//Display next page
document.getElementById('next-page').addEventListener('click', onNextPage);
