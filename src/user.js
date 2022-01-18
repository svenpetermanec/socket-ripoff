export default class User {
  constructor(ctx, coordinates, id) {
    this.coordinates = {
      x: coordinates.x,
      y: coordinates.y,
    };

    this.ctx = ctx;
    this.id = id;

    if (id) {
      this.draw();
    }
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.coordinates.x, this.coordinates.y, 25, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  delete() {
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.arc(this.coordinates.x, this.coordinates.y, 26, 0, 2 * Math.PI);
    this.ctx.fill();
  }
}
