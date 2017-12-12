"use strict"
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ls, cd, clear} from '../../actions/actions';

class Terminal extends React.Component{
    checkPath(path){
        const totalPath = this.props.directory.concat(path.split('/'));
        let tree = this.props.directoryTree
        let isValidPath = true;
        totalPath.forEach(pathElem => {
            if(tree[pathElem] != undefined){
                tree = tree[pathElem];
            } else {
                isValidPath = false;
            }
        })
        return isValidPath;
    }

    handleSubmit(e){
        const ENTER = 13;

        if (e.keyCode === ENTER)
        {
            const userInput = e.target.value;
            const cmd = userInput.split(' ')[0];
            
            switch (cmd) {
                case "ls":
                    this.props.ls();
                    break;
                case "cd":
                    const targetDir = userInput.substring(3);
                    if(this.checkPath(targetDir)){
                        this.props.cd(targetDir);
                    } else {
                        console.log("ERROR 405");
                    }
                    break;
                case "clear":
                    this.props.clear();
            }
        }
    }

    subDirArr(){
        const directory = this.props.directory;
        const directoryTree = this.props.directoryTree;

        let currDirTree = directoryTree[directory[0]];

        for(var i = 1; i<directory.length; i++)
        {
            currDirTree = currDirTree[directory[i]];
        }

        let subDirArr = [];
        Object.keys(currDirTree).forEach(function(key){
            if(currDirTree[key] == 'txt'){
                subDirArr.push(key+'.txt');
            } else {
                subDirArr.push(key);
            }
        })
        return subDirArr;
    }

    render(){
        const history = this.props.history.map(cmd => {
                return (
                    <div className="terminal">
                        <div className="user">anthonysteel</div>
                        <div className="computer">@website-2017</div>
                        <div className="colon">:</div>
                        <div className="path">{this.props.directory.join('/')}</div>
                        <div className="dollarsign">$</div>
                        <div className="textInput">{cmd}</div>
                    </div>
                );
            }
        );

        const output = this.subDirArr().map(dir => {
            if(this.props.history[this.props.history.length-1] === 'ls'){
                if(dir.includes('.txt')){
                    return (
                        <div className="file">
                            {dir}
                        </div>
                    )
                } else {
                    return (
                        <div className="directory">
                            {dir} 
                        </div>
                    )
                }
            }
        })


        return(
            <div>
                {history} 
                <div className="terminalOutput">
                    {output}
                </div>
                <div className="terminal">
                    <div className="user">anthonysteel</div>
                    <div className="computer">@website-2017</div>
                    <div className="colon">:</div>
                    <div className="path">{this.props.directory.join('/')}</div>
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
        history: state.terminal.history,
        directoryTree: state.terminal.directoryTree,
        directory: state.terminal.directory
    };
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        ls,
        cd,
        clear
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Terminal);