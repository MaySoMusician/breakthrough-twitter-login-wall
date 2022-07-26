'use strict'

class EconomicalInterval {
  #lastAlive = 0
  /** @type {number | null} */
  #timer = null
  #timerHandler = () => {}
  #interval = 0
  #suspensionTimeout = 60 * 1000
  /** @type {'RUNNING' | 'SUSPENDED' | 'STOPPED'} */
  #status = 'STOPPED'

  /**
   * 
   * @param {Function} timerHandler 
   * @param {number} interval 
   * @param {number} suspensionTimeout 
   */
  constructor(timerHandler, interval, suspensionTimeout) {
    this.#timerHandler = timerHandler
    this.#interval = interval
    this.#suspensionTimeout = suspensionTimeout

    const updateLastAlive = () => {
      this.#lastAlive = Date.now()
      if (this.#status === 'SUSPENDED') {
        this._start()
      }
    }
    //
    ;['click', 'keydown'].forEach((event) =>
      document.addEventListener(event, updateLastAlive)
    )
  }

  _start() {
    const wrapper = () => {
      if (Date.now() - this.#lastAlive > this.#suspensionTimeout) {
        this.#timer = null
        this.#status = 'SUSPENDED'
        return
      }
      this.#timerHandler()
      this.#timer = setTimeout(wrapper, this.#interval)
    }
    this.#status = 'RUNNING'
    this.#timer = setTimeout(wrapper, this.#interval)
  }

  start() {
    this.#lastAlive = Date.now()
    this._start()
  }

  stop() {
    if (!this.#timer) return
    this.#status = 'STOPPED'
    clearTimeout(this.#timer)
  }
}
