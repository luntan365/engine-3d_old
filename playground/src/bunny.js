(() => {
  const app = window.app;
  const cc = window.cc;
  const { quat } = cc.math;

  class BunnyComponent extends cc.ScriptComponent {
    constructor() {
      super();

      this.speedX = 0.0;
      this.speedY = 0.0;
      this.widget = null;
    }

    start() {
      this.widget = this._entity.getComp('Widget');
    }

    update() {
      let widget = this.widget;

      widget.offsetX = widget.offsetX + this.speedX;
      widget.offsetY = widget.offsetY - this.speedY;
      this.speedY += gravity;

      if (widget.offsetX > screenX) {
        this.speedX *= -1;
        widget.offsetX = screenX;
      }
      else if (widget.offsetX < minX) {
        this.speedX *= -1;
        widget.offsetX = minX;
      }

      if (widget.offsetY < 0) {
        this.speedY *= -0.85;
        widget.offsetY = minY;
        if (Math.random() > 0.5) {
          this.speedY -= Math.random() * 6;
        }
      }
      else if (widget.offsetY > screenY) {
        this.speedY *= -1;
        widget.offsetY = screenY;
      }
    }
  }
  app.registerClass('Bunny', BunnyComponent);

  function createBunny () {
    let entity = app.createEntity(`bunny-${bunnyCounts}`);
    quat.fromEuler(entity.lrot, 0, 0, Math.random() * 90 - 45);
    entity.setParent(screen);

    let bunny = entity.addComp('Bunny');
    bunny.speedX = Math.random() * 10;
    bunny.speedY = (Math.random() * 10) - 5;

    let widget = entity.addComp('Widget');
    widget.width = Math.random() * 15 + 15;
    widget.height = widget.width;
    widget.setAnchors(0, 0, 0, 0);
    widget.offsetX = minX + 10;
    widget.offsetY = screenY * 0.7;

    let imageCmp = entity.addComp('Image');
    imageCmp.sprite = bunnyTexture._sprites[bunnyIDs[count % 5]];
    imageCmp.scale = 0.5 + Math.random() * 0.5;
    imageCmp.rotation = 360 * (Math.random() * 0.2 - 0.1);
  }

  let screen = app.createEntity('screen');
  screen.addComp('Screen');

  let bunnyTexture = null;
  let screenX = app._canvas.width;
  let minX = 0;
  let screenY = app._canvas.height;
  let minY = 0;
  let gravity = 0.5;
  let bunnyIDs = [
    'bunnys_0',
    'bunnys_1',
    'bunnys_2',
    'bunnys_3',
    'bunnys_4',
  ];
  let count = 0;
  let bunnyCounts = 0;

  app.assets.loadUrls('texture', {
    json: './assets/sprites/bunny.json',
    image: './assets/sprites/bunny.png'
  }, (err, texture) => {
    bunnyTexture = texture;

    for (let i = 0; i < 2; ++i) {
      createBunny();
      bunnyCounts += 1;
    }
  });

  app.on('tick', () => {
    screenX = app._canvas.width;
    screenY = app._canvas.height;

    // update keyboard states
    let cnt = 0;
    for (let name in app.input._keyboard) {
      let state = app.input._keyboard[name];
      if (state === 1) {
        cnt += 1;
      }
    }

    if (app.input.mousedown('left')) {
      count++;
    }

    if (app.input.mousepress('left')) {
      if (bunnyTexture) {
        for (let i = 0; i < 5; i++) {
          createBunny();
          bunnyCounts += 1;
        }
      }
    }
  });
})();