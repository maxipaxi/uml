const CLASS_WIDTH = 100;
const CLASS_HEIGHT = 60;
const ARROW_WIDTH = 20;
const ARROW_HEIGHT = 10;
const GRID_SIZE = 20;
const FONT_SIZE = 13;
const MARGIN = 10;

String.prototype.hashCode = function() {
  var hash = 0,
    i,
    chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

class Graphics {
  private zoom = 1;
  private offsetx = 0;
  private offsety = 0;
  constructor(private ctx: CanvasRenderingContext2D) {}
  public drawRect(x: number, y: number, w: number, h: number) {
    this.ctx.strokeRect(this.mapx(x), this.mapy(y), this.mapw(w), this.maph(h));
  }
  public fillRect(x: number, y: number, w: number, h: number) {
    this.ctx.fillRect(this.mapx(x), this.mapy(y), this.mapw(w), this.maph(h));
  }
  public drawLine(sx: number, sy: number, ex: number, ey: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.mapx(sx), this.mapy(sy));
    this.ctx.lineTo(this.mapx(ex), this.mapy(ey));
    ctx.stroke();
  }
  public drawDashedLine(sx: number, sy: number, ex: number, ey: number) {
    this.ctx.beginPath();
    this.ctx.setLineDash([6, 4]);
    this.ctx.moveTo(this.mapx(sx), this.mapy(sy));
    this.ctx.lineTo(this.mapx(ex), this.mapy(ey));
    ctx.stroke();
    this.ctx.setLineDash([]);
  }
  public drawUpArrow(x: number, y: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.mapx(x), this.mapy(y) - this.maph(ARROW_HEIGHT));
    this.ctx.lineTo(this.mapx(x) - this.mapw(ARROW_WIDTH) / 2, this.mapy(y));
    this.ctx.lineTo(this.mapx(x) + this.mapw(ARROW_WIDTH) / 2, this.mapy(y));
    this.ctx.lineTo(this.mapx(x), this.mapy(y) - this.maph(ARROW_HEIGHT));
    ctx.stroke();
  }
  public drawOtherArrow(x: number, y: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.mapx(x), this.mapy(y));
    this.ctx.lineTo(
      this.mapx(x) - this.mapw(ARROW_WIDTH) / 2,
      this.mapy(y) + this.maph(ARROW_HEIGHT) / 2
    );
    this.ctx.lineTo(this.mapx(x) - this.mapw(ARROW_WIDTH), this.mapy(y));
    this.ctx.lineTo(
      this.mapx(x) - this.mapw(ARROW_WIDTH) / 2,
      this.mapy(y) - this.maph(ARROW_HEIGHT) / 2
    );
    this.ctx.lineTo(this.mapx(x), this.mapy(y));
    ctx.stroke();
  }
  public drawTextCentered(text: string, x: number, y: number) {
    this.ctx.fillStyle = "black";
    this.ctx.font = Math.round(FONT_SIZE * this.zoom) + "px Courier";
    this.ctx.fillText(
      text,
      this.mapx(x) - this.ctx.measureText(text).width / 2,
      this.mapy(y)
    );
  }
  public drawText(text: string, x: number, y: number) {
    this.ctx.fillStyle = "black";
    this.ctx.font = Math.round(FONT_SIZE * this.zoom) + "px Courier";
    this.ctx.fillText(text, this.mapx(x), this.mapy(y));
  }
  public contains(
    x: number,
    y: number,
    sx: number,
    sy: number,
    w: number,
    h: number
  ) {
    return (
      this.mapx(sx) <= x &&
      x < this.mapx(sx) + this.mapw(w) &&
      this.mapy(sy) <= y &&
      y < this.mapy(sy) + this.maph(h)
    );
  }
  public setColor(c: string) {
    let grd = this.ctx.createLinearGradient(
      0,
      0,
      canvas.width + 500,
      canvas.width + 500
    );
    grd.addColorStop(0, "white");
    grd.addColorStop(1, c);
    this.ctx.fillStyle = grd;
    this.ctx.strokeStyle = c;
  }
  private mapx(x: number) {
    return x * this.zoom - this.offsetx;
  }
  private mapy(y: number) {
    return y * this.zoom - this.offsety;
  }
  private mapw(w: number) {
    return w * this.zoom;
  }
  private maph(h: number) {
    return h * this.zoom;
  }
}

interface Connection {
  draw(g: Graphics, x: number, y: number, ox: number, oy: number): void;
}
class RightLeft implements Connection {
  public draw(g: Graphics, x: number, y: number, ox: number, oy: number) {
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

class RightRight implements Connection {
  public draw(g: Graphics, x: number, y: number, ox: number, oy: number) {
    const sx = x + CLASS_WIDTH + ARROW_WIDTH;
    const sy = y + CLASS_HEIGHT / 2;
    const ex = ox + CLASS_WIDTH;
    const ey = oy + CLASS_HEIGHT / 2;
    const jitter = ((ex / 11 + ey / 13) % MARGIN) - MARGIN / 2;
    g.drawLine(sx, sy, sx + MARGIN + jitter, sy);
    drawHVH(
      sx + MARGIN + jitter,
      ex + MARGIN + ARROW_WIDTH + jitter,
      sy,
      ey,
      g
    );
    g.drawLine(ex, ey, ex + MARGIN + ARROW_WIDTH + jitter, ey);
    g.drawOtherArrow(sx, sy);
  }
}

class LeftLeft implements Connection {
  public draw(g: Graphics, x: number, y: number, ox: number, oy: number) {
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

class LeftRight implements Connection {
  public draw(g: Graphics, x: number, y: number, ox: number, oy: number) {
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

function drawHVH(sx: number, ex: number, sy: number, ey: number, g: Graphics) {
  const width = sx - ex;
  const height = sy - ey;
  let mid;
  if (height < 0) mid = ey - CLASS_HEIGHT / 2 - MARGIN - ARROW_HEIGHT;
  else if (height > 0) mid = ey + CLASS_HEIGHT / 2 + MARGIN + ARROW_HEIGHT;
  else mid = sy;
  g.drawLine(sx, sy, sx, mid);
  g.drawLine(sx, mid, ex, mid);
  g.drawLine(ex, mid, ex, ey);
}

class Box {
  private impls: string[] = [];
  private comps: { other: string; connection: Connection }[] = [];
  private indegree: number = 0;
  constructor(
    private x: number,
    private y: number,
    public name: string,
    private color = "#000000"
  ) {}
  public draw(g: Graphics) {
    g.setColor(this.color);
    g.fillRect(this.x, this.y, CLASS_WIDTH, CLASS_HEIGHT);
    g.setColor("black");
    g.drawRect(this.x, this.y, CLASS_WIDTH, CLASS_HEIGHT);
    g.drawTextCentered(
      this.name,
      this.x + CLASS_WIDTH / 2,
      this.y + FONT_SIZE + MARGIN
    );
    if (this.indegree > 0)
      g.drawTextCentered(
        "<<interface>>",
        this.x + CLASS_WIDTH / 2,
        this.y - MARGIN
      );
    g.setColor(this.color);
    this.impls.forEach(x => this.drawImpl(g, x));
    this.comps.forEach(x =>
      x.connection.draw(
        g,
        this.x,
        this.y,
        diagram[x.other].x,
        diagram[x.other].y
      )
    );
  }
  private drawImpl(g: Graphics, other: string) {
    const sx = this.x + CLASS_WIDTH / 2;
    const sy = this.y;
    const ex = diagram[other].x + CLASS_WIDTH / 2;
    const ey = diagram[other].y + CLASS_HEIGHT + ARROW_HEIGHT;
    this.drawHVH(sx, ex, sy, ey, g);
    g.drawUpArrow(ex, ey);
  }

  private drawHVH(sx: number, ex: number, sy: number, ey: number, g: Graphics) {
    const width = sx - ex;
    const height = sy - ey;
    let mid = sy - MARGIN;
    g.drawDashedLine(sx, sy, sx, mid);
    g.drawDashedLine(sx, mid, ex, mid);
    g.drawDashedLine(ex, mid, ex, ey);
  }

  private drawVHV(sx: number, ex: number, sy: number, ey: number, g: Graphics) {
    const width = sx - ex;
    const height = sy - ey;
    g.drawLine(sx, sy, sx - width / 2, sy);
    g.drawLine(sx - width / 2, sy, sx - width / 2, ey);
    g.drawLine(sx - width / 2, ey, ex, ey);
  }

  public contains(g: Graphics, x: number, y: number) {
    return g.contains(x, y, this.x, this.y, CLASS_WIDTH, CLASS_HEIGHT);
  }
  public addImplements(name: string) {
    this.impls.push(name);
    diagram[name].indegree++;
  }
  public addComposed(other: string, connection: Connection) {
    this.comps.push({ other, connection });
  }
  public moveBy(x: number, y: number) {
    this.x += x - (x % 50); // TOdo: map to screen
    this.y += y - (y % 50);
  }
}

let diagram: { [key: string]: Box } = {};
/*
Context<>-Strategy
A- ->Strategy
B- ->Strategy
*/
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
diagram["Message Queue"] = new Box(350, 200, "Message Queue");
diagram["UIObserver"] = new Box(150, 300, "UIObserver", "#0000cc");
diagram["UIFacade"] = new Box(350, 300, "UIFacade", "#0000cc");
diagram["UI"] = new Box(550, 300, "UI", "#0000cc");
diagram["BObserver"] = new Box(150, 400, "BObserver", "#00cc00");
diagram["BFacade"] = new Box(350, 400, "BFacade", "#00cc00");
diagram["BClass"] = new Box(550, 400, "BClass", "#00cc00");
diagram["AObserver"] = new Box(150, 500, "AObserver", "#cc0000");
diagram["AFacade"] = new Box(350, 500, "AFacade", "#cc0000");
diagram["AClass"] = new Box(550, 500, "AClass", "#cc0000");
diagram["AnotherClass"] = new Box(550, 600, "AnotherClass", "#cc0000");
diagram["Message Queue"].addComposed("UIObserver", new LeftLeft());
diagram["Message Queue"].addComposed("AObserver", new LeftLeft());
diagram["Message Queue"].addComposed("BObserver", new LeftLeft());
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
diagram["UI"].addComposed("Message Queue", new RightRight());
diagram["AClass"].addComposed("Message Queue", new RightRight());
diagram["AnotherClass"].addComposed("Message Queue", new RightRight());
diagram["BClass"].addComposed("Message Queue", new RightRight());
//*/
/*
diagram["UIFacade"] = new Box(350, 200, "UIFacade", "#0000cc");
diagram["UI"] = new Box(550, 200, "UI", "#0000cc");
diagram["AFacade"] = new Box(550, 400, "AFacade", "#cc0000");
diagram["BFacade"] = new Box(550, 300, "BFacade", "#00cc00");
diagram["BClass"] = new Box(350, 300, "BClass", "#00cc00");
diagram["AClass"] = new Box(350, 400, "AClass", "#cc0000");
diagram["AnotherClass"] = new Box(350, 500, "AnotherClass", "#cc0000");
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
diagram["UI"] = new Box(350, 200, "UI", "#0000cc");
diagram["AClass"] = new Box(350, 400, "AClass", "#cc0000");
diagram["AnotherClass"] = new Box(350, 100, "AnotherClass", "#cc0000");
diagram["BClass"] = new Box(350, 300, "BClass", "#00cc00");
diagram["UI"].addComposed("AClass", new RightRight());
diagram["UI"].addComposed("AnotherClass", new RightRight());
diagram["UI"].addComposed("BClass", new RightRight());
diagram["AClass"].addComposed("UI", new LeftLeft());
diagram["AnotherClass"].addComposed("UI", new LeftLeft());
diagram["BClass"].addComposed("UI", new LeftLeft());
diagram["BClass"].addComposed("AClass", new LeftRight());
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
/*
Context<>-Strategy
A-->Strategy
B-->Strategy
*/
function updateDiagram() {
  Object.keys(diagram).forEach(x => delete diagram[x]);
  const confElem = document.getElementById("conf") as HTMLTextAreaElement;
  const conf = confElem.value.replace(/ /g, "").split("\n");
  conf.forEach(x => {
    if (!x) return;
    let boxes = x.split(/<>-|-->/);
    console.log(boxes);
    let lname = boxes[0].match(/(.*?),|.*/)![0];
    parseBox(boxes[0], lname);
    let rname = boxes[1].match(/(.*?),|.*/)![0];
    parseBox(boxes[1], rname);
    if (x.indexOf("<>-") >= 0) {
      diagram[lname].addComposed(rname, new RightLeft());
    } else if (x.indexOf("-->") >= 0) {
      diagram[lname].addImplements(rname);
    }
  });
  redraw();
}

const imgElem = document.getElementById("output") as HTMLImageElement;
const canvas = document.getElementById("main") as HTMLCanvasElement;
let ctx = canvas.getContext("2d")!;
let g = new Graphics(ctx);
let selected: Box | undefined = undefined;
let startx = 0;
let starty = 0;
canvas.addEventListener("mousedown", evt => {
  selected = Object.values(diagram).find(x =>
    x.contains(g, evt.clientX, evt.clientY)
  );
  startx = evt.clientX;
  starty = evt.clientY;
  if (selected !== undefined) console.log(selected.name);
});
canvas.addEventListener("mouseup", evt => {
  if (selected !== undefined) {
    let movedx = evt.clientX - startx;
    let movedy = evt.clientY - starty;
    selected.moveBy(movedx, movedy);
    redraw();
  }
});

function parseBox(box: string, name: string) {
  if (diagram[name] !== undefined) return;
  let pos = box.match(/\d+/g);
  let colorMatch = box.match(/#....../);
  let color = undefined;
  if (colorMatch !== null) color = colorMatch[0];
  let posx = 100 * Object.keys(diagram).length;
  let posy = 100 * Object.keys(diagram).length;
  if (pos && pos.length === 2) {
    posx = +pos[0];
    posy = +pos[1];
  }
  let lbox = new Box(posx, posy, name, color);
  diagram[name] = lbox;
}

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  Object.keys(diagram).forEach(x => diagram[x].draw(g));
  let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let minx = Number.MAX_VALUE;
  let miny = Number.MAX_VALUE;
  let maxx = Number.MIN_VALUE;
  let maxy = Number.MIN_VALUE;
  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      let pixel = data.data[(x + y * canvas.width) * 4 + 3];
      if (pixel !== 0) {
        if (minx > x) minx = x;
        if (miny > y) miny = y;
        if (maxx < x) maxx = x;
        if (maxy < y) maxy = y;
      }
    }
  }
  let hiddenCanvas = document.createElement("canvas");
  hiddenCanvas.width = maxx - minx;
  hiddenCanvas.height = maxy - miny;
  let hiddenCtx = hiddenCanvas.getContext("2d")!;
  console.log(minx, maxx, miny, maxy);
  hiddenCtx.drawImage(
    canvas,
    minx,
    miny,
    maxx - minx,
    maxy - miny,
    0,
    0,
    maxx - minx,
    maxy - miny
  );
  let img = hiddenCanvas.toDataURL("image/png");
  imgElem.src = img;
}
redraw();
