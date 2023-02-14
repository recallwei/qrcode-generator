class LocalStorageManager {
  #key: string

  constructor(key: string) {
    this.#key = key
  }

  /**
   * @description Get the value of the current Storage.
   */
  public getValue = () => localStorage.getItem(this.#key)

  /**
   * @description Set the value of the current Storage.
   * @param value The value to be insert into Local Storage.
   */
  public setValue = (value: string) => localStorage.setItem(this.#key, value)

  /**
   * @description Clear the current Storage.
   */
  public clear = () => localStorage.removeItem(this.#key)

  /**
   * @descriptionGet the key of the current Storage.
   */
  public getKey = () => this.#key

  /**
   *  @description Check if the Local Storage has the key of current Storage.
   */
  public hasKey = () => localStorage.getItem(this.#key) !== null
}

export default LocalStorageManager
