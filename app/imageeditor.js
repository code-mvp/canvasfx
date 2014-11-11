/* TekAcademyLabs.com @rajeshpillai
*  Stage: Experimental
*
*/
var ImageEditor = function (canvasId){
    this.canvas = document.getElementById(canvasId);
    this.mode = "crop";     // todo: refactor hardcoded
    this.imgSrc = "";
    this.marginLeft = 20;
    this.marginTop = 20;
    this.x = 0;     // image x
    this.y = 0;     // image y
    this.iw = 0;    // image width
    this.ih = 0;    // image height
    
    this.anchors = [];  // holds four corners: tl, tr, bl, br
    
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
        
       // var selector  = utils.containsPoint(me.selector.getRect(), me.mouse.x, me.mouse.y);
        
        if (!me.selector.select) {
            me.selector.select = true;
            me.selector.x = me.mouse.x;
            me.selector.y = me.mouse.y;
        }else{
            me.selector.move = true;
        }
    }
    
    function onMouseUp(e){
        me.mousedown = false;
    }
    
    function onMouseMove(e){
       
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
};

ImageEditor.prototype.render = function(){
    var me = this;
    var ctx = this.ctx; //canvas.getContext('2d');
    img = new Image();  // todo: warning, global needs to be rectified.
    img.onload =  function(){
       
       me.iw = img.width;
       me.ih = img.height;
        
       me.canvas.width = img.width + me.marginLeft*2;
       me.canvas.height = img.height + me.marginTop*2
       
       ctx.drawImage(img, me.x + me.marginLeft, me.y + me.marginTop, img.width, img.height);
      
       me.selector.render(ctx);
       me.drawAnchors();
    };
    
    img.src = this.imgSrc;
};

ImageEditor.prototype.crop = function(targetId){
    var can2 = document.getElementById(targetId);
    var ctx2 = can2.getContext('2d');
    
    var crop = this.selector;
    ctx2.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0,0, crop.width, crop.height);
};

ImageEditor.prototype.makeResizable = function(){
    
    var x = this.marginLeft + this.x;
    var y = this.marginTop + this.y;
    
    var w = 15, h = 15;
    
    this.anchors = [];
    
    this.anchors.push({ x: x-w/2, y: y-h/2, w: w, h:h}); //tl
    this.anchors.push({ x: x + this.iw - w/2, y: y-h/2, w: w, h:h}); //tr
    this.anchors.push({ x: x-w/2, y:  y + this.ih-h/2, w: w, h:h}); //bl
    this.anchors.push({ x: x + this.iw-w/2, y: y + this.ih-h/2, w: w, h:h}); //br
};

ImageEditor.prototype.drawAnchors = function(){
    this.makeResizable();
    var ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = "yellow";
    
    var a;
    for(var i = 0; i < this.anchors.length; i++){
        a = this.anchors[i];
        ctx.fillRect(a.x,a.y, a.w,a.h);  // top left
    }
    ctx.restore();
};


