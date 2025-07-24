// vim: sw=2
//
function create_line({ ax, ay, a_open = false, bx, by, b_open = false }) {
  return {
    a: { x: ax, y: ay, open: a_open },
    b: { x: bx, y: by, open: b_open },
    points: function () {
      const p1 = createVector(this.a.x, this.a.y);
      const p2 = createVector(this.b.x, this.b.y);
      const v = p2.copy().sub(p1).setMag(state.diag);
      if (this.a.open) p1.sub(v);
      if (this.b.open) p2.add(v);
      return [p1.x, p1.y, p2.x, p2.y];
    },

    intersection: function(other) {
      const xa = this.a.x;
      const ya = this.a.y;
      const xb = this.b.x;
      const yb = this.b.y;
      const xc = other.a.x;
      const yc = other.a.y;
      const xd = other.b.x;
      const yd = other.b.y;
      const den_0 = (xb-xa) * (yd-yc) - (yb-ya) * (xd-xc);
      if (den_0 == 0) {
        return null;
      }
      const num_0 = (ya-yc) * (xd-xc) - (xa-xc) * (yd-yc);
      const num_1 = (yc-ya) * (xb-xa) - (xc-xa) * (yb-ya);
      // // const den_1 = (xd-xc) * (yb-ya) - (yd-yc) * (xb-xa);
      // const den_1 = -den_0;
      const t0 = num_0 / den_0;
      const t1 = -(num_1 / den_0);
      return [t0, t1];
    },

    lerp: function (t) {
      return createVector((1-t) * this.a.x + t * this.b.x, (1-t) * this.a.y + t * this.b.y);
    }
  };
}

let state = { }

function setup() {
  // state.sensor = {
  //   from: {
  //     x: 100,
  //     y: 100,
  //   },
  //   to: {
  //     x: 100,
  //     y: 200,
  //   },
  // };
  createCanvas(windowWidth, windowHeight);
  strokeWeight(5);
  const margin = windowWidth * 0.2;
  state.la = create_line({ax: margin, ay: windowHeight / 2, bx: windowWidth-margin, by: windowHeight / 2});
  state.lb = create_line({ax: windowWidth / 2, ay: windowHeight / 4, bx: mouseX, by: mouseY});
  colorMode(HSB);
}

function draw() {
  background(220, 0, 75);
  // state.lb = create_line({ax: windowWidth / 2, ay: windowHeight / 4, bx: mouseX, by: mouseY});
  state.lb.b = {x: mouseX, y: mouseY};
  // line(
  //   state.sensor.from.x,
  //   state.sensor.from.y,
  //   state.sensor.to.x,
  //   state.sensor.to.y
  // );
  // circle(mouseX, mouseY, 20);

  const ts = state.la.intersection(state.lb);
  if (ts != null) {
    const [ta, tb] = ts;
    va = state.la.lerp(ta);
    vb = state.lb.lerp(tb);
    push();
    stroke(250, 75, 75);
    strokeWeight(60);
    point(va.x, va.y);
    stroke(200, 75, 75);
    strokeWeight(30);
    point(vb.x, vb.y);
    pop();

    push();
    drawingContext.setLineDash([10, 10]);
    stroke(90, 75, 75);
    if (ta < 0) { line(state.la.a.x, state.la.a.y, va.x, va.y); }
    if (tb < 0) { line(state.lb.a.x, state.lb.a.y, vb.x, vb.y); }
    stroke(0, 75, 75);
    if (ta > 1) { line(state.la.b.x, state.la.b.y, va.x, va.y); }
    if (tb > 1) { line(state.lb.b.x, state.lb.b.y, vb.x, vb.y); }
    pop();
  }
  line(...state.la.points());
  line(...state.lb.points());

}
