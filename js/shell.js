function commonSubStr(arr) {
    let str = "";

    if (arr.length == 0) return "";

    for (let c = 0; c < arr[0].length; c++) {
        let current = arr[0][c];
        for (let i = 1; i < arr.length; i++) {
            if (arr[i][c] !== current) return str;
        }
        str += current;
    }
    return str;
}

function evalLine(line, args) {

    console.log(new_line);
    eval(new_line);
}

class Shell {
    constructor(){
        this.fs = new FS();
        this.current_dir = ["home"];
        this.PATH = ["/bin"];

        this.commands = {
            "clear": () => history = [],
            "ls": () => {
                        let dir = this.fs.getObj(this.current_dir);
                        if (typeof dir == "undefined" || dir.type != "DIR") {
                            println(pathToString(this.current_dir) + " is not a directory");
                        }else {
                            dir = dir.files;
                        }

                        let lst = [];
                        
                        let item;
                        for (item in dir){
                            if (item == "." || item == "..") continue;

                            let item_str = item + "  ";
                            if (dir[item].type == "DIR"){
                                lst.push(dir_color);
                                lst.push(item_str);
                                lst.push(default_color);
                            } else if (dir[item].exe == true) {
                                lst.push(exe_color);
                                lst.push(item_str);
                                lst.push(default_color);
                            } else {
                                lst.push(item_str);
                            }
                        }

                        println(lst);
                        },

            "cd": (args = []) => {
                let path = args[0];
                let working_dir;

                if (typeof path == "undefined" || path == ""){
                    this.current_dir = ["home"];
                    return;
                }

                let tmp = this.fs.strToPath(path, this.fs.getObj(this.current_dir));
                if (tmp == null || this.fs.getObj(tmp).type != "DIR")
                    println("\"" + path + "\" is not a valid directory");
                else{
                    this.current_dir = tmp;
                }
            },

            "cat": (args = []) => {
                let path = args[0];
                if (typeof path == "undefined" || path == "") 
                    return;

                let tmp = this.fs.strToPath(path, this.fs.getObj(this.current_dir));
                if (tmp == null || this.fs.getObj(tmp).type != "FILE") {
                    println("\"" + path + "\" is not a file");
                } else {
                    let content = this.fs.getObj(tmp).content.split("\n");
                    for (let i = 0; i < content.length; i++) {
                        println(content[i]);
                    }
                }
            },

            "exit": () => {close()},

            "": () => {},
        }

        this.path = "RuiPires$";
    }

    execute(str){
        let lst = str.split(" ");
        let command = lst[0];
        let args = lst.splice(1);

        if (command in this.commands)
            this.commands[command](args);
        else{
            let objs = [this.fs.getObj(this.fs.strToPath(command, this.fs.getObj(this.current_dir)))];

            this.PATH.forEach(path => {
                objs.push(this.fs.getObj(this.fs.strToPath(path).concat(command)));
            });

            objs = objs.filter(obj => obj != null && obj.exe == true);

            if (objs.length == 0)
                println(["", "Unkown Command: \"" + command + "\""]);
            else
                this.exe_file(objs[0], args);
        }
    } 

    exe_file(obj, args){
        //TMP
        let str = obj.content;

        if (typeof str != "string")
            return;
        let contents = str.split("\n");
        if (contents[0] === "#!"){
            for (let i = 1; i < contents.length; i++) {
                console.log(contents[i].trim());
                this.execute(contents[i].trim());
            }
        } else if (contents[0] === "#!js") {
            let src = contents.splice(1).join("\n").trim().replace(/\$\d+/g, (match) => "_args[" + (int(match.slice(1)) - 1) + "]");

            var wrap = s => "return (_args) => {" + s  + "}";

            (new Function(wrap(src))).call(null).call(null, args);
        }

    }

    autocomplete(str){
        let files = this.fs.getObj(shell.current_dir);

        let tmp = this.fs.strToPath(str, this.fs.getObj(this.current_dir));

        let folder;
        let files_lst;

        
        if (tmp == null){
            // Remove last section and search for the parent folder
            tmp = str.split("/");
            let filename = tmp[tmp.length - 1];
            str = str.substring(0, str.length - filename.length);

            tmp = this.fs.strToPath(str, this.fs.getObj(this.current_dir));
            folder = this.fs.getObj(tmp);
            
            files_lst = Object.keys(folder.files).filter(file => file.match("^" + filename + ".*$") && file != "." && file != "..");
        }else{
            let obj = this.fs.getObj(tmp);

            if (obj.type == "DIR") {
                files_lst = Object.keys(obj.files).filter(file => file != "." && file != "..");

                folder = obj;
                if (str[str.length - 1] != "/")
                    str += "/";

            }else return "";
        }

        if (files_lst.length >= 1){
            let ret = str;
            ret += commonSubStr(files_lst);
            if (folder.files[files_lst[0]].type == "DIR" && ret[ret.length - 1] != "/"){
                ret += "/";
            }
            return ret;
        }
        
        return "";
    }
}

