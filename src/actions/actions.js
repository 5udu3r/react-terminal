"use strict"

export function ls(){
    return {
        type: 'LS'
    };
}

export function cd(newDir){
    return {
        type: 'CD',
        payload: newDir 
    };
}

export function clear(){
    return {
        type: 'CLEAR'
    };
}