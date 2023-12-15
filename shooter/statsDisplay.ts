import { GameApp, Services } from '../engine/gameApp';
import { GameObject } from '../engine/gameObject';
import { Renderable } from '../engine/renderingService';

export class StatsDisplay extends GameObject implements Renderable {
  constructor(app: GameApp) {
    super(app);
  }

  override register(services: Services): void {
    services.renderingService.register(this);
  }

  /**
   * From Renderable
   */
  render(renderer: CanvasRenderingContext2D): void {
    renderer.font = '10px Courier New';
    renderer.translate(40, 20);
    renderer.fillStyle = 'rgba(0, 0, 255, 0.5)';
    renderer.fillRect(0, 0, 400, 85);
    renderer.fillStyle = 'white';
    renderer.translate(10, 5);
    renderer.fillText(`reclaimablesCount:             ${this.app.stats.reclaimablesCount}`, 0, 10);
    renderer.fillText(`reclaimabledInLastFrameCount:  ${this.app.stats.reclaimabledInLastFrameCount}`, 0, 30);
    renderer.fillText(`reclaimabledTotalCount:        ${this.app.stats.reclaimabledTotalCount}`, 0, 50);
    renderer.fillText(`lastFrameDuration:             ${Math.ceil(this.app.stats.lastFrameDuration)}`, 0, 70);
    renderer.setTransform(1, 0, 0, 1, 0, 0);
  }
}
