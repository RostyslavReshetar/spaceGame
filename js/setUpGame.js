

export function loadBackground(app) {
  let img = PIXI.Sprite.from("images/space.jpg");
  img.width = window.innerWidth;
  img.height = window.innerHeight;
  app.stage.addChild(img);
}