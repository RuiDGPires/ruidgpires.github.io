class Shell {
    constructor(){
        this.fs = new FS();
        this.current_dir = ["home"];
        this.PATH = ["bin"];

        this.commands = {
            "clear": () => history = [],
            "ls": () => {
                        let dir = this.fs.getObj(this.current_dir);
                        if (typeof dir == "undefined" || dir.type != "DIR") {
                            println(pathToString(this.current_dir) + " is not a directory");
                        }else {
                            dir = dir.contents;
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
                    this.current_dir = [];
                    return;
                }

                let tmp = this.fs.strToPath(path, this.fs.getObj(this.current_dir));
                if (tmp == null || this.fs.getObj(tmp).type != "DIR")
                    println("\"" + path + "\" is not a valid directory");
                else{
                    this.current_dir = tmp;
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

        if (command in this.commands)
            this.commands[command](lst.splice(1));
        else
            println(["", "Unkown Command: \"" + command + "\""]);
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
            
            files_lst = Object.keys(folder.contents).filter(file => file.match("^" + filename + ".*$") && file != "." && file != "..");
        }else{
            let obj = this.fs.getObj(tmp);

            if (obj.type == "DIR") {
                files_lst = Object.keys(obj.contents).filter(file => file != "." && file != "..");

                folder = obj;
            }else return "";
        }

        console.log(files_lst);

        if (files_lst.length == 1){
            let ret = str;
            ret += files_lst[0];
            if (folder.contents[files_lst[0]].type == "DIR"){
                ret += "/";
            }
            return ret;
        }
        
        return "";
    }
}

