const { Engine, Render, World, Bodies, Mouse, MouseConstraint } = Matter;

// Funktion: Ballgröße abhängig von Bildschirmbreite
function getBallRadius() {
  const screenWidth = window.innerWidth;
  if (screenWidth < 600) {
    return Math.random() * 20 + 10; // 10px bis 30px
  } else if (screenWidth < 1024) {
    return Math.random() * 30 + 15; // 15px bis 45px
  } else {
    return Math.random() * 40 + 20; // 20px bis 60px
  }
}

// Engine erstellen
const engine = Engine.create();
const world = engine.world;
world.gravity.y = 0.2;

// Canvas erstellen und Renderer konfigurieren
const canvas = document.getElementById('ballCanvas');
const render = Render.create({
  canvas: canvas,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    background: 'transparent',
    wireframes: false,
  },
});

// Bälle mit Textur erstellen
const balls = [];
for (let i = 0; i < 160; i++) {
  const radius = getBallRadius();

  const ball = Bodies.circle(
    Math.random() * window.innerWidth,
    Math.random() * window.innerHeight * -1,
    radius,
    {
      restitution: 0.9,
      friction: 0.4,
      render: {
        sprite: {
          texture: '../assets/images/gradient-circle.svg',
          xScale: 2 * (radius / 100),
          yScale: 2 * (radius / 100),
        },
      },
    }
  );
  balls.push(ball);
}
World.add(world, balls);

// Speziellen Ball mit eigener Textur hinzufügen
const specialBallRadius = window.innerWidth < 600 ? 30 : 50;
const specialBall = Bodies.circle(
  Math.random() * window.innerWidth,
  Math.random() * window.innerHeight * -1,
  specialBallRadius,
  {
    restitution: 0.9,
    friction: 0.4,
    render: {
      sprite: {
        texture: '../assets/images/smily_2.png',
        xScale: 2 * (specialBallRadius / 240),
        yScale: 2 * (specialBallRadius / 240),
      },
    },
  }
);
World.add(world, specialBall);

// Wände hinzufügen
const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100, {
  isStatic: true,
  render: { fillStyle: 'transparent' },
});
const leftWall = Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true });
const rightWall = Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true });
World.add(world, [ground, leftWall, rightWall]);

// Mausinteraktion hinzufügen
const mouse = Mouse.create(canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.3,
    render: { visible: false },
  },
});
mouse.element.removeEventListener('mousedown', mouseConstraint.mouse.mousedown);
mouse.element.addEventListener('mousedown', (event) => {
  const target = event.target;
  if (!target.closest('.button-container')) {
    mouseConstraint.mouse.mousedown(event);
  }
});
World.add(world, mouseConstraint);

// Engine und Renderer starten
Engine.run(engine);
Render.run(render);

// Canvas an Fenstergröße anpassen
window.addEventListener('resize', () => {
  render.canvas.width = window.innerWidth;
  render.canvas.height = window.innerHeight;
});

// Button-Klick: Scrollen und Einführung anzeigen
const button = document.querySelector('.startButton');
button.addEventListener('click', () => {
  const introduction = document.getElementById('introduction');
  introduction.style.display = 'block';
  window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
});

// Button-Barriere erstellen
const buttonBarrierDiv = document.getElementById('button-barrier');
const buttonBarrierRect = buttonBarrierDiv.getBoundingClientRect();
const buttonBarrier = Bodies.rectangle(
  buttonBarrierRect.left + buttonBarrierRect.width / 2,
  buttonBarrierRect.top + buttonBarrierRect.height / 2,
  buttonBarrierRect.width,
  buttonBarrierRect.height,
  {
    isStatic: true,
    render: { fillStyle: 'transparent' },
  }
);
World.add(world, buttonBarrier);

// Barriere bei Resize aktualisieren
window.addEventListener('resize', () => {
  const updatedRect = buttonBarrierDiv.getBoundingClientRect();
  Matter.Body.setPosition(buttonBarrier, {
    x: updatedRect.left + updatedRect.width / 2,
    y: updatedRect.top + updatedRect.height / 2,
  });

  Matter.Body.setVertices(buttonBarrier, [
    { x: updatedRect.left, y: updatedRect.top },
    { x: updatedRect.right, y: updatedRect.top },
    { x: updatedRect.right, y: updatedRect.bottom },
    { x: updatedRect.left, y: updatedRect.bottom },
  ]);
});