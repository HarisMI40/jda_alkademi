declare global {
  interface BigInt {
    /**
     * Converts a BigInt value to a string for JSON.stringify.
     */
    toJSON(): string;
  }
}

// Baris ini diperlukan untuk memastikan file ini diperlakukan sebagai module.
export {};