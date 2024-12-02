const { Engine, Render, World, Bodies, Mouse, MouseConstraint } = Matter;

// Engine erstellen
const engine = Engine.create();
const world = engine.world;
world.gravity.y = 0.3; // Schwerkraft einstellen

// Canvas erstellen und Renderer konfigurieren
const canvas = document.getElementById('ballCanvas');
const render = Render.create({
  canvas: canvas,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    background: 'transparent',
    wireframes: false, // Deaktiviert Debug-Darstellung
  },
});

// Bälle mit Textur erstellen
const balls = [];
for (let i = 0; i < 160; i++) {
  const radius = Math.random() * 40 + 15; // Zufällige Größe (15px bis 45px Radius)
  const ball = Bodies.circle(
    Math.random() * window.innerWidth, // Zufällige horizontale Position
    Math.random() * window.innerHeight * -1, // Start oberhalb des Bildschirms
    radius, // Radius
    {
      restitution: 0.9, // Elastizität der Bälle
      friction: 0.4, // Reibung
      render: {
        sprite: {
          texture: 'public/gradient-circle.svg', // Hier die Texturdatei einfügen
          xScale: 2 * (radius / 100), // Skaliert das Bild basierend auf dem Radius
          yScale: 2 * (radius / 100),
        },
      },
    }
  );
  balls.push(ball);
}
World.add(world, balls);

// Speziellen Ball mit eigener Textur hinzufügen
const specialBallRadius = 50; // Radius für den speziellen Ball
const specialBall = Bodies.circle(
  Math.random() * window.innerWidth, // Zufällige horizontale Position
  Math.random() * window.innerHeight * -1, // Start oberhalb des Bildschirms
  specialBallRadius, // Radius des speziellen Balls
  {
    restitution: 0.9, // Elastizität der Bälle
    friction: 0.4, // Reibung
    render: {
      sprite: {
        texture: 'public/smily.png', // Spezielle Textur für diesen Ball
        xScale: 2 * (specialBallRadius / 100), // Skaliert das Bild basierend auf dem Radius
        yScale: 2 * (specialBallRadius / 100),
      },
    },
  }
);

// Füge den speziellen Ball zur Welt hinzu
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

// Mausinteraktion auf den Canvas beschränken
mouse.element.removeEventListener('mousedown', mouseConstraint.mouse.mousedown);
mouse.element.addEventListener('mousedown', (event) => {
  const target = event.target;

  // Wenn das Ziel kein Button ist, Matter.js-Interaktion aktivieren
  if (!target.closest('.button-container')) {
    mouseConstraint.mouse.mousedown(event);
  }
});

World.add(world, mouseConstraint);

// Engine und Renderer starten
Engine.run(engine);
Render.run(render);

// Canvas an die Fenstergröße anpassen
window.addEventListener('resize', () => {
  render.canvas.width = window.innerWidth;
  render.canvas.height = window.innerHeight;
});

// Button-Klick: Scrollen und Einführung anzeigen
const button = document.querySelector('.startButton');
button.addEventListener('click', () => {
  const introduction = document.getElementById('introduction');
  introduction.style.display = 'block'; // Zeige den Einleitungstext an
  window.scrollTo({ top: window.innerHeight, behavior: 'smooth' }); // Scrolle nach unten
});

// Button-Barriere erstellen
const buttonBarrierDiv = document.getElementById('button-barrier');
const buttonBarrierRect = buttonBarrierDiv.getBoundingClientRect();

// Barriere für die Bälle hinzufügen
const buttonBarrier = Bodies.rectangle(
  buttonBarrierRect.left + buttonBarrierRect.width / 2, // X-Position (Mitte des Divs)
  buttonBarrierRect.top + buttonBarrierRect.height / 2, // Y-Position (Mitte des Divs)
  buttonBarrierRect.width, // Breite des Divs
  buttonBarrierRect.height, // Höhe des Divs
  {
    isStatic: true, // Statisch (unbeweglich)
    render: { fillStyle: 'transparent' }, // Unsichtbar
  }
);

World.add(world, buttonBarrier);

// Aktualisiere die Barriere-Position bei Fenstergrößenänderung
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

window.addEventListener('resize', () => {
    // Aktualisiere nur die Canvas- und Button-Barriere-Positionen
    const updatedRect = buttonBarrierDiv.getBoundingClientRect();
    Matter.Body.setPosition(buttonBarrier, {
      x: updatedRect.left + updatedRect.width / 2,
      y: updatedRect.top + updatedRect.height / 2,
    });
  });

  // Menü umschalten
function toggleMenu() {
    const menuItems = document.getElementById("menu-items");
    menuItems.classList.toggle("show");
  }