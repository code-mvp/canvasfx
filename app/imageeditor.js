var ImageEditor = function (canvasId){
    this.canvas = document.getElementById(canvasId);
    this.mode = "crop"; 
    this.imgSrc = "";
    
    
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
        
        me.selector.selected = true;
        me.selector.x = me.mouse.x;
        me.selector.y = me.mouse.y;
        
    }
    
    function onMouseUp(e){
        if (me.mousedown && me.selector.selected){
            me.selector.selected = false;
        }
        me.mousedown = false;
        
    }
    
    function onMouseMove(e){
        if (me.mousedown && me.selector.selected){
            
        }
    }
};

ImageEditor.prototype.setMode = function(mode){     // mode: crop, resize
  this.mode = mode;
    
  this.selector = new Selector("crop");

};

ImageEditor.prototype.render = function(){
    var me = this;
    ctx = canvas.getContext('2d');
    var img = new Image();
    img.onload =  function(){
       ctx.drawImage(img, 0, 0);
       
       if (me.mousedown && me.selector) {
         me.selector.x1 = me.mouse.x; //- me.selector.width/2;
         me.selector.y1 = me.mouse.y; // - me.selector.height/2;
       }
       me.selector.render(ctx);

    };
    
    img.src = this.imgSrc;
    
};



