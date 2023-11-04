// sets canvas pixel width and height to its css width and height
function resetCanvasSize() {
  let canvasStyle = getComputedStyle(canvas);
  
  // scale canvas width and height by device pixel ratio to prevent highly grainly canvas on mobile
  let canvasWidth = parseInt(canvasStyle.width) * window.devicePixelRatio;
  let canvasHeight = parseInt(canvasStyle.height) * window.devicePixelRatio;
  
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
}
