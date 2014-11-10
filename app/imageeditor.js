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

};

ImageEditor.prototype.render = function(){
    var me = this;
    ctx = canvas.getContext('2d');
    img = new Image();  // todo: warning, global needs to be rectified.
    img.onload =  function(){
       ctx.drawImage(img, 0, 0);
       
       if (me.mousedown && me.selector.select && !me.selector.move) {
         me.selector.mode = "select";
         me.selector.x1 = me.mouse.x; 
         me.selector.y1 = me.mouse.y; 
       }
       else if (me.mousedown && me.selector.move){   // if selector already drawn
         me.selector.mode = "move";
         me.selector.x = me.mouse.x - me.selector.width/2;
         me.selector.y = me.mouse.y  - me.selector.height/2;
           
       }
       me.selector.render(ctx);

    };
    
    img.src = this.imgSrc;
    
};

ImageEditor.prototype.crop = function(targetId){
    var can2 = document.getElementById(targetId);
    var ctx2 = can2.getContext('2d');
    
    var crop = this.selector;
    ctx2.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0,0, crop.width, crop.height);
    
};



