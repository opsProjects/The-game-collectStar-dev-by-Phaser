/**@type{ import('../typeing/phaser') } */

var config={
    type:Phaser.AUTO,
    height:600,
    width:800,
    physics:{
        default:"arcade",
        arcade:{
            gravity:{y:300},
            debug:false
        }
    },
    scene:{
        preload:preload,
        create:create,
        update:update
    }
}
var platforms
var player
var cursors
var stars
var scoreText
var score=0
var bombs
var game=new Phaser.Game(config)
function preload(){
    this.load.image('sky','../images/sky.png')
    this.load.spritesheet('dude','../images/dude.png',{frameWidth:32,frameHeight:48})
    this.load.image('platform','../images/platform.png')
    this.load.image('bomb','../images/bomb.png')
    this.load.image('star','../images/star.png')
}
function create(){
    this.add.image(400,300,'sky')
    platforms=this.physics.add.staticGroup()
    platforms.create(400,580,'platform').setScale(2).refreshBody()
    platforms.create(0,400,'platform')
    platforms.create(650,280,'platform')
    platforms.create(80,120,'platform')

    player=this.physics.add.sprite(400,50,'dude')
    player.setBounce(0.2)
    player.setCollideWorldBounds(true)
    player.body.setGravityY(0)

    this.anims.create({
        key:'left',
        frames:this.anims.generateFrameNumbers('dude',{start:0,end:3}),
        frameRate:10,
        repeat:-1
    })
    this.anims.create({
        key:'turn',
        frames:[{key:'dude',frame:4}],
        frameRate:20
    })
    this.anims.create({
        key:'right',
        frames:this.anims.generateFrameNumbers('dude',{start:5,end:8}),
        frameRate:10,
        repeat:-1
    })

    stars=this.physics.add.group({
        key:'star',
        repeat:11,
        setXY:{x:12,y:0,stepX:70}
    })    
    stars.children.iterate(function(child){
        child.setBounceY(Phaser.Math.FloatBetween(0.4,0.8))
    })

    scoreText=this.add.text(20,20,'Score:0',{fontSize:"32px",fill:"#000"})

    bombs=this.physics.add.group()

    this.physics.add.collider(player,platforms)
    this.physics.add.collider(stars,platforms)
    this.physics.add.overlap(player,stars,collectStar,null,this)
    this.physics.add.collider( bombs,platforms )
    this.physics.add.collider( player,bombs,hitBomb,null,this )
}
function update(){
    cursors=this.input.keyboard.createCursorKeys()
    if (cursors.left.isDown){
        player.setVelocityX(-160)
        player.anims.play('left',true)
    }else if(cursors.right.isDown){
        player.setVelocityX(200)
        player.anims.play('right',true)
    }else{
        player.setVelocityX(0)
        player.anims.play('turn',true)
    }
    if(cursors.up.isDown && player.body.touching.down){
        player.setVelocityY(-320)
    }

}
function collectStar(player,star){
    star.disableBody(true,true)
    score+=10
    scoreText.setText("Score:"+score)
    if(stars.countActive(true)===0){
        stars.children.iterate(function(child){
            child.enableBody(true,child.x,0,true,true)
        })
        var x=(player.x<400?Phaser.Math.Between(400,800):Phaser.Math.Between(0,400))
        var bomb=bombs.create(x,10,'bomb')
        bomb.setBounce(1)
        bomb.setCollideWorldBounds(true)
        bomb.setVelocity(Phaser.Math.Between(-200,200),20)
        bomb.allowGravity=false
    }
}
function hitBomb(){
    this.physics.pause()
    player.setTint(0xff0000)
    player.anims.play('turn')
    gameOver=true
}
