var Selector = function (type){
    console.log("create seletor: ", type);
    this.type = type || "crop"; // crop, resize
    this.x = 0;
    this.y = 0;
    this.x1 = 0;
    this.y1 = 0;
    this.width = 0;
    this.height = 0;
};

Selector.prototype.getRect = function(){
    return { x: this.x,
            y: this.y,
            width: this.x1 - this.x,
            height: this.y1 - this.y
           };
};

Selector.prototype.render = function(ctx){
    ctx.save();
    ctx.strokeStyle = "yellow";
    
    ctx.strokeRect(this.x, this.y, this.getRect().width, this.getRect().height);
    
    ctx.restore();
};