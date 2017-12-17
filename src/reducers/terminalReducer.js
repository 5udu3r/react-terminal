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
    path: ['~'],
    dirTree,
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
    const cmd       = action.cmd;
    const flgs      = action.flgs; 
    const dir       = action.dir; 
    const err       = action.err;
    var newState    = {...state};


    const currInput = [{
                userInput,
                cmd,
                flgs,
                dir,
                err,
                path: newState.path
            }]

    const changePathOrDirTree = {
        cd: true,
        ls: false,
    }


    if(action.type === "COMMAND"){
      // Check if there are errors or if it doesn't alter the state. If true,
      // add command to previous input to be handled by render in terminal.js
      if(!err && changePathOrDirTree[cmd]){
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
          case "rm":
            if(flgs[0] === undefined){
            }
        }
      }           
    }

    newState = {
        ...newState,
        prevInputs: newState.prevInputs.concat(currInput) 
    }

    return newState;

}

export default combineReducers({terminal:terminalReducer});
