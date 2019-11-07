/**
 * @TODO: this is just a sample service/entity so that we can run the test
 *
 * Implementation of a classic stack.
 */
export class Stack<T> {
  // Internal storage for the stack
  private items: T[] = [];

  /**
   * Creates a pre-populated stack.
   *
   * @param {T[]} initialData the initial contents of the stack
   */
  constructor(initialData: T[] = []) {
    this.items.push(...initialData);
  }

  /**
   * Adds an item to the top of the stack.
   *
   * @param {T} item the item to be added to the stack
   */
  push(item: T): void {
    this.items.push(item);
  }

  /**
   * Removes an item from the top of the stack, returning it.
   *
   * @returns {T} the item at the top of the stack.
   */
  pop(): T {
    return this.items.pop();
  }

  /**
   * Take a peek at the top of the stack, returning the top-most item,
   * without removing it.
   *
   * @returns {T} the item at the top of the stack.
   */
  peek(): T {
    let value: any;
    if (this.isEmpty()) {
      value = undefined;
    } else {
      value = this.items[this.items.length - 1];
    }

    return value;
  }

  /**
   * @returns {boolean} true if the stack is empty.
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * @returns {number} the number of items in the stack.
   */
  size(): number {
    return this.items.length;
  }
}
