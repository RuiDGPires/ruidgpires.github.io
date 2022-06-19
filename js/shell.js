class Shell {
    constructor(){
        this.fs = new FS();

        this.commands = {
            "clear": {"exe": (args = []) => history = []},
            "ls": {"exe": (args = []) => {
                        let dir = this.fs.list("/");
                        let lst = [];
                        
                        let item;
                        for (item in dir){
                            let item_str = item + "  "
                            if (dir[item].type == "DIR"){
                                lst.push(dir_color);
                                lst.push(item_str);
                                lst.push(default_color);
                            } else {
                                lst.push(item_str);
                            }
                        }

                        println(lst);
                        }
                },

            "": {"exe": (args = []) => {}}
        }

        this.path = "RuiPires$";
    }

    execute(str){
        let lst = str.split(" ");
        let command = lst[0];

        if (command in this.commands)
            this.commands[command]["exe"](lst.splice(1));
        else
            println(["", "Unkown Command: \"" + command + "\""]);
    } 
}
