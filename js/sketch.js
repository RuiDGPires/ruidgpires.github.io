const text_size = 30;
const max_history = 29;

let show_cursor = true;
let cursor_index = 0;
let cursor_interval;

let info_str;
let command_str = "";
let history = [];

let font_regular;
let font_italic;
let font_bold;

let path_index;
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
    if (typeof txt == "string")
        txt = [txt]

    if (history.length >= max_history)
        history.pop();
    history.unshift(txt);
}

function executeCommand(){
    let str = info_str.concat([command_str])
    println(str);

    shell.execute(command_str);
    command_str = "";
    cursor_index = 0;
}

function show_entry_screen() {
    println([]); 
    println([]); 
    println(["                  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓"]);
    println(["                  ╏                                                                ╏"]);
    println(["                  ╏   ██████╗ ██╗   ██╗██╗    ██████╗ ██╗██████╗ ███████╗███████╗  ╏"]);
    println(["                  ╏   ██╔══██╗██║   ██║██║    ██╔══██╗██║██╔══██╗██╔════╝██╔════╝  ╏"]); 
    println(["                  ╏   ██████╔╝██║   ██║██║    ██████╔╝██║██████╔╝█████╗  ███████╗  ╏"]);
    println(["                  ╏   ██╔══██╗██║   ██║██║    ██╔═══╝ ██║██╔══██╗██╔══╝  ╚════██║  ╏"]);
    println(["                  ╏   ██║  ██║╚██████╔╝██║    ██║     ██║██║  ██║███████╗███████║  ╏"]);
    println(["                  ╏   ╚═╝  ╚═╝ ╚═════╝ ╚═╝    ╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝  ╏"]);
    println(["                  ╏                                                                ╏"]);
    println(["                  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"]);
    println([]); 
    println(["                    ┌────────────────────────────────────────────────────────────┐"]); 
    println(["                    |Welcome to my personal page!                                |"]); 
    println(["                    │I'ts kind of empty but you can have a look around :)        │"]); 
    println(["                    └────────────────────────────────────────────────────────────┘"]);
    println(["                    ┌──────────────────────────┬─────────────────────────────────┐"]); 
    println(["                    | Some commands:           |                                 |"]); 
    println(["                    |  - ls  : prints the files|                                 |"]); 
    println(["                    |and folders in the current|You can check some of my projects|"]); 
    println(["                    |directory                 |in the projects folder           |"]); 
    println(["                    |                          |                                 |"]);
    println(["                    |  - cd <path> : change the|                                 |"]); 
    println(["                    │current directory         |                                 │"]); 
    println(["                    └──────────────────────────┴─────────────────────────────────┘"]);
    println([]);
    println([]); 
    println([]); 
    println([]); 
}

function setup() {
    setup_colors();
    show_entry_screen();

    createCanvas(innerWidth, innerHeight);

    path_index = 5;
    info_str = [info_color, "RuiPires", default_color, "@", dir_color, shell.fs.pathToString(shell.current_dir), default_color, "$"];

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
        info_str[path_index] = shell.fs.pathToString(shell.current_dir);
        loopCursor();
        return false;
    } else if (keyCode == TAB) {
        if (command_str[command_str.length-1] == " ") return false;
        
        let words = command_str.split(" ")
        let current_word = words[words.length - 1];
        
        let auto = shell.autocomplete(current_word);
        
        if (auto != ""){
            command_str = command_str.slice(0, command_str.length-current_word.length) + auto;
            cursor_index = command_str.length;
        }

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

    let width = 0;

    info_str.filter(node => typeof node === "string").forEach(node => width += textWidth(node));

    let input_y = y + (history.length + 1)*text_size;

    render_text(info_str, x, input_y);
    command_text(command_str, x + width, input_y);
    draw_history(x, input_y - text_size);

    pop()
}

function draw() {
    background(background_color);

    fill(0, 0, 0);
    let x = 10;
    let y = 10;

    let size_x = 10*innerWidth/17;
    let size_y = text_size * (max_history + 1.5) + 10;
    draw_text(x, y);
}
