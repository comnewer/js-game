import { Game } from "./game.js";
window.addEventListener("load", function(){
    
    /**@type {HTMLCanvasElement} */
    const canvas= this.document.createElement("canvas");
    canvas.id="canvas1";
    this.document.getElementsByTagName("body")[0].appendChild(canvas);
    const ctx=canvas.getContext("2d");
    canvas.width=800;
    canvas.height=500;

    const game = new Game(canvas.width, canvas.height);
    let lastTime=0;

    function animate(timeStamp=0){
        const deltaTime=timeStamp-lastTime;
        lastTime=timeStamp;
        if(!game.gameOver){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            game.update(deltaTime);
            game.draw(ctx);
        } else{
            if(game.input.keys.includes("r"))
                game.reStart();
        }
        requestAnimationFrame(animate);
    }
    animate();
})