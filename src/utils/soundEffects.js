import { Howl } from 'howler';

// Create sound sprites for better performance
const soundSprites = new Howl({
  src: ['/sounds/ui-sounds.webm', '/sounds/ui-sounds.mp3'],
  sprite: {
    hover: [0, 100],
    click: [100, 200],
    alert: [200, 800],
    scan: [800, 1200],
    success: [1200, 1800],
    error: [1800, 2400],
    notification: [2400, 3000],
  },
  volume: 0.3,
});

class SoundEffects {
  static enabled = true;

  static toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  static play(sound) {
    if (!this.enabled) return;
    soundSprites.play(sound);
  }

  static hover() {
    this.play('hover');
  }

  static click() {
    this.play('click');
  }

  static alert() {
    this.play('alert');
  }

  static scan() {
    this.play('scan');
  }

  static success() {
    this.play('success');
  }

  static error() {
    this.play('error');
  }

  static notification() {
    this.play('notification');
  }
}

export default SoundEffects;
