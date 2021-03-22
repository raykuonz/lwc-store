import StateMixin from './state';

let storeReducers = {};
let reducerKeys = [];

const StoreMixin = (Base) => class extends StateMixin(Base) {

    constructor() {
        super();
        this.connect(); // Connect to State
    }

    /**
     * Dispatch
     * @param {object} action
     * @param {string} action.type
     * @param {*} action.payload
     */
    dispatch(action) {
        let state = {};
        reducerKeys.forEach((key) => {
            state[key] = storeReducers[key](action);
        })
        this.setState(state);
    }

    /**
     * Create Store
     * @param {object} reducers - e.g. { count: () => {}, todos: () => {} }
     * @param {object} [initialState] - e.g. { count: 0, todos: [] }
     * @param {boolean} [debug] - Enable debug mode
     */
    createStore(reducers, initialState, debug = false) {

        this.setDebug(debug);

        try {
            if (typeof reducers !== 'object') {
                throw new Error('reducers param must be an object');
            }

            reducerKeys = Object.keys(reducers);

            let state = {};

            reducerKeys.forEach((key) => {
                const reducer = reducers[key];
                state[key] = reducer(undefined, {});
                storeReducers[key] = (action) => reducer(this.state[key], action);
            });

            if (initialState) {
                state = {
                    ...state,
                    ...initialState,
                }
            }

            this.initState(state);

        } catch (error) {
            console.error('Create Store Error', error);
        }
    }
}

export default StoreMixin;