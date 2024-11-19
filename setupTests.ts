global.localStorage = {
  store: {} as Record<string, string>,

  getItem(key: string): string | null {
    return this.store[key] || null;
  },

  setItem(key: string, value: string): void {
    this.store[key] = value;
  },

  removeItem(key: string): void {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this.store[key];
  },

  clear(): void {
    this.store = {};
  },

  get length(): number {
    return Object.keys(this.store).length;
  },

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  },
};
