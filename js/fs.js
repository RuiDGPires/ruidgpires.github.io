class FS {
    constructor(){
        this.folders = { "type": "DIR", "files": {
            "home": { "type": "DIR", "files": {
                "a.txt": {"type": "FILE" },
                "b.txt": {"type": "FILE" },
                "projects": {"type": "DIR", "files": {
                            "snake" : {"type": "FILE", "exe": true, "content": "url: https://github.com/RuiDGPires/Snake;"}
                            }
                        },
                    }
                },

            "bin": { "type": "DIR", "files": {
                    }
                }
            }
        }

        this.setupNodes();
    }

    setupNodes(node = this.folders){
        let child;
        node.files["."] = node;
        if (node == this.folders) node.name = "";

        for (child in node.files){
            if (child == "." || child == "..") continue;
            let child_node = node.files[child];
            child_node.name = child;

            if (typeof child_node.files == "undefined") child_node.files = {};

            child_node.files[".."] = node;

            if (typeof child_node.exe == "undefined")
                child_node.exe = false;
            
            if (child_node.type == "DIR")
                this.setupNodes(child_node);
        }
    }

    pathFromNode(node){
        let path = [] 
        let current_node = node;
        
        while(true){
            if (!(".." in current_node.files)) break;
            path.unshift(current_node.name)
            current_node = current_node.files[".."];
        }
        return path; 
    }

    strToPath(str, current_node = this.folders){
        let working_dir = current_node; 
        if (str == "") return this.pathFromNode(current_node);

        if (str[0] == "/")
            working_dir = this.folders;
        else if (str.substring(0, 2) == "~/"){
            working_dir = this.folders.files["home"];
            str = str.substring(2);
        }
        
        let tmp_path = str.split("/");
        let ret = false;
        tmp_path.filter(node => node != "").forEach(node => {
            if (!(node in working_dir.files)) 
                ret = true;
            working_dir = working_dir.files[node];
        });
        
        if (ret) return null;
        return this.pathFromNode(working_dir);
    }

    pathToString(path){
        if (path.length == 0) return "/";

        let str = "";
        let i = 0;

        if (path[0] == "home"){
            i++
            str += "~";
        }

        path.slice(i).forEach(node => str += "/" + node);

        return str;
    }


    reducePath(path){
          
    }

    getObj(path){
        if (path == null) return null;
        let current_item = this.folders;

        for (let i = 0; i < path.length; i++){
            current_item = current_item.files[path[i]];

            if (typeof current_item == "undefined")
                return null;
        }
    
        return current_item;

    }
}
