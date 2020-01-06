"use strict";
const CLASS_WIDTH = 100;
const CLASS_HEIGHT = 60;
const ARROW_WIDTH = 20;
const ARROW_HEIGHT = 10;
const GRID_SIZE = 20;
const FONT_SIZE = 13;
const MARGIN = 10;
String.prototype.hashCode = function () {
    var hash = 0, i, chr;
    if (this.length === 0)
        return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};
class Graphics {
    constructor(ctx) {
        this.ctx = ctx;
        this.zoom = 1;
        this.offsetx = 0;
        this.offsety = 0;
    }
    drawRect(x, y, w, h) {
        this.ctx.strokeRect(this.mapx(x), this.mapy(y), this.mapw(w), this.maph(h));
    }
    drawLine(sx, sy, ex, ey) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.mapx(sx), this.mapy(sy));
        this.ctx.lineTo(this.mapx(ex), this.mapy(ey));
        ctx.stroke();
    }
    drawDashedLine(sx, sy, ex, ey) {
        this.ctx.beginPath();
        this.ctx.setLineDash([6, 4]);
        this.ctx.moveTo(this.mapx(sx), this.mapy(sy));
        this.ctx.lineTo(this.mapx(ex), this.mapy(ey));
        ctx.stroke();
        this.ctx.setLineDash([]);
    }
    drawUpArrow(x, y) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.mapx(x), this.mapy(y) - this.maph(ARROW_HEIGHT));
        this.ctx.lineTo(this.mapx(x) - this.mapw(ARROW_WIDTH) / 2, this.mapy(y));
        this.ctx.lineTo(this.mapx(x) + this.mapw(ARROW_WIDTH) / 2, this.mapy(y));
        this.ctx.lineTo(this.mapx(x), this.mapy(y) - this.maph(ARROW_HEIGHT));
        ctx.stroke();
    }
    drawOtherArrow(x, y) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.mapx(x), this.mapy(y));
        this.ctx.lineTo(this.mapx(x) - this.mapw(ARROW_WIDTH) / 2, this.mapy(y) + this.maph(ARROW_HEIGHT) / 2);
        this.ctx.lineTo(this.mapx(x) - this.mapw(ARROW_WIDTH), this.mapy(y));
        this.ctx.lineTo(this.mapx(x) - this.mapw(ARROW_WIDTH) / 2, this.mapy(y) - this.maph(ARROW_HEIGHT) / 2);
        this.ctx.lineTo(this.mapx(x), this.mapy(y));
        ctx.stroke();
    }
    drawTextCentered(text, x, y) {
        this.ctx.font = Math.round(FONT_SIZE * this.zoom) + "px Courier";
        this.ctx.fillText(text, this.mapx(x) - this.ctx.measureText(text).width / 2, this.mapy(y));
    }
    drawText(text, x, y) {
        this.ctx.font = Math.round(FONT_SIZE * this.zoom) + "px Courier";
        this.ctx.fillText(text, this.mapx(x), this.mapy(y));
    }
    contains(x, y, sx, sy, w, h) {
        return (this.mapx(sx) <= x &&
            x < this.mapx(sx) + this.mapw(w) &&
            this.mapy(sy) <= y &&
            y < this.mapy(sy) + this.maph(h));
    }
    mapx(x) {
        return x * this.zoom - this.offsetx;
    }
    mapy(y) {
        return y * this.zoom - this.offsety;
    }
    mapw(w) {
        return w * this.zoom;
    }
    maph(h) {
        return h * this.zoom;
    }
}
class RightLeft {
    draw(g, x, y, ox, oy) {
        const sx = x + CLASS_WIDTH + ARROW_WIDTH;
        const sy = y + CLASS_HEIGHT / 2;
        const ex = ox;
        const ey = oy + CLASS_HEIGHT / 2;
        const jitter = ((ex / 11 + ey / 13) % MARGIN) - MARGIN / 2;
        g.drawLine(sx, sy, sx + MARGIN, sy);
        drawHVH(sx + MARGIN, ex - ARROW_WIDTH - MARGIN + jitter, sy, ey, g);
        g.drawLine(ex, ey, ex - ARROW_WIDTH - MARGIN + jitter, ey);
        g.drawOtherArrow(sx, sy);
    }
}
class RightRight {
    draw(g, x, y, ox, oy) {
        const sx = x + CLASS_WIDTH + ARROW_WIDTH;
        const sy = y + CLASS_HEIGHT / 2;
        const ex = ox + CLASS_WIDTH;
        const ey = oy + CLASS_HEIGHT / 2;
        const jitter = ((ex / 11 + ey / 13) % MARGIN) - MARGIN / 2;
        g.drawLine(sx, sy, sx + MARGIN + jitter, sy);
        drawHVH(sx + MARGIN + jitter, ex + MARGIN + ARROW_WIDTH + jitter, sy, ey, g);
        g.drawLine(ex, ey, ex + MARGIN + ARROW_WIDTH + jitter, ey);
        g.drawOtherArrow(sx, sy);
    }
}
class LeftLeft {
    draw(g, x, y, ox, oy) {
        const sx = x - ARROW_WIDTH;
        const sy = y + CLASS_HEIGHT / 2;
        const ex = ox - ARROW_WIDTH;
        const ey = oy + CLASS_HEIGHT / 2;
        const jitter = ((ex / 11 + ey / 13) % MARGIN) - MARGIN / 2;
        g.drawLine(sx, sy, sx - MARGIN + jitter, sy);
        drawHVH(sx - MARGIN + jitter, ex - MARGIN + jitter, sy, ey, g);
        g.drawLine(ex + ARROW_WIDTH, ey, ex - MARGIN + jitter, ey);
        g.drawOtherArrow(sx + ARROW_WIDTH, sy);
    }
}
class LeftRight {
    draw(g, x, y, ox, oy) {
        const sx = x - ARROW_WIDTH;
        const sy = y + CLASS_HEIGHT / 2;
        const ex = ox + CLASS_WIDTH;
        const ey = oy + CLASS_HEIGHT / 2;
        const jitter = ((ex / 11 + ey / 13) % MARGIN) - MARGIN / 2;
        g.drawLine(sx, sy, sx - MARGIN, sy);
        drawHVH(sx - MARGIN, ex + MARGIN + ARROW_WIDTH + jitter, sy, ey, g);
        g.drawLine(ex, ey, ex + MARGIN + ARROW_WIDTH + jitter, ey);
        g.drawOtherArrow(sx + ARROW_WIDTH, sy);
    }
}
function drawHVH(sx, ex, sy, ey, g) {
    const width = sx - ex;
    const height = sy - ey;
    let mid;
    if (height < 0)
        mid = ey - CLASS_HEIGHT / 2 - MARGIN - ARROW_HEIGHT;
    else if (height > 0)
        mid = ey + CLASS_HEIGHT / 2 + MARGIN + ARROW_HEIGHT;
    else
        mid = sy;
    g.drawLine(sx, sy, sx, mid);
    g.drawLine(sx, mid, ex, mid);
    g.drawLine(ex, mid, ex, ey);
}
class Box {
    constructor(x, y, name) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.impls = [];
        this.comps = [];
        this.indegree = 0;
    }
    draw(g) {
        g.drawRect(this.x, this.y, CLASS_WIDTH, CLASS_HEIGHT);
        g.drawTextCentered(this.name, this.x + CLASS_WIDTH / 2, this.y + FONT_SIZE + MARGIN);
        if (this.indegree > 0)
            g.drawTextCentered("<<interface>>", this.x + CLASS_WIDTH / 2, this.y - MARGIN);
        this.impls.forEach(x => this.drawImpl(g, x));
        this.comps.forEach(x => x.connection.draw(g, this.x, this.y, diagram[x.other].x, diagram[x.other].y));
    }
    drawImpl(g, other) {
        const sx = this.x + CLASS_WIDTH / 2;
        const sy = this.y;
        const ex = diagram[other].x + CLASS_WIDTH / 2;
        const ey = diagram[other].y + CLASS_HEIGHT + ARROW_HEIGHT;
        this.drawHVH(sx, ex, sy, ey, g);
        g.drawUpArrow(ex, ey);
    }
    drawHVH(sx, ex, sy, ey, g) {
        const width = sx - ex;
        const height = sy - ey;
        let mid = sy - MARGIN;
        g.drawDashedLine(sx, sy, sx, mid);
        g.drawDashedLine(sx, mid, ex, mid);
        g.drawDashedLine(ex, mid, ex, ey);
    }
    drawVHV(sx, ex, sy, ey, g) {
        const width = sx - ex;
        const height = sy - ey;
        g.drawLine(sx, sy, sx - width / 2, sy);
        g.drawLine(sx - width / 2, sy, sx - width / 2, ey);
        g.drawLine(sx - width / 2, ey, ex, ey);
    }
    contains(g, x, y) {
        return g.contains(x, y, this.x, this.y, CLASS_WIDTH, CLASS_HEIGHT);
    }
    addImplements(name) {
        this.impls.push(name);
        diagram[name].indegree++;
    }
    addComposed(other, connection) {
        this.comps.push({ other, connection });
    }
    moveBy(x, y) {
        this.x += x - (x % MARGIN); // TOdo: map to screen
        this.y += y - (y % MARGIN);
    }
}
let diagram = {};
/*
diagram["Context"] = new Box(100, 100, "Context");
diagram["Strategy"] = new Box(250, 100, "Strategy");
diagram["A"] = new Box(180, 230, "A");
diagram["B"] = new Box(320, 230, "B");
diagram["A"].addImplements("Strategy");
diagram["B"].addImplements("Strategy");
diagram["Context"].addComposed("Strategy");
//*/
//*
diagram["Observer"] = new Box(50, 200, "Observer");
diagram["Rapid"] = new Box(350, 200, "Rapid");
diagram["UIObserver"] = new Box(150, 300, "UIObserver");
diagram["UIFacade"] = new Box(350, 300, "UIFacade");
diagram["UI"] = new Box(550, 300, "UI");
diagram["BObserver"] = new Box(150, 400, "BObserver");
diagram["BFacade"] = new Box(350, 400, "BFacade");
diagram["BClass"] = new Box(550, 400, "BClass");
diagram["AObserver"] = new Box(150, 500, "AObserver");
diagram["AFacade"] = new Box(350, 500, "AFacade");
diagram["AClass"] = new Box(550, 500, "AClass");
diagram["AnotherClass"] = new Box(550, 600, "AnotherClass");
diagram["Rapid"].addComposed("UIObserver", new LeftLeft());
diagram["Rapid"].addComposed("AObserver", new LeftLeft());
diagram["Rapid"].addComposed("BObserver", new LeftLeft());
diagram["AObserver"].addComposed("AFacade", new RightLeft());
diagram["BObserver"].addComposed("BFacade", new RightLeft());
diagram["UIObserver"].addComposed("UIFacade", new RightLeft());
diagram["UIFacade"].addComposed("UI", new RightLeft());
diagram["AFacade"].addComposed("AClass", new RightLeft());
diagram["AFacade"].addComposed("AnotherClass", new RightLeft());
diagram["BFacade"].addComposed("BClass", new RightLeft());
diagram["UIObserver"].addImplements("Observer");
diagram["AObserver"].addImplements("Observer");
diagram["BObserver"].addImplements("Observer");
diagram["UI"].addComposed("Rapid", new RightRight());
diagram["AClass"].addComposed("Rapid", new RightRight());
diagram["AnotherClass"].addComposed("Rapid", new RightRight());
diagram["BClass"].addComposed("Rapid", new RightRight());
//*/
/*
diagram["UIFacade"] = new Box(350, 200, "UIFacade");
diagram["UI"] = new Box(550, 200, "UI");
diagram["AFacade"] = new Box(550, 400, "AFacade");
diagram["BFacade"] = new Box(550, 300, "BFacade");
diagram["BClass"] = new Box(350, 300, "BClass");
diagram["AClass"] = new Box(350, 400, "AClass");
diagram["AnotherClass"] = new Box(350, 500, "AnotherClass");
diagram["UIFacade"].addComposed("UI", new RightLeft());
diagram["BFacade"].addComposed("BClass", new LeftRight());
diagram["AFacade"].addComposed("AClass", new LeftRight());
diagram["AFacade"].addComposed("AnotherClass", new LeftRight());
diagram["AClass"].addComposed("UIFacade", new LeftLeft());
diagram["AnotherClass"].addComposed("UIFacade", new LeftLeft());
diagram["BClass"].addComposed("UIFacade", new LeftLeft());
diagram["BClass"].addComposed("AFacade", new LeftRight());
diagram["UI"].addComposed("AFacade", new RightRight());
diagram["UI"].addComposed("BFacade", new RightRight());
//*/
/*
diagram["UI"] = new Box(350, 200, "UI");
diagram["AClass"] = new Box(350, 400, "AClass");
diagram["AnotherClass"] = new Box(350, 100, "AnotherClass");
diagram["BClass"] = new Box(350, 300, "BClass");
diagram["UI"].addComposed("AClass", new RightRight());
diagram["UI"].addComposed("AnotherClass", new RightRight());
diagram["UI"].addComposed("BClass", new RightRight());
diagram["AClass"].addComposed("UI", new LeftLeft());
diagram["AnotherClass"].addComposed("UI", new LeftLeft());
diagram["BClass"].addComposed("UI", new LeftLeft());
diagram["BClass"].addComposed("AClass", new LeftRight());
//*/
const canvas = document.getElementById("main");
let ctx = canvas.getContext("2d");
let g = new Graphics(ctx);
let selected = undefined;
/*
canvas.addEventListener("click", evt => {
  selected = Object.values(diagram).find(x =>
    x.contains(g, evt.clientX, evt.clientY)
  );
  // console.log(evt.clientX, evt.clientY);
  let name = window.prompt("Name");
  if (!name) return;
  diagram[name] = new Box(
    evt.clientX - (evt.clientX % GRID_SIZE),
    evt.clientY - (evt.clientY % GRID_SIZE),
    name
  );
  redraw();
});
*/
let startx = 0;
let starty = 0;
canvas.addEventListener("mousedown", evt => {
    selected = Object.values(diagram).find(x => x.contains(g, evt.clientX, evt.clientY));
    startx = evt.clientX;
    starty = evt.clientY;
    if (selected !== undefined)
        console.log(selected.name);
});
canvas.addEventListener("mouseup", evt => {
    if (selected !== undefined) {
        let movedx = evt.clientX - startx;
        let movedy = evt.clientY - starty;
        selected.moveBy(movedx, movedy);
        redraw();
    }
});
function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Object.keys(diagram).forEach(x => diagram[x].draw(g));
}
redraw();
