/* TekAcademyLabs.com @rajeshpillai
*  Stage: Experimental
*
*/
var ImageEditor = function (canvasId, width, height){
    this.canvas = document.getElementById(canvasId);
    this.mode = "crop";     // todo: refactor hardcoded
    this.imgSrc = "";
    this.marginLeft = 0;
    this.marginTop = 0;
    this.x = 0;     // image x
    this.y = 0;     // image y
   
    
    this.iw = width || 200;    // image width
    this.ih = height || 200;    // image height
    
    this.anchors = [];  // holds four corners: tl, tr, bl, br
    
    this.selanchor = null;
    
    this.ctx = this.canvas.getContext('2d');
    this.mouse = utils.captureMouse(this.canvas);
    
    var me = this;
    
    setupEvents();

    function setupEvents(){
        this.canvas.addEventListener('mousedown', onMouseDown);
        this.canvas.addEventListener('mouseup', onMouseUp);
        this.canvas.addEventListener('mousemove', onMouseMove);
    }
    
    function onMouseDown(e){
        me.mousedown = true;
        
        if (!me.selector.select) {
            me.selector.select = true;
            me.selector.x = me.mouse.x;
            me.selector.y = me.mouse.y;
        }else{
            me.selector.move = true;
        }
        
        for(var i = 0; i < me.anchors.length; i++){
            var a = me.anchors[i];
            if (utils.containsPoint(a, me.mouse.x, me.mouse.y)){
                me.selanchor = a;
                break;
            }
            me.selanchor = null;
        }
    }
    
    function onMouseUp(e){
        me.mousedown = false;
        me.selanchor = null;
    }
    
    function onMouseMove(e){
       me.makeResizable();
    }
};

ImageEditor.prototype.setMode = function(mode){     // mode: crop, resize
  this.mode = mode;
  this.selector = new Selector("crop");
  this.selector.visible = true;
};

ImageEditor.prototype.update = function(){
    var me = this;
    me.selector.update(me);
    me.makeResizable();
};

ImageEditor.prototype.loadImage = function(src){
    var me = this;
    me.imgSrc = src;
    
    var img = new Image();  // todo: warning, global needs to be rectified.
    
    img.onload =  function(){
         // begin
        var maxWidth = me.iw; // Max width for the image
        var maxHeight = me.ih;    // Max height for the image
        var ratio = 0;  // Used for aspect ratio
        var width = this.width;    // Current image width
        var height = this.height;  // Current image height

        // Check if the current width is larger than the max
        if(width > maxWidth){
            ratio = maxWidth / width;   // get ratio for scaling image
            this.width = maxWidth;
            this.height = height * ratio;
            height = height * ratio;    // Reset height to match scaled image
            width = width * ratio;    // Reset width to match scaled image
        }

        // Check if current height is larger than max
        if(height > maxHeight){
            ratio = maxHeight / height; // get ratio for scaling image
            this.height= maxHeight;
            this.width = width * ratio;
            width = width * ratio;    // Reset width to match scaled image
        }
        //--> end

        me.origImage = this;
        console.log(img);
    };
    img.src = src;
};

ImageEditor.prototype.render = function(){
    var me = this;
    var ctx = this.ctx; //canvas.getContext('2d');
    var img = me.origImage;
    
    if (!img) return;
       
    me.iw = img.width;
    me.ih = img.height;
    
   
    //me.canvas.width = img.width + me.marginLeft*2;
    //me.canvas.height = img.height + me.marginTop*2

    me.x1 = 0;//me.x + me.width;
    me.y1 = 0;//me.y + me.height;

    
     var timg = { 
       x: me.x + me.marginLeft,
       y: me.y + me.marginTop,
       sw: img.width,
       sh: img.height,
     };

    //ctx.drawImage(img, me.x + me.marginLeft, me.y + me.marginTop, img.width, img.height);
    ctx.drawImage(img, 0, 0, img.width, img.height);
    me.selector.render(ctx);
    //me.drawAnchors();
};

ImageEditor.prototype.crop = function(targetId){
    var me = this;
    
    // update new canvas
    var can2 = document.getElementById(targetId);
    var ctx2 = can2.getContext('2d');
    
    var crop = this.selector;
    var img = me.origImage;
    can2.width = crop.width;
    can2.height = crop.height;
    //ctx2.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0,0, crop.width, crop.height);
    ctx2.drawImage(me.canvas, crop.x, crop.y, crop.width, crop.height, 0,0, crop.width, crop.height);
    
};

ImageEditor.prototype.makeResizable = function(){
    
    var that = this;
    
    var x = that.marginLeft + that.x;
    var y = that.marginTop + that.y;
    
    var w = 15, h = 15;
    
    this.anchors = [];
    
    this.anchors.push({ x: x-w/2, y: y-h/2, width: w, height:h,name:"tl"}); //tl
    this.anchors.push({ x: x + that.iw - w/2, y: y-h/2, width: w, height:h,name:"tr"}); //tr
    this.anchors.push({ x: x-w/2, y:  y + that.ih-h/2, width: w, height:h,name:"bl"}); //bl
    this.anchors.push({ x: x + that.iw-w/2, y: y + that.ih-h/2, width: w, height:h,name:"br"}); //br
};

ImageEditor.prototype.drawAnchors = function(){
    this.makeResizable();
    var ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = "yellow";
    
    var a;
    for(var i = 0; i < this.anchors.length; i++){
        a = this.anchors[i];
        ctx.fillRect(a.x,a.y, a.width,a.height);  // top left
    }
    ctx.restore();
};


ImageEditor.prototype.getPixels = function() {
  return this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);
};

ImageEditor.prototype.runFilter = function(filter, arg1, arg2, arg3) {
  var self = this;
  var idata = self.filterImage(filter, arg1, arg2, arg3);
  //var ctx = c.getContext('2d');
  //ctx.putImageData(idata, 0, 0);
}

ImageEditor.prototype.filterImage = function(filter, var_args) {
  var self = this;
  var args = [this.getPixels()];
  for (var i=1; i<arguments.length; i++) {
    args.push(arguments[i]);
  }
  return filter.apply(self, args);
};

ImageEditor.prototype.grayscale = function(pixels) {
  var self = this;
    
  var d = pixels.data;
  for (var i=0; i<d.length; i+=4) {
    var r = d[i];
    var g = d[i+1];
    var b = d[i+2];
    // CIE luminance for the RGB
    // The human eye is bad at seeing red and blue, so we de-emphasize them.
    var v = 0.2126*r + 0.7152*g + 0.0722*b;
    d[i] = d[i+1] = d[i+2] = v
  }
    
  var can2 = document.getElementById("target"); // TODO: remove hardcode
  var ctx2 = can2.getContext('2d');
  
  ctx2.clearRect(0, 0, self.canvas.width, self.canvas.height);
  ctx2.putImageData(pixels, 0, 0);
  
    
  return pixels;
};

ImageEditor.prototype.thresshold = function(pixels, threshold) {
  var self = this;
  var d = pixels.data;
  for (var i=0; i<d.length; i+=4) {
    var r = d[i];
    var g = d[i+1];
    var b = d[i+2];
    var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
    d[i] = d[i+1] = d[i+2] = v
  }
  var can2 = document.getElementById("target"); // TODO: remove hardcode
  var ctx2 = can2.getContext('2d');
  
  ctx2.clearRect(0, 0, self.canvas.width, self.canvas.height);
  ctx2.putImageData(pixels, 0, 0);
    
  return pixels;
};


ImageEditor.prototype.brightness = function(pixels, adjustment) {
  var d = pixels.data;
  for (var i=0; i<d.length; i+=4) {
    d[i] += adjustment;
    d[i+1] += adjustment;
    d[i+2] += adjustment;
  }
    
  var can2 = document.getElementById("target"); // TODO: remove hardcode
  var ctx2 = can2.getContext('2d');
  
  ctx2.clearRect(0, 0, self.canvas.width, self.canvas.height);
  ctx2.putImageData(pixels, 0, 0);
  return pixels;
};