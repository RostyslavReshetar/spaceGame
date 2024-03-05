import { displayLoseMessage, displayWinMessage } from './messages.js';


let isBossFight = false; 
let bossHPBar = [];
let canShoot = true;
let isBossStopped = false; 

function createBoss(app) {
  const boss = PIXI.Sprite.from("images/bos.png"); 
  boss.anchor.set(0.5);
  boss.HP = 4;
  boss.x = app.view.width / 2;
  boss.y = 100;
  app.stage.addChild(boss);
  boss.vx = 2;
  return boss; 
}

function createBossHPBar(app, boss) {
  const barWidth = 60;
  const barHeight = 5;
  const barMargin = 5;
  const totalBars = boss.HP;

  for (let i = 0; i < totalBars; i++) {
    const hpBar = new PIXI.Graphics();
    hpBar.beginFill(0xFF0000); 
    hpBar.drawRect(0, 0, barWidth, barHeight);
    hpBar.endFill();
    hpBar.x = boss.x + (i - totalBars / 2) * (barWidth + barMargin);
    hpBar.y = boss.y + boss.height / 2 - 60;
    app.stage.addChild(hpBar);
    bossHPBar.push(hpBar);
  }
}

function updateBossHPBar(boss) {
  for (let i = 0; i < bossHPBar.length; i++) {
    const hpBar = bossHPBar[i];
    hpBar.visible = i < boss.HP; 
  }
}

function removeBossHPBar(app) {
  if (bossHPBar.length > 0) {
    const hpBar = bossHPBar.pop(); // Remove the last HP bar
    app.stage.removeChild(hpBar);
  }
}

function startBossMovement(app, boss) {

  if (!isBossStopped) {
    boss.x += boss.vx;

    if (boss.x > app.renderer.width + boss.width / 2) {
      boss.x = -boss.width / 2;
    } else if (boss.x < -boss.width / 2) {
      boss.x = app.renderer.width + boss.width / 2;
    }

    for (let i = 0; i < bossHPBar.length; i++) {
      const hpBar = bossHPBar[i];
      hpBar.x = boss.x + (i - boss.HP / 2) * (hpBar.width + 10);
    }
  } else {
   
    const direction = Math.random() < 0.5 ? -1 : 1; 
    boss.vx = boss.vx * direction; 

   
    setTimeout(() => {
      isBossStopped = false;
    }, 1000); 
  }
}

setInterval(() => {
  isBossStopped = true; // Встановлюємо флаг, що бос зупинений

  setTimeout(() => {
    isBossStopped = false; // Після 1 секунди відновлюємо рух боса
  }, 1000);
}, 5000);

function createBossBullet(app, boss) {

  if (!canShoot) return null; 

  const bullet = new PIXI.Graphics();
  bullet.beginFill(0xFFFFFF); 
  bullet.drawRect(-2, -10, 4, 10); 
  bullet.endFill();
  bullet.position.set(boss.x, boss.y);
  app.stage.addChild(bullet);
 
  canShoot = false;

  setTimeout(() => {
    canShoot = true; 
  }, 2000);


  return bullet; 
}


function handleBossBulletMovement(app, bullet, boss, playerBullets, player) {
  const bulletSpeed = 10;
  let hasHit = false; 
  app.ticker.add(moveBullet);


  function moveBullet() {
    bullet.y += bulletSpeed;

    // Remove the bullet if it goes out of the screen
    if (bullet.y < -bullet.height) {
      app.stage.removeChild(bullet);
      app.ticker.remove(moveBullet);

      // Remove the bullet from the array
      const index = playerBullets.indexOf(bullet);
      if (index !== -1) {
        playerBullets.splice(index, 1);
      }
    }

    // Remove the bullet if it goes out of the screen
    if (bullet.y > app.renderer.height + bullet.height) {
      app.stage.removeChild(bullet);
      app.ticker.remove(moveBullet);
    }

    if (checkPlayerCollision(bullet, player)) {
      console.log("Player hit by boss bullet!");
      app.stage.removeChild(bullet);
      app.ticker.remove(moveBullet);
      handlePlayerfDefeat(app, player)
    }

    


    if (!hasHit) {
      for (let i = 0; i < playerBullets.length; i++) {
        const playerBullet = playerBullets[i];

        if (playerBullet.y < -playerBullet.height) {
          app.stage.removeChild(playerBullet);
        }
        

        if (checkPlayerBulletCollision(bullet, playerBullet)) {
          console.log("BULLETS COLLAPS");
          app.stage.removeChild(playerBullet);
          playerBullets.splice(i, 1)
          app.stage.removeChild(bullet);
          app.ticker.remove(moveBullet);
        } 

        if (checkBossCollision(playerBullet, boss)) {
          console.log("Boss hit!");
          app.stage.removeChild(playerBullet);
          console.log(playerBullet.y) 
          playerBullets.splice(i, 1); 
          boss.HP--; 
          updateBossHPBar(boss); 

          if (boss.HP <= 0) {
            console.log("Boss defeated!");
            app.stage.removeChild(boss);
            app.stage.removeChild(bullet);
            app.ticker.remove(moveBullet);
            isBossFight = false; 
            displayWinMessage(app)
            while (bossHPBar.length > 0) {
              removeBossHPBar(app); 
            }
          }
          

          hasHit = true; 
          break; 
        }
      }
    }
  }
  
}

function checkBossCollision(bullet, boss) {
 
  const bulletBounds = bullet.getBounds();

  const bossBounds = boss.getBounds();

  return (
    bulletBounds.x < bossBounds.x + bossBounds.width &&
    bulletBounds.x + bulletBounds.width > bossBounds.x &&
    bulletBounds.y + bulletBounds.height > bossBounds.y && 
    bulletBounds.y < bossBounds.y + bossBounds.height 
  );
}

function checkPlayerCollision(bullet, player) {
  const bulletBounds = bullet.getBounds();
  const playerBounds = player.getBounds();
  return (
    bulletBounds.x < playerBounds.x + playerBounds.width &&
    bulletBounds.x + bulletBounds.width > playerBounds.x &&
    bulletBounds.y < playerBounds.y + playerBounds.height &&
    bulletBounds.y + bulletBounds.height > playerBounds.y
  );
}

function checkPlayerBulletCollision(bullet, playerBullet) {
  
  const bulletBounds = bullet.getBounds();

  
  const playerBulletBounds = playerBullet.getBounds();

  return (
    bulletBounds.x < playerBulletBounds.x + playerBulletBounds.width &&
    bulletBounds.x + bulletBounds.width > playerBulletBounds.x &&
    bulletBounds.y + bulletBounds.height > playerBulletBounds.y && 
    bulletBounds.y < playerBulletBounds.y + playerBulletBounds.height 
  );
}

function handlePlayerfDefeat(app, player) {
  app.stage.removeChild(player);
  displayLoseMessage(app)
  //ticker.stop()
}

export function bossLogic(app, playerBullets, player) {
  setTimeout(() => {
    let boss = createBoss(app);
    let bullet = null;
  
    let canShoot = true; 
    isBossFight = true; 
    
    createBossHPBar(app, boss);
  
    app.ticker.add(() => {
      startBossMovement(app, boss);
  

      if (canShoot && isBossFight) {
        bullet = createBossBullet(app, boss);
        handleBossBulletMovement(app, bullet, boss, playerBullets, player);

        canShoot = false; 
        setTimeout(() => {
          canShoot = true; 
        }, 2000);
      }
    });
  }, 3000)
}
