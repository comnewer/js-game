export const KeysObj={
    LEFT_KEY:  "ArrowLeft",
    RIGHT_KEY: "ArrowRight",
    UP_KEY:    "ArrowUp",
    DOWN_KEY:  "ArrowDown",
    RUSH_KEY:  "Enter",
    RESTART_KEY: "r",
    PAUSE_KEY: "Escape"
}
const validKeys=((KeysObj)=>{ 
    const KeysArr=[];
    const keys=Object.keys(KeysObj);
    for(let i=0;i<keys.length;++i)
        KeysArr.push(KeysObj[keys[i]]);
    return KeysArr;
})(KeysObj);

export class InputHandler{
    constructor(game){
        this.keys=[];
        this.game=game;
        window.addEventListener("keydown",(e)=>{
            if(validKeys.includes(e.key)&&!this.keys.includes(e.key)){
                this.keys.push(e.key);
            }else if(e.key==="d") this.game.debug=!this.game.debug;
            //console.log(this.keys);
        });
        window.addEventListener("keyup",(e)=>{
            if(validKeys.includes(e.key)&&this.keys.includes(e.key)){
                this.keys.splice(this.keys.indexOf(e.key),1);
            }
            //console.log(this.keys);
        });
    }
}