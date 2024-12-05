const { Engine, Render, World, Bodies, Mouse, MouseConstraint } = Matter;

// Engine erstellen
const engine = Engine.create();
const world = engine.world;
world.gravity.y = 0.2; // Schwerkraft einstellen

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

// Begriffe, die auf den Bällen stehen sollen
const skills = [
  'Adobe Creative Cloud', 'Photoshop', 'Illustrator', 'InDesign', 'Audition', 'Figma',
  'UX/UI Design', 'Webdesign', 'Typography', 'Visual Storytelling', 'Graphic Design',
  'Infografik', 'Excalidraw', 'Lightroom', 'Web development', 'HTML', 'CSS', 'JavaScript',
  'React', 'Next.js', 'GitHub', 'MongoDB', 'Slack',
];

// Funktion, um den Radius basierend auf der Textlänge und -größe zu berechnen
function calculateRadius(text, fontSize) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = `${fontSize}px Arial`;
  const textWidth = context.measureText(text).width;
  return Math.max(textWidth / 2 + 10, fontSize * 3.5); // Radius basierend auf Textbreite und Schriftgröße
}

// Bälle mit Textur und dynamischer Größe erstellen
const balls = skills.map(skill => {
  const fontSize = 29; // Schriftgröße
  const radius = calculateRadius(skill, fontSize); // Dynamisch berechneter Radius

  const ball = Bodies.circle(
    Math.random() * window.innerWidth, // Zufällige horizontale Position
    Math.random() * window.innerHeight * -1, // Start oberhalb des Bildschirms
    radius, // Dynamischer Radius
    {
      restitution: 0.9, // Elastizität der Bälle
      friction: 0.4, // Reibung
      render: {
        sprite: {
          texture: '../assets/images/gradient-circle.svg', // Bild für den Ball
          xScale: radius / 50, // Skaliert das Bild basierend auf dem Radius
          yScale: radius / 50,
        },
        customText: {
          content: skill, // Der Begriff (z. B. "Adobe Creative Cloud")
          size: fontSize, // Textgröße
          color: '#ffffff', // Textfarbe
        },
      },
    }
  );

  return ball;
});

// Bälle zur Welt hinzufügen
World.add(world, balls);

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
World.add(world, mouseConstraint);

// Engine und Renderer starten
Engine.run(engine);
Render.run(render);

// Canvas an die Fenstergröße anpassen
window.addEventListener('resize', () => {
  render.canvas.width = window.innerWidth;
  render.canvas.height = window.innerHeight;
});

// Text und Bälle rendern
Matter.Render.bodies = function(render, bodies, context) {
  const c = context;

  bodies.forEach(body => {
    // Zeichne das Sprite-Bild (den Ball)
    if (body.render.sprite && body.render.sprite.texture) {
      const sprite = body.render.sprite;
      const { x, y } = body.position;
      const angle = body.angle;

      const image = new Image();
      image.src = sprite.texture; // Lade das Bild
      c.save();
      c.translate(x, y);
      c.rotate(angle);
      c.drawImage(
        image,
        -sprite.xScale * 50, // Zentriere das Bild
        -sprite.yScale * 50,
        sprite.xScale * 100, // Skalierung für Breite
        sprite.yScale * 100 // Skalierung für Höhe
      );
      c.restore();
    }

    // Zeichne den Text (den Begriff)
    if (body.render.customText && body.render.customText.content) {
      const { content, size, color } = body.render.customText;
      const { x, y } = body.position;

      c.font = `${size}px Arial`;
      c.fillStyle = color;
      c.textAlign = 'center';
      c.fillText(content, x, y + 5); // Text leicht nach unten verschieben
    }
  });
};