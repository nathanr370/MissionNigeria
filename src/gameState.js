export default class GameState {
  constructor() {
    this.coverage = 25;
    this.trust = 40;
    this.transportation = 35;
    this.misinformation = 50;
    this.internetAccess = 20;
  }

  applyEffects(effects) {
    this.coverage += effects.coverage || 0;
    this.trust += effects.trust || 0;
    this.transportation += effects.transportation || 0;
    this.misinformation += effects.misinformation || 0;
    this.internetAccess += effects.internetAccess || 0;

    this.clampStats();
  }

  clampStats() {
    this.coverage = this.clamp(this.coverage, 0, 100);
    this.trust = this.clamp(this.trust, 0, 100);
    this.transportation = this.clamp(this.transportation, 0, 100);
    this.misinformation = this.clamp(this.misinformation, 0, 100);
    this.internetAccess = this.clamp(this.internetAccess, 0, 100);
  }

  hasWon() {
    return (
      this.coverage >= 90 &&
      this.trust >= 70 &&
      this.transportation >= 70 &&
      this.misinformation <= 25 &&
      this.internetAccess >= 60
    );
  }

  hasLost() {
    return this.misinformation >= 90 || this.trust <= 10;
  }

  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
}