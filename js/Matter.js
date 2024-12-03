// Matter.js Setup
const { Engine, Render, World, Bodies } = Matter;

// Engine erstellen
const engine = Engine.create();
const world = engine.world;

// Renderer erstellen
const canvas = document.getElementById('ballCanvas');
const render = Render.create({
  canvas: canvas,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false, // Deaktiviert Debug-Stil
    background: 'transparent',
  },
});

// Ein Ball erstellen
const ball = Bodies.circle(200, 200, 50, {
  restitution: 0.8, // Bounciness
  render: {
    fillStyle: 'blue',
  },
});
World.add(world, ball);

// Eine statische Bodenfläche erstellen
const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 20, {
  isStatic: true,
  render: {
    fillStyle: 'green',
  },
});
World.add(world, ground);

// Engine und Renderer starten
Engine.run(engine);
Render.run(render);