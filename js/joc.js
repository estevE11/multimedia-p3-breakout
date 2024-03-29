class Joc {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.amplada = canvas.width;
        this.alcada = canvas.height;
        this.totxoamplada = 75;
        this.totxoalcada = 20; // MIDES DEL TOTXO EN PÍXELS
        this.totxocolor = "#0ad";

        this.vides = 4;
        this.score = 0;
        this.scores = 0;//JSON.parse(!localStorage['scores'] ? localStorage['scores'] : '{}');
        let val = localStorage['scores'];
        if (!val) {
            this.scores = {};
        } else { 
            this.scores = JSON.parse(val);
        }

        this.username = "";

        this.pala = new Pala(new Punt((this.canvas.width - 60) / 2, this.canvas.height - 15), 60, 4, this, this.canvas);
        this.bola = new Bola(new Punt(this.canvas.width / 2, this.canvas.height / 2), 3, this.pala, this);
        this.totxo = new Totxo(new Punt((this.canvas.width - 120) / 2, (this.canvas.height - 20) / 3), 120, 20, "#0ad");  // només posem un totxo gegant, per veure els xocs
        this.mur = new Mur(this.amplada, this.alcada, this);

        this.display = new Display(this);

        this.key = {
            LEFT: { code: 37, pressed: false },
            RIGHT: { code: 39, pressed: false },
            SPACE: { code: 32, pressed: false },
        };



    }

    draw() {
        this.clearCanvas();
        this.pala.draw(this.ctx);
        this.bola.draw(this.ctx);
        //this.totxo.draw(this.ctx);
        this.mur.draw(this.ctx);
        this.display.draw(this.ctx);
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    dispararBola(x, y) { 
        this.bola.setVelocitat(x, y);
        this.pala.shoot = false;
    }

    inicialitza() {
        this.pala.responsive = true;
        this.score = 0;
        this.vides = 4;
        this.mur.changeLevel($('#sel_level').val());
        this.pala.draw(this.ctx);
        $(document).on("keydown", { joc: this }, function (e) {
            if (e.keyCode == e.data.joc.key.LEFT.code) {
                e.data.joc.key.LEFT.pressed = true;
            }
            else if (e.keyCode == e.data.joc.key.RIGHT.code) {
                e.data.joc.key.RIGHT.pressed = true;
            }
            else if (e.keyCode == e.data.joc.key.SPACE.code) {
                e.data.joc.key.SPACE.pressed = true;
            }
        });
        $(document).on("keyup", { joc: this }, function (e) {
            if (e.keyCode == e.data.joc.key.RIGHT.code) {
                e.data.joc.key.RIGHT.pressed = false;
            }
            else if (e.keyCode == e.data.joc.key.LEFT.code) {
                e.data.joc.key.LEFT.pressed = false;
            }
            else if (e.keyCode == e.data.joc.key.SPACE.code) {
                e.data.joc.key.SPACE.pressed = false;
            }
        });


        requestAnimationFrame(animacio);
    }

    setUsername(username) { 
        this.username = username;
        this.hiscore = this.scores[this.username] | 0;
        this.hiscore = this.scores[this.username] ? this.scores[this.username] : 0;
    }

    addScore(n) { 
        this.score += n;
        if (this.hiscore < this.score) {
            this.hiscore = this.score;
            this.saveScore();
        }
    }

    saveScore() { 
        this.scores[this.username] = this.hiscore;
        localStorage['scores'] = JSON.stringify(this.scores);
    }

    update() {
        this.bola.update();
        this.pala.update();
        //this.totxo.draw(this.ctx);
        this.draw();

    }
}