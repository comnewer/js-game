export class UI{
    constructor(game){
        this.game=game;
        this.fontSize=30;
        this.fontFamily="Helvetica";
    }
    /**
     * @param {CanvasRenderingContext2D} context
     * 
    */
    draw(context){
        context.save();
        context.shadowOffsetX=2;
        context.shadowOffsetY=2;
        context.shadowColor="white";
        context.shadowBlur=0;
        context.font=this.fontSize+'px '+this.fontFamily;
        context.textAlign='left';
        context.fillStyle=this.game.fontColor;
        //score
        context.fillText("Score: "+this.game.score, 20, 50);
        context.font=this.fontSize*0.8+'px '+this.fontFamily;
        context.fillText("Time: "+(this.game.time*0.001).toFixed(1), 20, 80);
        if(this.game.gameOver){    
            context.textAlign="left";
            context.font=this.fontSize*1.5+'px '+this.fontFamily;            
            if(this.game.win){
                context.fillText("WIN!!!", this.game.width*0.3, this.game.height*0.4);
                context.font=this.fontSize*0.7+'px '+this.fontFamily;
                context.fillText("You kept alive. Press \"R\" to play again .", this.game.width*0.3, this.game.height*0.4+40);
            }else{
                context.fillText("LOSE?", this.game.width*0.3, this.game.height*0.4);
                context.font=this.fontSize*0.7+'px '+this.fontFamily;
                context.fillText("Press \"R\" to try again. Better Luck next time", this.game.width*0.3, this.game.height*0.4+40);
            }   
        }
        context.restore();
    }
}