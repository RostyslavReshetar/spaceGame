
export function createAsteroids(app, player) {
  const asteroids = [];

  for (let i = 0; i < 10; i++) {
    const asteroid = PIXI.Sprite.from("images/asteroid.png");
    asteroid.anchor.set(0.5); 
    
    asteroid.x = Math.random() * (app.renderer.width - asteroid.width) + asteroid.width / 2;
    asteroid.y = Math.random() * (app.renderer.height - player.height * 1.5 - asteroid.height ) + asteroid.height / 2;

    asteroid.vx = (Math.random() - 0.5) * 2; 
    asteroid.vy = Math.random() * 0.2 + 0.8; 
    
    app.stage.addChild(asteroid);
    asteroids.push(asteroid);
  }

  return asteroids;
}


export function handleAsteroidMovement(app, asteroids) {
  const horizontalSpeedMultiplier = 2; 

  asteroids.forEach(asteroid => {

    asteroid.x += asteroid.vx * horizontalSpeedMultiplier;

    if (asteroid.x > app.renderer.width + asteroid.width / 2) {
      asteroid.x = -asteroid.width / 2;
    } else if (asteroid.x < -asteroid.width / 2) {
      asteroid.x = app.renderer.width + asteroid.width / 2;
    }
  });
}

