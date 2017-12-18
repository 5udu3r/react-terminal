/*
TODO 
    - Must iterate over flags. Currently the switch case is only effective for
      one flag.
 */
import {combineReducers} from 'redux';

const SYMLINK = false;

// The directory tree
var dirTree = {
    '.': SYMLINK,
    '..': SYMLINK,
    '~': {
        '.': SYMLINK,
        '..': SYMLINK,
        'resume': { 
            '.': SYMLINK,
            '..': SYMLINK,
            'resume.txt': 
`Anthony Steel
Experience
========== 
Software Developer Itern at the Centre for Advanced Computing
    May 2017 - September 2018 (16 month internship)
        - Worked in team of 4 interns to create full stack web 
        application from scratch for industry client using React 
        and Redux

Projects
========
Satellite Design Team Member on Queen's Space Engineering Team
    2017 Season
        - Largest contributer to Satellite team code repository 

Undergraduate Thesis Project with the Mining Systems Labratory
    - Wrote control system for Kubota RTV using ROS and designed/tested
      3D model of Kubota in Gazebo

Education 
========= 
Bachelor of Applied Science with Professional Internship (2014-2019)
Engineering Physics, Computer Option 
Queen's University, Canada`
    },
        'aboutme.txt':
`Bucket List
===========
- Build a personal robot that can cook

- Build a fully automated artificial light indoor vertical farm`
    }
}

const blankLine = {
    // Stores the current directory. terminal.js renders this property as the 
    // current working directory in the terminal.
    path: ['~'],

    // Stores the current directory tree. Commands like rm and mkdir can change
    // this tree.
    dirTree,

    /* 
        history and prevInputs stores all previous commands given. terminal.js 
        uses prevInputs to render the previous inputs. 
        The 'clear' command reinitializes prevInputs to []. history is used to
        toggle the command history using the up and down arrow keys.
         
        Both arrays store the following object:
            {userInput, cmd, flgs, dir, err, path}

        userInput   raw unparsed command submitted by the user. Used to 
                    render the previous user commands.
        cmd         constructed by splitting the userInput on ' ' and taking the
                    first element of the array
        flgs        constructed in the same way as cmd but the array is filtered
                    for the commands starting with '-'
        dir         the remaining elements after userInput has been split into
                    cmd and flgs
        err         has a values of false, NO_CMD, NO_FLG, NO_DIR. terminal.js
                    checks if there is an error and assigns one of these values.
        path        directory path when the command was given. Necessary for 
                    rendering the path in previous terminal inputs.
        
    */
    history: [],
    prevInputs: [] 
};



function switchDirs(dirs, newState, currInput){
    if(dirs[0] === undefined){
        newState = {
            ...newState,
            path: ['~']
    }
    } else {
        for(let dir of dirs){
            if(dir === ".."){
                newState = {
                    ...newState,
                    path: newState.path.slice(0,newState.path.length-1)
                }
            } else {
                newState = {
                    ...newState,
                    path: newState.path.concat(dir)
                }
            }
        }
    }


    return newState;
}


function terminalReducer(state = blankLine, action){
    const userInput = action.userInput;
    const dirTree   = state.dirTree;
    const cmd       = action.cmd;
    const flgs      = action.flgs; 
    const dir       = action.dir; 
    const err       = action.err;

    var newState    = {...state};


    const currInput = [{
                userInput,
                dirTree,
                cmd,
                flgs,
                dir,
                err,
                path: newState.path
            }]

    const changeState = {
        cd: true,
        clear: true,
        ls: false
    }


    if(action.type === "COMMAND"){
      // Check if there are errors or if it doesn't alter the state. If true,
      // add command to previous input to be handled by render in terminal.js
      if(!err && changeState[cmd]){
        switch (cmd) {
          case "cd":
            if(flgs[0] === undefined){
              newState = switchDirs(dir, newState, currInput);
            } else { 
              for(let flg of flgs) {
                switch (flg) {
                  case "-":
                    const len = newState.prevInputs.length - 1;
                    newState = {
                      ...newState,
                      path: newState.prevInputs[len].path
                    }
                }
              }
            }
            break;
          case "clear":
            newState = {
                ...newState,
                prevInputs: []
            }
            return newState

        }
      }
    }

    newState = {
        ...newState,
        history: newState.prevInputs.concat(currInput),
        prevInputs: newState.prevInputs.concat(currInput)
    }

    return newState;

}

export default combineReducers({terminal:terminalReducer});
