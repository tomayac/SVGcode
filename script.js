const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const turdsize = document.querySelector("#turdsize");
const contrast = document.querySelector("#contrast");
const input = document.querySelector("img");
const output = document.querySelector("output");

const render = async () => {
  const config = {
    turdsize: parseInt(turdsize.value, 10),
  };
  const svg = await loadFromCanvas(canvas, config);            
  output.innerHTML = svg;      
};

const drawImage = () => {  
  canvas.width = input.naturalWidth;
  canvas.height = input.naturalHeight;
  ctx.drawImage(input, 0, 0);    
  ctx.filter = `contrast(${contrast.value/100})`;    
  ctx.drawImage(input, 0, 0);  
}

input.addEventListener("load", () => {
  (async () => {    
    drawImage();  
      
    try {                  
      const config = {
        turdsize: parseInt(turdsize.value, 10),
      };
      await render(config);
    } catch (err) {
      console.error(err.name, err.message);
    }
  })();
});

turdsize.addEventListener('input', async () => {  
  await render();
});

contrast.addEventListener('input', async () => {  
  drawImage();
  await render();
})