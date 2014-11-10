var Selector = function (type){
    console.log("create seletor: ", type);
    this.type = type || "crop"; // crop, resize
    this.x = 0;
    this.y = 0;
    this.width = 40;
    this.height = 40;
};

Selector.prototype.render = function(ctx){
    ctx.save();
    ctx.strokeStyle = "yellow";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    ctx.restore();
};