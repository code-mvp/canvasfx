var Selector = function (type){
    console.log("create seletor: ", type);
    this.type = type || "crop"; // crop, resize
    this.x = 0;
    this.y = 0;
    this.x1 = 0;
    this.y1 = 0;
    this.width = 0;
    this.height = 0;
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
    ctx.save();
    ctx.strokeStyle = "yellow";
    
    if (this.mode == "select"){
        ctx.strokeRect(this.x, this.y, this.getRect().width, this.getRect().height);
    }else if (this.mode == "move") {
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    ctx.restore();
};