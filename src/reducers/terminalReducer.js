import {combineReducers} from 'redux';

const directoryTree = {
    '~': {
        Resume: {
            resume: "txt"
        },
        aboutme: "txt"
    }
}
const initialState = {
    directory: ['~'],
    directoryTree,
    history: []
};

function terminalReducer(state=initialState, action){
    switch(action.type){
        case "LS":
            return {
                ...state,
                history: state.history.concat(['ls'])
            };
        
        case "CD":
            return {
                ...state,
                history: state.history.concat(['cd '+action.payload]),
                directory: state.directory.concat([action.payload])
            }

        case "CLEAR":
            return {
                ...state,
                history: state.history[state.directory.length],
                directory: state.directory[state.directory.length]
            }

    }
    return state
}

export default combineReducers({terminal:terminalReducer});
