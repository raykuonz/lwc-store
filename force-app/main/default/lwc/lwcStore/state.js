let debug = false;

/**
 * State
 */
let state = {};

/**
 * Subscribers
 */
let subscribers = [];

/**
 * Set State
 * @param {object} nextState
 */
const setState = (nextState) => {
    if (debug) console.log('previous state:', state);
    state = {
        ...state,
        ...nextState,
    };
    if (debug) console.log('next state:', state);
    subscribers.forEach((subscriber) => {
        subscriber(state);
    })
}

/**
 * Subscribe
 * @param {function} callback
 */
const subscribe = (callback) => {
    const index = subscribers.indexOf(callback);
    if (index >= 0) return;
    subscribers.push(callback);
}

/**
 * Unsubscribe
 * @param {function} callback
 */
const unsubscribe = (callback) => {
    const index = subscribers.indexOf(callback);
    if (index < 0) return;
    subscribers = [
        ...subscribers.slice(0, index),
        ...subscribers.slice(index + 1, subscribers.length),
    ];
}

/**
 * State Mixin
 * @param {class} Base
 * @returns {class}
 */
const StateMixin = (Base) => class extends Base {

    state = state; // Current State
    _initState = state; // Initial State

    /**
     * Set Debug
     * @param {boolean} bool
     */
    setDebug(bool = false) {
        debug = bool;
    }

    /**
     * Update State
     * @param {object} state
     */
    _updateState = (state) => {
        if (this.template.isConnected) {
            // Update subscriber's state
            this.state = state;
        } else {
            // Unsubscribe subscriber if it's not connected to DOM
            this.disconnect();
        }
    }

    /**
     * Set State
     * @param {object} nextState
     */
    setState = (nextState) => {
        setState(nextState);
    }

    /**
     * Init State
     * @param {object} nextState
     */
    initState = (nextState) => {
        this.setState(nextState);
        this._initState = nextState;
    }

    /**
     * Connect
     */
    connect() {
        subscribe(this._updateState);
    }

    /**
     * Disconnect
     */
    disconnect() {
        unsubscribe(this._updateState);
    }
}

export default StateMixin;
