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
    state = {
        ...state,
        ...nextState,
    };
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

    debug = false; // Debug Mode
    state = state; // Current State
    _initState = state; // Initial State

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
        if (this.debug) console.log('previous state:', this.state);
        setState(nextState);
        if (this.debug) console.log('next state:', this.state);
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
