// adventure.js

const { Engine, Render, World, Bodies, Mouse, MouseConstraint } = Matter;

// Skill-Liste mit Icons
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

const backgroundTexture = '../assets/images/gradient-circle.svg';
const fontSize = 18;

// Bild-Preloader mit Caching
function preloadImages(imagePaths) {
  const imageCache = {};
  const promises = imagePaths.map(src => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        imageCache[src] = img;
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  });
  return Promise.all(promises).then(() => imageCache);
}

// Radius basierend auf Textlänge berechnen
function calculateRadius(text, fontSize) {
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.font = `${fontSize}px Arial`;
  return Math.max(ctx.measureText(text).width / 2 + 20, fontSize * 3.5);
}

// Start der Simulation
function startSimulation(assets) {
  const engine = Engine.create();
  const world = engine.world;
  world.gravity.y = 0.2;

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

  const balls = Object.entries(skillsWithIcons).map(([skill, icon]) => {
    const radius = calculateRadius(skill, fontSize);
    return Bodies.circle(
      Math.random() * window.innerWidth,
      Math.random() * window.innerHeight * -1,
      radius,
      {
        restitution: 0.9,
        friction: 0.4,
        render: {
          sprite: {
            texture: backgroundTexture,
            xScale: radius / 50,
            yScale: radius / 50,
          },
          customContent: {
            icon,
            content: skill,
            size: fontSize,
            color: '#ffffff',
          },
        },
      }
    );
  });

  World.add(world, balls);

  const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100, { isStatic: true });
  const leftWall = Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true });
  const rightWall = Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true });
  World.add(world, [ground, leftWall, rightWall]);

  const mouse = Mouse.create(canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: { stiffness: 0.3, render: { visible: false } },
  });
  World.add(world, mouseConstraint);

  Engine.run(engine);
  Render.run(render);

  window.addEventListener('resize', () => {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
  });

  Matter.Render.bodies = function(render, bodies, context) {
    const c = context;
    bodies.forEach(body => {
      const { x, y } = body.position;
      const angle = body.angle;
      const radius = body.circleRadius;
      const sprite = body.render.sprite;
      const bgImg = assets[sprite.texture];
      if (bgImg?.complete) {
        c.save();
        c.translate(x, y);
        c.rotate(angle);
        c.drawImage(bgImg, -sprite.xScale * 50, -sprite.yScale * 50, sprite.xScale * 100, sprite.yScale * 100);
        c.restore();
      }

      const iconSrc = body.render.customContent.icon;
      const iconImg = assets[iconSrc];
      if (iconImg?.complete) {
        c.save();
        c.translate(x, y - radius / 3);
        c.drawImage(iconImg, -radius / 4, -radius / 4, radius / 2, radius / 2);
        c.restore();
      }

      const { content, size, color } = body.render.customContent;
      c.font = `${size}px Arial`;
      c.fillStyle = color;
      c.textAlign = 'center';
      c.fillText(content, x, y + radius / 4);
    });
  };
}

// Lade Bilder und starte
const allImagePaths = [
  backgroundTexture,
  ...Object.values(skillsWithIcons),
];

preloadImages(allImagePaths)
  .then(imageCache => {
    startSimulation(imageCache);
  })
  .catch(err => {
    console.error('Bild konnte nicht geladen werden:', err);
  });
