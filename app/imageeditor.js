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
        console.log("Mouse: ",me.mouse);
        
        var selector  = utils.containsPoint(me.selector, me.mouse.x, me.mouse.y);
        if (selector){
            me.selector.selected = true;
            console.log("down");
        }
        
    }
    
    function onMouseUp(e){
        if (me.selector.selected){
            me.selector.selected = false;
        }
        
    }
    
    function onMouseMove(e){
        if (me.selector.selected){
            
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
       
       me.selector.x = me.mouse.x - me.selector.width/2;
       me.selector.y = me.mouse.y - me.selector.height/2;
        
       me.selector.render(ctx);
    
    };
    
    img.src = this.imgSrc;
    
};



