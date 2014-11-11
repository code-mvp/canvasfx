var Selector = function (type){
    console.log("create seletor: ", type);
    this.type = type || "crop"; // crop, resize
    this.x = 20;
    this.y = 20;
    this.x1 = 40;
    this.y1 = 40;
    this.width = 20;
    this.height = 20;
    this.mode = "select"; // select, move
};

Selector.prototype.getRect = function(){
    this.width = this.x1 - this.x;
    this.height = this.y1 - this.y;
    
    return { x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
           };
};

Selector.prototype.render = function(ctx){
    if (this.visible){
        ctx.save();
        ctx.strokeStyle = "yellow";
        if (this.mode == "select"){
            ctx.strokeRect(this.x, this.y, this.getRect().width, this.getRect().height);
        }else if (this.mode == "move") {
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
        ctx.restore();
    }
};

Selector.prototype.update = function(me){
  if (me.mousedown && this.select && !this.move) {
      this.mode = "select";
      this.x1 = me.mouse.x; 
      this.y1 = me.mouse.y; 
    }
    else if (me.mousedown && this.move){   // if selector already drawn
      this.mode = "move";
      this.x = me.mouse.x - this.width/2;
      this.y = me.mouse.y  - this.height/2;
    }
};