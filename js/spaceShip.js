import { displayLoseMessage, displayWinMessage, displayBossFightMessage } from './messages.js';
import {bossLogic,} from './boss.js'

let canShoot = true;
const bulletCooldown = 1000; 
let bulletCount = 0;
let bossCreated = false;

export function createPlayer(app) {
  let player = PIXI.Sprite.from("images/spaceship.png");
  player.anchor.set(1);

  const centerX = app.view.width / 2;
  const centerY = app.view.height;

  player.x = centerX;
  player.y = centerY;

  player.width = 255;
  player.height = 113;

  app.stage.addChild(player);
  return player;
}

export function handlePlayerMovement(player, app) {
  const movementSpeed = 10;

  const keys = {};
  window.addEventListener('keydown', event => {
      keys[event.key] = true;
  });

  window.addEventListener('keyup', event => {
      keys[event.key] = false;
  });


  app.ticker.add(() => {
      if (keys['ArrowLeft'] ) {
          if (player.x - movementSpeed - player.width >= 0) {
              player.x -= movementSpeed;
          }
      }
      if (keys['ArrowRight']) {
          if (player.x + movementSpeed < app.view.width) {
              player.x += movementSpeed;
          }
      }
  });
}

export function createBullet(app, player) {

  if (!canShoot) return null; 

  const bullet = new PIXI.Graphics();
  bullet.beginFill(0xFFFFFF); 
  bullet.drawRect(-2, -10, 4, 10); 
  bullet.endFill();
  bullet.position.set(player.x - player.width / 2, player.y - player.height);
  app.stage.addChild(bullet);

  canShoot = false;

  setTimeout(() => {
    canShoot = true; 
  }, bulletCooldown);
  //const sound = PIXI.sound.Sound.from('spunds/bullet.mp3');
  //sound.play();

  return bullet; 
}


export function handleBulletMovement(bullet, app, asteroids, blll, player) {
  const bulletSpeed = 10;


  const bulletMovementTicker = app.ticker.add(moveBullet);

  function moveBullet() {
    if (bullet.collided) {
      return;
    }

    bullet.y -= bulletSpeed;

    asteroids = asteroids.filter(asteroid => app.stage.children.includes(asteroid));
   
    asteroids.forEach(asteroid => {
      if (!bullet.collided && checkCollision(bullet, asteroid)) {
        app.stage.removeChild(asteroid);
        app.stage.removeChild(bullet);

        const index = blll.indexOf(bullet);
        if (index !== -1) {
          blll.splice(index, 1);
        }

        app.ticker.remove(bulletMovementTicker);
        bullet.collided = true;

        if (asteroids.length === 1 && bulletCount <= 10) {
          console.log('YOU WIN');
          displayBossFightMessage(app);
          if (!bossCreated) { 
            bossCreated = true; 
            bossLogic(app, blll, player); 
          }

          bulletCount = 0;
          timeLeft = 60;
          startTimer(app, asteroids);
          

        }
      }
    });
    //console.log('Asteroid: ' + asteroids.length)
    //console.log("Bullets: " + bulletCount)

    if (asteroids.length > 1 && bulletCount === 10) {
      console.log('YOU LOSE');
      displayLoseMessage(app);
    }


    if (bullet.y < -bullet.height) {
      app.stage.removeChild(bullet);

      const index = blll.indexOf(bullet);
      if (index !== -1) {
        blll.splice(index, 1);
      }

      app.ticker.remove(bulletMovementTicker);
    }

    updateBulletCount();
  }
}



export function handleShootingEvent(app, player, asteroids) {
    let blll = []
    window.addEventListener('keydown', event => {
      if (event.key === ' ' && canShoot) { 
        if (bulletCount < 10) {
          const bullet = createBullet(app, player);
          blll.push(bullet);
          handleBulletMovement(bullet, app, asteroids, blll, player);
          bulletCount++;
        }
      }
    });
}


function checkCollision(bullet, asteroid) {

  const bulletBounds = {
    left: bullet.x - bullet.width / 2,
    right: bullet.x + bullet.width / 2,
    top: bullet.y - bullet.height / 2,
    bottom: bullet.y + bullet.height / 2
  };

  const asteroidBounds = {
    left: asteroid.x - asteroid.width / 2,
    right: asteroid.x + asteroid.width / 2,
    top: asteroid.y - asteroid.height / 2,
    bottom: asteroid.y + asteroid.height / 2
  };

  // Check for collision
  return bulletBounds.left < asteroidBounds.right &&
         bulletBounds.right > asteroidBounds.left &&
         bulletBounds.top < asteroidBounds.bottom &&
         bulletBounds.bottom > asteroidBounds.top;
}



export const bulletCountDisplay = new PIXI.Text(`Bullets: ${bulletCount}/10`, {
  fontFamily: 'Arial',
  fontSize: 24,
  fill: 'white'
});


export function updateBulletCount() {
  bulletCountDisplay.text = `Bullets: ${bulletCount}/10`;
}


let timerDisplay = new PIXI.Text('Time: 60', { fontFamily: 'Arial', fontSize: 24, fill: 0xffffff });
let timeLeft = 60;
let timerInterval;

export function startTimer(app, asteroids) {
    timerInterval = setInterval(() => {
        timeLeft--
        if (timeLeft <= 0) {
            clearInterval(timerInterval)
            displayLoseMessage(app)
            resetTimer()
            canShoot = false
        } else {
            timerDisplay.text = `Time: ${timeLeft}`
        }
        if (asteroids.length === 0) {
            clearInterval(timerInterval)
            displayWinMessage(app)
            resetTimer()
            canShoot = false
        }
    }, 1000)
    
    timerDisplay.position.set(app.view.width - timerDisplay.width - 10, 10);
    app.stage.addChild(timerDisplay)
}

export function resetTimer() {
  clearInterval(timerInterval)
}

