const text_size = 30;
const max_history = 22;

let show_cursor = true;
let cursor_index = 0;
let cursor_interval;

let info_color;
let dir_color;
let command_color;
let default_color;

let info_str = "RuiPires$";
let command_str = "";
let history = [ [],[],[],[],[],[],[],["└────────────────────────────────────────────────────────────┘"], ["│Nothing is implemented yet but you can have a look around :)│"], ["|Welcome to my personal page!                                |"], ["┌────────────────────────────────────────────────────────────┐"]];

let font_regular;
let font_italic;
let font_bold;

let shell = new Shell();

function preload(){
    font_regular = loadFont("../fonts/static/SourceCodePro-Regular.ttf");
    font_italic = loadFont( "../fonts/static/SourceCodePro-Italic.ttf");
    font_bold = loadFont(   "../fonts/static/SourceCodePro-Bold.ttf");
}

function loopCursor(){
    show_cursor = true;
    clearInterval(cursor_interval);
    cursor_interval = setInterval(() => {show_cursor = !show_cursor}, 500);
}

function putChar(c){
    command_str = command_str.substring(0, cursor_index) + c + command_str.substring(cursor_index);
    cursor_index++;
}

function takeChar(left = true){
    if (left){
        if (cursor_index === 0) return;

        command_str = command_str.substring(0, cursor_index-1) + command_str.substring(cursor_index);
        cursor_index--;
    }else{
        if (cursor_index === command_str.length) return;
        command_str = command_str.substring(0, cursor_index) + command_str.substring(cursor_index+1);
    }
}

function println(txt){
    if (history.length >= max_history)
        history.pop();
    history.unshift(txt);
}

function executeCommand(){
    println([info_color, info_str, command_color, command_str]);

    shell.execute(command_str);
    command_str = "";
    cursor_index = 0;
}

function setup() {
    createCanvas(innerWidth, innerHeight);
    info_color = color(0, 200, 10);
    default_color = color(200, 200, 200);
    dir_color = color(0, 70, 255);
    command_color = default_color;

    loopCursor();
}

function keyPressed() {
    if (keyCode === RIGHT_ARROW) {
        if (cursor_index < command_str.length)
            cursor_index++;
        loopCursor();
        return false;
    } else if (keyCode === LEFT_ARROW) {
        if (cursor_index > 0)
            cursor_index--;
        loopCursor();
        return false;
    } else if (keyCode === BACKSPACE) {
        takeChar();
        loopCursor();
        return false;
    } else if (keyCode === DELETE) {
        takeChar(false);
        loopCursor();
        return false;
    } else if (keyCode === ENTER) {
        executeCommand();
        loopCursor();
        return false;
    }

}

function keyTyped() {
    let code = key.charCodeAt(0);
    if (code >= 32 && code <= 126)
        putChar(String.fromCharCode(code));
    return false;
}

function render_text(txt, x, y, cursor = false){
    push();

    let current_x = x;
    let full_txt = "";

    
    fill(default_color)
    txt.forEach(item => {
        if (item instanceof p5.Color)
            fill(item);
        else {
            let width  = textWidth(item);
            full_txt += item;
            text(item, current_x, y);
            current_x += width;
        }
    });

    if (cursor){
        let part1 = full_txt.substring(0, cursor_index);
        let width  = textWidth(part1);
        let height = text_size;

        fill(255, 255, 255);
        if (show_cursor)
            rect(x+width-1, y-height*0.79, text_size*0.075, height*0.8);
    }

    pop();
}

function draw_history(x, y) {
    push();
    textFont(font_regular);
    textSize(text_size);

    for (let i = 0; i < history.length; i++)
        render_text(history[i], x, y - i*text_size);

    pop();
}

function command_text(txt, x, y){
    render_text([txt], x, y, true);
}

function draw_text(x, y){
    push();
    textSize(text_size);
    textFont(font_regular);

    let width  = textWidth(info_str);

    render_text([info_color, info_str], x, y);
    command_text(command_str, x + width, y);
    draw_history(x, y - text_size);

    pop()
}

function draw() {
    background(50, 50, 60);

    fill(0, 0, 0);
    let x = 20;
    let y = 800;

    let size_x = 10*innerWidth/17;
    let size_y = text_size * (max_history + 1) + 10;
    rect(x-5, y-size_y+10, size_x, size_y, 20);
    draw_text(x, y);
}
