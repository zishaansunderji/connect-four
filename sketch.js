// Connect four

// let bg;

let BOX_SIZE;
let BOX_PADDING;
let CANVAS_PADDING;
let ROWS;
let COLS;

let board;
let undo;
let redo;

let PLAYER_ONE;
let PLAYER_TWO;
let TURN;

let isWin;
let _text;

class Board {
    constructor(BOX_SIZE, BOX_PADDING, col, row) {
        this.BOX_SIZE = BOX_SIZE;
        this.BOX_PADDING = BOX_PADDING;
        this.COL = col;
        this.ROW = row;
        this.board = this.emptyBoard(col, row);
        this.animateX = null;
        this.animateY = -100;
        this.destinationY = null;
        this.animationSpeed = 10;
    }

    emptyBoard(col, row) {
        const board = [];

        for (let y = 0; y < col; y++) {
            const temp = [];
            for (let x = 0; x < row; x++) {
                temp.push('-');
            }
            board.push(temp);
        }
        return board;
    }

    findFour(x, y) {
        // Horizontal check
        if (x + 3 < this.ROW) {
            if (this.board[y][x] === TURN && this.board[y][x + 1] === TURN && this.board[y][x + 2] === TURN && this.board[y][x + 3] === TURN) {
                if (
                    this.board[y][x] === this.board[y][x + 1] &&
                    this.board[y][x + 1] === this.board[y][x + 2] &&
                    this.board[y][x + 2] === this.board[y][x + 3]
                ) {
                    return true;
                }
            }
        }

        // Vertical check
        if (y + 3 < this.COL) {
            if (this.board[y][x] === TURN && this.board[y + 1][x] === TURN && this.board[y + 2][x] === TURN && this.board[y + 3][x] === TURN) {
                if (
                    this.board[y][x] === this.board[y + 1][x] &&
                    this.board[y + 1][x] === this.board[y + 2][x] &&
                    this.board[y + 2][x] === this.board[y + 3][x]
                ) {
                    return true;
                }
            }
        }

        // Right diagonal check
        if (x + 3 <= this.ROW && y + 3 < this.COL) {
            if (this.board[y][x] === TURN && this.board[y + 1][x + 1] === TURN && this.board[y + 2][x + 2] === TURN && this.board[y + 3][x + 3] === TURN) {
                if (
                    this.board[y][x] === this.board[y + 1][x + 1] &&
                    this.board[y + 1][x + 1] === this.board[y + 2][x + 2] &&
                    this.board[y + 2][x + 2] === this.board[y + 3][x + 3]
                ) {
                    return true;
                }
            }
        }

        // Left diagonal check
        if (y + 3 < this.ROW && x - 3 >= 0) {
            if (this.board[y][x] === TURN && this.board[y + 1][x - 1] === TURN && this.board[y + 2][x - 2] === TURN && this.board[y + 3][x - 3] === TURN) {
                if (
                    this.board[y][x] === this.board[y + 1][x - 1] &&
                    this.board[y + 1][x - 1] === this.board[y + 2][x - 2] &&
                    this.board[y + 2][x - 2] === this.board[y + 3][x - 3]
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    checkWin() {
        for (let y = 0; y < this.COL; y++) {
            for (let x = 0; x < this.ROW; x++) {
                if (this.findFour(x, y)) {
                    return true;
                }
            }
        }
        return false;
    }

    add(y, x, turn) {
        this.animateX = x;
        this.animateY = -100;
        this.destinationY = y;
        this.board[y][x] = turn;
    }

    remove(y, x) {
        this.board[y][x] = '-';
    }

    isEmpty(y, x) {
        if (y < this.COL && x < this.ROW) {
            for (let i = this.COL - 2; i >= 0; i--) {
                if (this.board[i][x] === '-') {
                    return i;
                }
            }
            return -1;
        }
        return -1;
    }

    // This function is for 0 to 1
    // float ParametricBlend(float t)
    // {
    //     float sqt = t * t;
    //     return sqt / (2.0f * (sqt - t) + 1.0f);
    // }

    animate(t, start, end) {
        const sqt = t ** 2;
        return sqt / (2.0 * (sqt - t) + 1.0);
    }

    draw() {
        // Board
        for (let y = 0; y < this.COL - 1; y++) {
            for (let x = 0; x < this.ROW - 1; x++) {
                push();
                if (this.board[y][x] === PLAYER_TWO) {
                    fill(204, 51, 0);
                } else if (this.board[y][x] === PLAYER_ONE) {
                    fill(8, 89, 198);
                } else {
                    // fill('#4B8378')
                    fill(220);
                    // fill(255);
                }

                translate(x * (this.BOX_SIZE + this.BOX_PADDING), y * (this.BOX_SIZE + this.BOX_PADDING), 0);
                if (this.animateX === x && this.destinationY === y) {
                    fill(220);
                }
                sphere(this.BOX_SIZE / 2);

                pop();
            }
        }

        // Animation
        if (this.destinationY) {
            const finalY = this.destinationY * (this.BOX_SIZE + this.BOX_PADDING);
            if (this.animateY <= finalY) {
                push();
                translate(this.animateX * (this.BOX_SIZE + this.BOX_PADDING), this.animateY, 100);
                // Switched because TURN gets changed instantly
                if (TURN === PLAYER_ONE) {
                    fill(204, 51, 0);
                } else if (TURN === PLAYER_TWO) {
                    fill(8, 89, 198);
                }
                sphere(this.BOX_SIZE / 2);
                pop();
                this.animateY += ((finalY - -100) * this.animate(this.animationSpeed * this.animateY, 0, 1)) / this.animationSpeed;
            } else {
                this.destinationY = null;
                this.animateX = 0;
                this.animateY = -100;
            }
        } else {
            this.destinationY = null;
            this.animateX = 0;
            this.animateY = -100;
        }
    }
}

function setup() {
    // bg = loadImage('./assets/sunburst.jpg');
    createCanvas(window.innerWidth, window.innerHeight, WEBGL);
    setAttributes('antialias', true);
    ortho(-width / 2, width / 2, -height / 2, height / 2, 0, 1000);

    isWin = false;

    PLAYER_ONE = 'Y';
    PLAYER_TWO = 'R';
    TURN = PLAYER_ONE;

    ROWS = 8;
    COLS = 7;
    BOX_PADDING = 5;
    BOX_SIZE = min(width / ROWS, height / COLS);
    BOX_SIZE = BOX_SIZE * (1 - BOX_PADDING / BOX_SIZE);
    CANVAS_PADDING = BOX_SIZE / 2;
    board = new Board(BOX_SIZE, BOX_PADDING, COLS, ROWS);

    // Keep track of undo
    undo = [];
    redo = [];

    _text = createGraphics(window.innerWidth, window.innerHeight);
    _text.textFont('Source Code Pro');
    _text.textAlign(CENTER);
    _text.textSize(100);
    _text.textStyle(BOLD);
    _text.fill(30);
    _text.noStroke();
    _text.text('WINNER', width * 0.5, height * 0.55);
}

function draw() {
    // background(bg);
    // push();
    // texture(bg);
    // plane(width, height);

    // pop();

    background('#F5F5F5');
    noStroke();

    translate(-width / 2, -height / 2, 0);
    translate(BOX_SIZE / 2, BOX_SIZE / 2, 0);

    // Cursor
    if (!isWin) {
        const currentX = Math.floor((mouseX - CANVAS_PADDING) / (BOX_SIZE + BOX_PADDING));
        if (currentX >= 0 && currentX < ROWS - 1) {
            push();
            if (TURN === PLAYER_ONE) {
                fill(8, 89, 198);
            } else {
                fill(204, 51, 0);
            }
            translate(currentX * (BOX_SIZE + BOX_PADDING) + BOX_SIZE / 2, -15, 0);
            cone(10);
            pop();
        }
    }

    translate(CANVAS_PADDING, CANVAS_PADDING, 0);

    board.draw();

    if (isWin) {
        push();
        translate(width / 2.7, height / 3, 100);

        texture(_text);
        plane(window.innerWidth, window.innerHeight);
        pop();
    }
}

function switchTurn(turn) {
    if (turn === PLAYER_ONE) {
        TURN = PLAYER_TWO;
    } else {
        TURN = PLAYER_ONE;
    }
}

function mousePressed() {
    const x = Math.floor((mouseX - CANVAS_PADDING) / (BOX_SIZE + BOX_PADDING));
    const y = Math.floor((mouseY - CANVAS_PADDING) / (BOX_SIZE + BOX_PADDING));

    const isEmpty = board.isEmpty(y, x);
    if (isEmpty !== -1 && !isWin) {
        board.add(isEmpty, x, TURN);
        undo.push([isEmpty, x]);
        isWin = board.checkWin();
        switchTurn(TURN);
        redo = [];
    }
}

function keyPressed() {
    if (keyIsDown(CONTROL) && key == 'z') {
        if (undo.length > 0) {
            const coords = undo[undo.length - 1];
            board.remove(coords[0], coords[1]);
            redo.push([coords[0], coords[1]]);
            undo = undo.slice(0, undo.length - 1);
            switchTurn(TURN);
        }
    } else if (keyIsDown(CONTROL) && key == 'y') {
        if (redo.length > 0) {
            const coords = redo[redo.length - 1];
            board.add(coords[0], coords[1], TURN);
            undo.push([coords[0], coords[1]]);
            redo = redo.slice(0, redo.length - 1);
            switchTurn(TURN);
        }
    }
}
