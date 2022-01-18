import User from './user.js';

export default class Player extends User {
  constructor(ctx, coordinates, socket) {
    super(ctx, coordinates);

    this.socket = socket;

    this.draw();

    this.#initMovement();
  }

  #initMovement() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'w') {
        this.#emitMovenemt('y', -4);
      }
      if (e.key === 's') {
        this.#emitMovenemt('y', 4);
      }
      if (e.key === 'a') {
        this.#emitMovenemt('x', -4);
      }
      if (e.key === 'd') {
        this.#emitMovenemt('x', 4);
      }
    });
  }

  #emitMovenemt(axis, value) {
    this.coordinates[axis] += value;
    this.socket.emit('user-moved', this.coordinates);
  }
}
