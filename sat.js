import { Vector2 } from './math.js';
import { buildCircleContainedPolygon, Polygon } from './geom.js';
import { Render } from './protocols.js';

import './geom_protocols.js';

const canvas = document.getElementById('game');
const canvasParent = canvas.parentElement;
canvas.width = canvasParent.offsetWidth;
canvas.height = canvasParent.offsetHeight;

const context = canvas.getContext('2d');

const polygons = [];
for (let i  = 0; i < 10; ++i) {
  const pos = new Vector2(Math.random() * canvas.width, Math.random() * canvas.height);
  const radius = 50.0 + Math.random() * 100;
  const verts = Math.round(2 + Math.random() * 3);
  polygons.push(buildCircleContainedPolygon(pos, radius, verts));
}

polygons.forEach(p => Render.render(p, context, {debug: true}));

