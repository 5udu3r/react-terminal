"use strict"
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {input} from '../../actions/actions';


class Terminal extends React.Component{
    cmdTree = {
        cd: {
            undefined : "Go to root",
            ".."      : "Move up one directory",
            "-"       : "Move to previous directory"
        },

        ls: {
            "-a" : "List all entries including those starting with a dot"
        }
    }

    fileFormatTree = {
        'txt': 'text',
    }

    hiddenDir = {
        '..': true,
        '.' : true 
    }

    searchTree(treeToSearch, path){
        let tree = {...treeToSearch};
        let isValidPath = true;
        path.forEach(elem=> {
            if(tree[elem] != undefined){
                tree = tree[elem];
            } else {
                isValidPath = false;
            }
        })
        return isValidPath;
    }

    checkCmd(cmd) {
        return this.cmdTree[cmd];
    }

    checkFlgs(cmd, flgs){
        var cmdTree = this.cmdTree;
        var isValidPath = false;

        const path = [cmd].concat(flgs);

        isValidPath = this.searchTree(cmdTree, path);

        return isValidPath;
    }

    checkDir(dir){
        const path = this.props.path.concat(dir);
        let dirTree = this.props.dirTree;

        let isValidPath = this.searchTree(dirTree, path)

        return isValidPath;
    }


    parseArg(arg){
        var parsedArg = {flgs: [], dir: []};
        var dirStr;

        for(let flgOrDir of arg) {
            if(flgOrDir.startsWith('-')){
                parsedArg.flgs.push(flgOrDir);
            } else {
                dirStr = flgOrDir;
                break;
            }
        }
      
        if(dirStr){
            return { 
                ...parsedArg,
                dir: parsedArg.dir.concat(dirStr.split('/'))
            }
        } else {
            return {
                ...parsedArg,
            }
        }
        
    }

    handleSubmit(e){
        const ENTER = 13;

        if (e.keyCode === ENTER)
        {
            const userInput = e.target.value;
            const userInputArr = userInput.split(' ');
            // A user input line contains a command (cmd) and an argument (arg)
            // seperated by a space
            const cmd = userInputArr[0];
            const arg = userInputArr.slice(1, userInputArr.length);

            // The argument contains flags (flgs) and a target directory (dir).

            // Parse arg into flgs and dir
            const parsedArg = this.parseArg(arg);

            const flgs = parsedArg.flgs;
            const dir  = parsedArg.dir;

            // Check if there is an error in the command
            var err;

                if (
                    this.checkCmd(cmd) && 
                    this.checkFlgs(cmd, flgs) && 
                    this.checkDir(dir)
                ){

                    this.props.input(userInput, cmd, flgs, dir, false);

                } else if(!this.checkCmd(cmd)) {

                    this.props.input(userInput, cmd, flgs, dir, "NO_CMD");

                } else if(!this.checkFlgs(cmd,flgs)){

                    this.props.input(userInput, cmd, flgs, dir, "NO_FLG");

                } else if(!this.checkDir(dir)){

                    this.props.input(userInput, cmd, flgs, dir, "NO_DIR");
                }
            e.target.value = ''; // Clear cursor
        }
    }


    subDirs(path){
        let dirTree = {...this.props.dirTree};
        for(let dir of path)
        {
            dirTree = dirTree[dir];
        }

        let subDirs = [];
        Object.keys(dirTree).forEach(function(dir){
            if(typeof dirTree[dir] === 'string'){
                subDirs.push(dir);
            } else {
                subDirs.push(dir);
            }
        })
        return subDirs;
    }

    render(){
        let prevLinesJSX;
        prevLinesJSX = this.props.prevInputs.map(input => {
            let prevInputJSX;
            let prevOutputJSX;
            if (!input.err){
                switch (input.cmd) {
                    case "ls":
                        for(let flg of input.flgs){
                            switch(flg) {
                                case "-a":
                                    prevOutputJSX = this.subDirs(input.path).map(dir => {
                                        if(dir.endsWith('.txt')){
                                            return (
                                                <div className="file">
                                                    {dir} 
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div className="dir">
                                                    {dir}
                                                </div>
                                            )
                                        }
                                    });
                            }
                        }
                        // If there were no flags, print directories except for
                        // hidden ones
                        if(!prevOutputJSX){
                            prevOutputJSX = this.subDirs(input.path).map(dir => {
                                if(dir.endsWith('.txt')){
                                    return (
                                        <div className="file">
                                            {dir} 
                                        </div>
                                    )
                                } else if (!this.hiddenDir[dir]){
                                    return (
                                        <div className="dir">
                                            {dir}
                                        </div>
                                    )
                                }
                            });
                        }
                }
            }
            if(input.userInput){
                prevInputJSX = (
                    <div className="terminalOutput">
                        <div className="user">anthonysteel</div>
                        <div className="computer">@website-2017</div>
                        <div className="colon">:</div>
                        <div className="path">{input.path.join('/')}
                        </div>
                        <div className="dollarsign">$</div>
                        <div className="textInput">
                            {input.userInput}
                        </div>
                    </div>
                );
            } else {
                prevInputJSX = (<div></div>)
            }
            return (
                <div>
                        {prevInputJSX}
                    <div className="terminalOutput">
                        {prevOutputJSX} 
                    </div>
                </div>
            )
        });

        return (
            <div>
                {prevLinesJSX}
                <div className="terminalOutput">
                    <div className="user">anthonysteel</div>
                    <div className="computer">@website-2017</div>
                    <div className="colon">:</div>
                    <div className="path">{this.props.path.join('/')}</div>
                    <div className="dollarsign">$</div>
                    <input 
                        className="textInput"
                        type="text"
                        autoComplete="off"
                        onKeyDown={(e)=>this.handleSubmit(e)} 
                        autoFocus>
                    </input>
                </div>
            </div>
        )
    }
}


function mapStateToProps(state){
    return {
       path: state.terminal.path,
       dirTree: state.terminal.dirTree,
       prevInputs: state.terminal.prevInputs
    };
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        input
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Terminal);