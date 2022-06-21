class FS {
    constructor(){
        this.folders = { "type": "DIR", "contents": {
            "home": { "type": "DIR", "contents": {
                "a.txt": {"type": "FILE" },
                "b.txt": {"type": "FILE" },
                "projects": {"type": "DIR", "contents": {
                        "snake" : {"type": "FILE" }
                            }
                        },
                    }
                },

            "bin": { "type": "DIR", "contents": {
                    }
                }
            }
        }

        this.setupNodes();
    }

    setupNodes(node = this.folders){
        let child;
        node.contents["."] = node;
        if (node == this.folders) node.name = "";

        for (child in node.contents){
            if (child == "." || child == "..") continue;
            let child_node = node.contents[child];
            child_node.name = child;

            if (child_node.contents == undefined) child_node.contents = {};

            child_node.contents[".."] = node;
            
            if (child_node.type == "DIR")
                this.setupNodes(child_node);
        }
    }

    pathFromNode(node){
        let path = [] 
        let current_node = node;
        
        while(true){
            if (!(".." in current_node.contents)) break;
            path.unshift(current_node.name)
            current_node = current_node.contents[".."];
        }
        return path; 
    }

    strToPath(str, current_node = this.folders){
        let working_dir = current_node; 
        if (str == "") return this.pathFromNode(current_node);

        if (str[0] == "/")
            working_dir = this.folders;
        else if (str.substring(0, 2) == "~/"){
            working_dir = this.folders.contents["home"];
            str = str.substring(2);
        }
        
        let tmp_path = str.split("/");
        let ret = false;
        tmp_path.filter(node => node != "").forEach(node => {
            if (!(node in working_dir.contents)) 
                ret = true;
            working_dir = working_dir.contents[node];
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
        let current_item = this.folders;

        for (let i = 0; i < path.length; i++){
            current_item = current_item.contents[path[i]];

            if (typeof current_item == "undefined")
                return null;
        }
    
        return current_item;

    }
}
