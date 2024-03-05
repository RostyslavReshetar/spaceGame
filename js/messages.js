
import { resetTimer } from "./spaceShip.js"

export function displayLoseMessage(app) {

  setTimeout(() => {}, 1500)

  const loseMessage = new PIXI.Text('YOU LOSE', {
    fontFamily: 'Arial',
    fontSize: 48,
    fill: 'red',
    fontWeight: 'bold' 
  });


  loseMessage.anchor.set(0.5);
  loseMessage.position.set(app.view.width / 2, app.view.height / 2); 
  loseMessage.alpha = 0; 

  app.stage.addChild(loseMessage);

  gsap.to(loseMessage, { duration: 0.5, alpha: 1, ease: 'power2.out' });
  gsap.to(loseMessage.scale, { duration: 0.05, x: 1.1, y: 1.1, repeat: 10, yoyo: true, delay: 0.5 });

  setTimeout(() => {
    gsap.to(loseMessage, { duration: 0.5, alpha: 0, ease: 'power2.out', onComplete: () => {
      app.stage.removeChild(loseMessage);
    }});
  }, 3000);

  resetTimer();
}



export function displayWinMessage(app) {

  setTimeout(() => {}, 1500)

  const winMessage = new PIXI.Text('YOU WIN', {
    fontFamily: 'Arial',
    fontSize: 48, 
    fill: 'green',
    fontWeight: 'bold' 
  });


  winMessage.anchor.set(0.5);
  winMessage.position.set(app.view.width / 2, app.view.height / 2); 
  winMessage.alpha = 0; 


  app.stage.addChild(winMessage);


  gsap.to(winMessage, { duration: 0.5, alpha: 1, ease: 'power2.out' }); 
  gsap.to(winMessage.scale, { duration: 0.5, x: 1.1, y: 1.1, ease: 'bounce.out', delay: 0.5 });

  setTimeout(() => {

    gsap.to(winMessage, { duration: 0.5, alpha: 0, ease: 'power2.out', onComplete: () => {
      app.stage.removeChild(winMessage);
    }});
  }, 3000);


  resetTimer();
}


export function displayBossFightMessage(app) {
  setTimeout(() => {}, 1500)

  const bossMessage = new PIXI.Text("Boss fight begins", {
    fontFamily: 'Arial',
    fontSize: 36,
    fill: 'yellow'
  });


  bossMessage.anchor.set(0.5);
  bossMessage.position.set(app.view.width / 2, app.view.height / 2);
  bossMessage.scale.set(0);

  app.stage.addChild(bossMessage);

  gsap.to(bossMessage.scale, { duration: 0.5, x: 1, y: 1, ease: 'power2.out' }); // Scale animation with smoother easing


  setTimeout(() => {
    // Remove the message after the duration
    app.stage.removeChild(bossMessage);
  }, 3000);

  resetTimer()
}


