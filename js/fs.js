class FS {
    constructor(){
        this.folders = {
            "a.txt": {"type": "FILE" },
            "b.txt": {"type": "FILE" },
            "folder": {"type": "DIR", "contents": {
                    "c.txt" : {"type": "FILE" }
                }
            },
        }
    }

    list(path){
        let lst_path = path.split("/").filter(node => node != "");
        let current_folder = this.folders;

        for (let i = 0; i < lst_path.length; i++){
            current_folder = current_folder[lst_path[i]];
        }
    
        let items = [];

        let item;
        for (item in current_folder){
            items.push(item);
        }

        return current_folder;
    }
}
