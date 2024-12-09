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

// Begriffe und Icons-Map
const skillsWithIcons = {
  'Adobe Creative Cloud': '../assets/images/adobe.svg',
  'Photoshop': '../assets/images/photoshop.svg',
  'Illustrator': '../assets/images/illustrator.svg',
  'InDesign': '../assets/images/indesign.svg',
  'Audition': '../assets/images/audition.svg',
  'Figma': '../assets/images/figma.svg',
  'UX/UI Design': '../assets/images/ux-ui.svg',
  'Webdesign': '../assets/images/webdesign.svg',
  'Typography': '../assets/images/typography.svg',
  'Visual Storytelling': '../assets/images/storytelling.svg',
  'Graphic Design': '../assets/images/graphic-design.svg',
  'Infografik': '../assets/images/infografik.svg',
  'Excalidraw': '../assets/images/excalidraw.svg',
  'Lightroom': '../assets/images/lightroom.svg',
  'Web development': '../assets/images/web-development.svg',
  'HTML': '../assets/images/html.svg',
  'CSS': '../assets/images/css.svg',
  'JavaScript': '../assets/images/javascript.svg',
  'React': '../assets/images/react.svg',
  'Next.js': '../assets/images/nextjs.svg',
  'GitHub': '../assets/images/github.svg',
  'MongoDB': '../assets/images/mongodb.svg',
  'Slack': '../assets/images/slack.svg',
  'Python': '../assets/images/python.svg',
};


// Funktion, um den Radius basierend auf der Textlänge und -größe zu berechnen
function calculateRadius(text, fontSize) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = `${fontSize}px Arial`;
  const textWidth = context.measureText(text).width;
  return Math.max(textWidth / 2 + 20, fontSize * 3.5); // Radius basierend auf Textbreite und Schriftgröße
}

// Bälle mit Icons und Text erstellen
const balls = Object.entries(skillsWithIcons).map(([skill, icon]) => {
  const fontSize = 18; // Schriftgröße für Text
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
          texture: '../assets/images/gradient-circle.svg', // Blasen-Hintergrund
          xScale: radius / 50, // Skaliert das Hintergrundbild
          yScale: radius / 50,
        },
        customContent: {
          icon, // Das Icon-Bild
          content: skill, // Der Text
          size: fontSize, // Schriftgröße
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

// Text und Icons rendern
Matter.Render.bodies = function(render, bodies, context) {
  const c = context;

  bodies.forEach(body => {
    // Zeichne das Hintergrundbild der Blase
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

    // Zeichne das Icon über dem Text
    if (body.render.customContent && body.render.customContent.icon) {
      const iconImage = new Image();
      iconImage.src = body.render.customContent.icon; // Lade das Icon
      const { x, y } = body.position;
      const radius = body.circleRadius; // Radius der Blase

      c.save();
      c.translate(x, y - radius / 3); // Position: Leicht nach oben verschoben
      c.drawImage(
        iconImage,
        -radius / 4, // Zentriere das Icon horizontal
        -radius / 4, // Zentriere das Icon vertikal
        radius / 2, // Breite des Icons
        radius / 2  // Höhe des Icons
      );
      c.restore();
    }

    // Zeichne den Text unter dem Icon
    if (body.render.customContent && body.render.customContent.content) {
      const { content, size, color } = body.render.customContent;
      const { x, y } = body.position;

      c.font = `${size}px Arial`;
      c.fillStyle = color;
      c.textAlign = 'center';
      c.fillText(content, x, y + body.circleRadius / 4); // Text unter das Icon verschieben
    }
  });
};