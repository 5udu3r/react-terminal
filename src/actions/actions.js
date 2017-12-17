"use strict"

/*
  Terminal commands are useful to think of as existing in two types:
    a) Those that change the current path or the directory tree. Examples are
    rm, mkdir, cd, cp, mv.
    b) Those that do not. Examples are ls, pwd, vim, cat, incorrect commands.
  The distinction is that commands of type b) should not be handled in
  the reducer because they do not change the state in a variable way. Rather 
  they are primarily used to display information and are therefore handled in 
  render() which creates outputs.

  Now to say that type b) commands do not change the Redux state at all is not 
  precise. They do change the state (they do so by adding new commands to 
  prevInput).
  However, all commands (type a) or type b)) change the state in this way, so 
  the useful distinction is between those that change the states path or the tree 
  and those that keep them.
  
  The purpose of the action creator is to determine if the input command (cmd)
  is a type of command that changes/keeps the state (CHNG_STATE/KEEP_STATE) in 
  the manner detailed above, and determine if the command is currently 
  supported.
*/

export function input(userInput, cmd, flgs, dir, err){
    return {
            type: "COMMAND",
            userInput,
            cmd,
            flgs,
            dir,
            err
        };
}