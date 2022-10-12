import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { Enemy, FlyingEnemy, GroundEnemy, ClimbingEnemy} from "./enemy.js";
import { UI } from "./UI.js";
import { Dust, Splash, Fire } from "./particles.js";
import "./style.css";
import { CollisionAnimation } from "./collisionAnimation.js";

export class Game{
    constructor(width, height){
        this.gameInitSpeed=500;
        this.playerInitX=width*0.25;
        this.playerInitY=height-91.3-80;
        this.inityInterval=1000;

        this.width=width;
        this.height=height;
        this.speed=500;
        this.ax=0;
        this.groundMargin=80;
        this.debug=false;
        this.score=0;
        this.fontColor="black";
        this.time=100000;
        this.gameOver=false;
        this.win=false;

        this.player=new Player(this);
        this.player.x=this.playerInitX;
        this.player.y=this.playerInitY;

        this.input=new InputHandler(this);

        this.UI = new UI(this);

        this.background=new Background(this, -this.speed, -this.ax);

        /**@type {Enemy[]} */
        this.enemies=[];
        this.particles=[];
        this.collisions=[];

        //this.maxParticles=50;
        this.enemyTimer=0;
        this.enemyInterval=this.inityInterval;
        this.enemyIntervalAdd=5;
    }
    update(deltaTime){
        this.enemyInterval-=this.enemyIntervalAdd*deltaTime*0.001;
        this.speed+=this.ax*deltaTime*0.001;
        this.time-=deltaTime;
        if(this.time<=0){
            this.gameOver=true;
            this.win=true;
        }        
        this.background.update(deltaTime);

        //
        let hasCollision=this.enemies.some((enemy)=>{
            if(this.checkCollision(enemy,this.player)){
                enemy.markedForDeletion=true;
                return true;
            }
        })
        
        if(hasCollision){
            if(this.player.currentState===this.player.states[this.player.stateIndexs.FIREROLLING]||this.player.currentState===this.player.states[this.player.stateIndexs.FIREDIVING]){
                this.score++;            
            }else{
                this.gameOver=true;
                this.win=false;
            }
                
        }

        this.player.update(this.input.keys, deltaTime,hasCollision);
        //
        if(this.enemyTimer>this.enemyInterval){
            this.addEnemy();
            this.enemyTimer=0;
        }else{
            this.enemyTimer+=deltaTime;
        };
        //add particles
        if(hasCollision){
            let collision=new CollisionAnimation(this, this.player.x+this.player.sprite.width*0.5, this.player.y+this.player.sprite.height*0.5);
            collision.speedX=-this.speed;
            collision.ax=-this.ax;
            this.collisions.push(collision);
        }
        if(this.player.currentState===this.player.states[this.player.stateIndexs.RUNNING]){
            let particle=new Dust(this, this.player.x+this.player.sprite.width*0.5, this.player.y+this.player.sprite.height*0.8);
            particle.speedX=-this.speed;
            particle.ax=-this.ax;
            this.particles.push(particle);
        }
        if(this.player.fireReady){
            let particle=new Splash(this, this.player.x+Math.random()*this.player.sprite.width*0.5, this.player.y+Math.random()*this.player.sprite.height*0.5, Math.random()*20+20);                
            particle.speedX=-this.speed;
            particle.ax=-this.ax;
            this.particles.push(particle);
        }
        if(this.player.justLanded){
            for(let i=0;i<20;++i){
                let particle=new Splash(this, this.player.x+this.player.sprite.width*0.5, this.player.y);
                particle.speedX=-this.speed;
                particle.ax=-this.ax;
                this.particles.push(particle);
            }
            this.player.justLanded=false;
        }    
            
        if(this.player.currentState===this.player.states[this.player.stateIndexs.FIREROLLING]||this.player.currentState===this.player.states[this.player.stateIndexs.FIREDIVING])
            for(let i=0;i<5;++i){
                let particle=new Fire(this, this.player.x+this.player.sprite.width*0.6, this.player.y+this.player.sprite.height*0.58);                
                particle.speedX=-this.speed;
                particle.ax=-this.ax;
                this.particles.push(particle);
            }
            
        //
        this.enemies.forEach(enemy=>{
            enemy.update(deltaTime);
        });
        this.enemies=this.enemies.filter(enemy=>!enemy.markedForDeletion)
        
        this.particles.forEach((particle, index)=>{
            particle.update(deltaTime);
            if(particle.markedForDeletion) this.particles.splice(index, 1);
        })

        this.collisions.forEach((collision, index)=>{
            collision.update(deltaTime);
            if(collision.markedForDeletion) this.collisions.splice(index, 1);
        });
    }
    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context){
        this.background.draw(context);
        this.player.draw(context);
        this.enemies.forEach(enemy=>{
            enemy.draw(context);
        })

        this.particles.forEach((particle)=>{
            particle.draw(context);
        });

        this.collisions.forEach((collision)=>{
            collision.draw(context);
        });

        this.UI.draw(context);
    }
    addEnemy(){
        let num = Math.random();
        if(num>0.66){
            let enemy=new GroundEnemy(this);
            enemy.speedX=-this.speed;
            enemy.ax=-this.ax;
            this.enemies.push(enemy);
        }else if(num>0.33){
            let enemy=new ClimbingEnemy(this);
            enemy.speedX=-this.speed;
            enemy.ax=-this.ax;
            this.enemies.push(enemy);
        }else{
            let enemy=new FlyingEnemy(this);
            enemy.speedX=-this.speed*1.5;
            enemy.ax=-this.ax*1.5;
            this.enemies.push(enemy);
        }
    }
    checkCollision(obj1,obj2){
        if(
            obj1.x < obj2.x+obj2.width&&
            obj1.x+obj1.width>obj2.x&&
            obj1.y<obj2.y+obj2.height&&
            obj1.y+obj1.height>obj2.y
        )
            return true;
        else return false;
    }
    onGround(obj){
        return obj.sprite.y>=this.height-obj.sprite.height-this.groundMargin;
    }
    reStart(){
        this.speed=this.gameInitSpeed;
        this.ax=0;
        this.debug=false;
        this.score=0;
        this.gameOver=false;
        this.win=false;

        this.player=new Player(this);
        this.player.x=this.playerInitX;
        this.player.y=this.playerInitY;

        this.input=new InputHandler(this);

        this.UI = new UI(this);

        this.background=new Background(this, -this.speed, -this.ax);

        this.enemies=[];
        this.particles=[];
        this.collisions=[];

        this.enemyTimer=0;
        this.enemyInterval=this.inityInterval;
    }
}