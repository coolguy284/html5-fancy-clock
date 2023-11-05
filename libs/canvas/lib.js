class CanvasDrawer {
  static #coordSpaceConvertedSymbol = Symbol('coordSpaceConverted');
  #ctx;
  #defaultOpts = {};
  #clockX;
  #clockY;
  #clockRadius;
  
  constructor(ctx, clockX, clockY, clockRadius) {
    this.#ctx = ctx;
    this.#clockX = clockX;
    this.#clockY = clockY;
    this.#clockRadius = clockRadius;
  }
  
  setDefaults(opts) {
    this.#defaultOpts = opts;
  }
  
  static ensureArguments(opts, requiredOptsArray) {
    for (let requiredOption of requiredOptsArray) {
      if (!(requiredOption in opts)) {
        throw new Error(`Required option ${requiredOption} not found.`);
      }
    }
  }
  
  convertCoords(opts) {
    // early return if already converted coordinates
    if (opts[CanvasDrawer.#coordSpaceConvertedSymbol]) {
      return opts;
    }
    
    CanvasDrawer.ensureArguments(opts, ['coordSystem']);
    
    switch (opts.coordSystem) {
      case 'screen space':
        return {
          ...opts,
          [CanvasDrawer.#coordSpaceConvertedSymbol]: true,
        };
      
      case 'clock relative':
        opts = { ...opts };
        
        if ('x' in opts) opts.x = opts.x * this.#clockRadius + this.#clockX;
        if ('y' in opts) opts.y = opts.y * this.#clockRadius + this.#clockY;
        if ('x1' in opts) opts.x1 = opts.x1 * this.#clockRadius + this.#clockX;
        if ('y1' in opts) opts.y1 = opts.y1 * this.#clockRadius + this.#clockY;
        if ('x2' in opts) opts.x2 = opts.x2 * this.#clockRadius + this.#clockX;
        if ('y2' in opts) opts.y2 = opts.y2 * this.#clockRadius + this.#clockY;
        if ('x3' in opts) opts.x3 = opts.x3 * this.#clockRadius + this.#clockX;
        if ('y3' in opts) opts.y3 = opts.y3 * this.#clockRadius + this.#clockY;
        if ('radius' in opts) opts.radius = opts.radius * this.#clockRadius;
        if ('width' in opts) opts.width = opts.width * this.#clockRadius;
        if ('size' in opts) opts.size = opts.size * this.#clockRadius;
        
        opts[CanvasDrawer.#coordSpaceConvertedSymbol] = true;
        
        return opts;
    }
  }
  
  defaultOptsProcessing(opts, requiredOptsArray) {
    let optsWithDefaults = { ...this.#defaultOpts, ...opts };
    
    CanvasDrawer.ensureArguments(optsWithDefaults, requiredOptsArray);
    
    optsWithDefaults = this.convertCoords(optsWithDefaults);
    
    return optsWithDefaults;
  }
  
  defaultOptsProcessingNoCoordConversion(opts, requiredOptsArray) {
    let optsWithDefaults = { ...this.#defaultOpts, ...opts };
    
    CanvasDrawer.ensureArguments(optsWithDefaults, requiredOptsArray);
    
    return optsWithDefaults;
  }
  
  drawLine(opts) {
    opts = this.defaultOptsProcessing(opts, ['x1', 'x2', 'y1', 'y2', 'color', 'width', 'cap']);
    
    this.#ctx.strokeStyle = opts.color;
    this.#ctx.lineWidth = opts.width;
    this.#ctx.lineCap = opts.cap;
    this.#ctx.beginPath();
    this.#ctx.moveTo(opts.x1, opts.y1);
    this.#ctx.lineTo(opts.x2, opts.y2);
    this.#ctx.stroke();
  }
  
  drawFilledTriangle(opts) {
    opts = this.defaultOptsProcessing(opts, ['x1', 'x2', 'x3', 'y1', 'y2', 'y3', 'color']);
    
    this.#ctx.fillStyle = opts.color;
    this.#ctx.beginPath();
    this.#ctx.moveTo(opts.x1, opts.y1);
    this.#ctx.lineTo(opts.x2, opts.y2);
    this.#ctx.lineTo(opts.x3, opts.y3);
    this.#ctx.fill();
  }
  
  drawCircle(opts) {
    opts = this.defaultOptsProcessing(opts, ['x', 'y', 'radius', 'color', 'width']);
    
    this.#ctx.strokeStyle = opts.color;
    this.#ctx.lineWidth = opts.width;
    this.#ctx.lineCap = 'butt';
    this.#ctx.beginPath();
    this.#ctx.arc(opts.x, opts.y, opts.radius, 0, Math.PI * 2);
    this.#ctx.stroke();
  }
  
  drawCircleArc(opts) {
    opts = this.defaultOptsProcessing(opts, ['x', 'y', 'radius', 'color', 'width', 'cap', 'startAngle', 'endAngle']);
    
    let arcIsCounterClockWise = opts.endAngle > opts.startAngle;
    
    this.#ctx.strokeStyle = opts.color;
    this.#ctx.lineWidth = opts.width;
    this.#ctx.lineCap = opts.cap;
    this.#ctx.beginPath();
    this.#ctx.arc(opts.x, opts.y, opts.radius, opts.endAngle, opts.startAngle, arcIsCounterClockWise);
    this.#ctx.stroke();
  }
  
  drawText(opts) {
    opts = this.defaultOptsProcessing(opts, ['x', 'y', 'text', 'color', 'size', 'font']);
    
    if (opts.angle) {
      // draw text at an angle
      this.#ctx.textAlign = 'center';
      this.#ctx.textBaseline = 'middle';
      this.#ctx.fillStyle = opts.color;
      this.#ctx.font = `${opts.size}px ${opts.font}`;
      this.#ctx.save();
      this.#ctx.translate(opts.x, opts.y);
      this.#ctx.rotate(opts.angle);
      this.#ctx.fillText(opts.text, 0, 0);
      this.#ctx.restore();
    } else {
      // draw regular text
      this.#ctx.textAlign = 'center';
      this.#ctx.textBaseline = 'middle';
      this.#ctx.fillStyle = opts.color;
      this.#ctx.font = `${opts.size}px ${opts.font}`;
      this.#ctx.fillText(opts.text, opts.x, opts.y);
    }
  }
  
  drawCircleWithInwardLines(opts) {
    opts = this.defaultOptsProcessingNoCoordConversion(opts, ['radius', 'linesInnerRadius', 'circleWidth', 'lineWidth', 'numLines']);
    
    // circle
    this.drawCircle({
      ...opts,
      width: opts.circleWidth,
    });
    
    // inward lines
    for (let i = 0; i < opts.numLines; i++) {
      let angle = Math.PI * 2 / opts.numLines * i - Math.PI / 2;
      
      let normalizedX = Math.cos(angle);
      let normalizedY = Math.sin(angle);
      
      this.drawLine({
        ...opts,
        x1: opts.x + normalizedX * opts.radius * opts.linesInnerRadius,
        y1: opts.y + normalizedY * opts.radius * opts.linesInnerRadius,
        x2: opts.x + normalizedX * opts.radius,
        y2: opts.y + normalizedY * opts.radius,
        width: opts.lineWidth,
      });
    }
  }
  
  drawCircleArcWithInwardLines(opts) {
    opts = this.defaultOptsProcessingNoCoordConversion(opts, ['radius', 'linesInnerRadius', 'circleWidth', 'lineWidth', 'numLines']);
    
    // circle
    this.drawCircleArc({
      ...opts,
      width: opts.circleWidth,
    });
    
    // inward lines
    for (let i = 0; i < opts.numLines; i++) {
      let angle = opts.startAngle + (opts.endAngle - opts.startAngle) / (opts.numLines - 1) * i;
      
      let normalizedX = Math.cos(angle);
      let normalizedY = Math.sin(angle);
      
      this.drawLine({
        ...opts,
        x1: opts.x + normalizedX * opts.radius * opts.linesInnerRadius,
        y1: opts.y + normalizedY * opts.radius * opts.linesInnerRadius,
        x2: opts.x + normalizedX * opts.radius,
        y2: opts.y + normalizedY * opts.radius,
        width: opts.lineWidth,
      });
    }
  }
  
  // draws text to screen per letter, spaced using the letterSpacings array
  drawTextWithPerLetterSpacing(opts) {
    opts = this.defaultOptsProcessingNoCoordConversion(opts, ['x', 'text', 'size', 'letterSpacings', 'nudgeOnes']);
    
    // nudge printed text if "1" is on left side to make it visually centered
    if (opts.nudgeOnes && text.length > 1 && text[0] == '1') {
      centerX -= 0.05 * textHeight;
    }
    
    // calculate cumulative version of letterSpacings array
    let letterSpacingsCumulative = cumulativeSum(opts.letterSpacings).map(x => x * opts.size);
    
    // calculate offset from centerX all letters will be drawn from
    let centerXOffset = (letterSpacingsCumulative[0] + letterSpacingsCumulative[letterSpacingsCumulative.length - 1]) / 2 * -1;
    
    // draw spaced letters
    for (let i = 0; i < opts.text.length; i++) {
      this.drawText({
        ...opts,
        text: opts.text[i],
        x: opts.x + centerXOffset + letterSpacingsCumulative[i],
      });
    }
  }
  
  drawTextFixedWidth(opts) {
    opts = this.defaultOptsProcessingNoCoordConversion(opts, ['text']);
    
    // calculate width array
    let letterWidths = [];
    
    for (let char of opts.text) {
      // check letter in regexes
      let i;
      for (i = 0; i < LETTER_WIDTHS.length; i++) {
        if (LETTER_WIDTHS[i][0].test(char)) {
          letterWidths.push(LETTER_WIDTHS[i][1]);
          break;
        }
      }
      
      // letter not found in regex
      if (i == LETTER_WIDTHS.length) {
        letterWidths.push(0);
      }
    }
    
    // calculate spacing array from width array
    let letterSpacings = [0];
    
    for (let i = 0; i < letterWidths.length - 1; i++) {
      letterSpacings.push((letterWidths[i] + letterWidths[i + 1]) / 2);
    }
    
    // draw text
    this.drawTextWithPerLetterSpacing({
      ...opts,
      letterSpacings,
    });
  }
}
