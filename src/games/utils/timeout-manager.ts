export class TimeoutManager {
  private timeouts: NodeJS.Timeout[] = [];

  add(timeout: NodeJS.Timeout) {
    this.timeouts.push(timeout);
  }

  clear() {
    this.timeouts.forEach(clearTimeout);
    this.timeouts = [];
  }

  // Convenience method for creating and adding timeouts
  setTimeout(callback: () => void, delay: number) {
    const timeout = setTimeout(callback, delay);
    this.add(timeout);
    return timeout;
  }
}
