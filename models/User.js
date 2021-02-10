class User{

    constructor(name, gender, birth, country, email, password, photo, admin){

        this._id;
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();

    }

    get id(){
        return this._id;
    }

    get register(){
        return this._register;
    }

    get name(){
        return this._name;
    }
    get gender(){
        return this._gender;
    }
    get birth(){
        return this._birth;
    }
    get country(){
        return this._country;
    }
    get email(){
        return this._email;
    }
    get password(){
        return this._password;
    }
    get photo(){
        return this._photo;
    }
    get admin(){
        return this._admin;
    }

    set photo(value){
        this._photo = value;
    }

    loadFromJSON(json){

        for(let name in json){

            switch(name){
                case '_register':
                    this[name] = new Date(json[name]);
                break;
                default:
                    this[name] = json[name];
            }

            
        }
    }

    static getUsersStorage(){
        let users = [];

        // se for sessionStorege é só substituir o localStorage
        if(localStorage.getItem("users")){
            users = JSON.parse(localStorage.getItem("users"));
        }

        return users;
    }

    getNewId(){
        
        // não vou salvar mais na Window, mas sim no localStorage
        // if(!window.id) window.id = 0;

        let usersId = parseInt(localStorage.getItem("usersId"));

        if(!usersId > 0) usersId = 0;

        usersId++;

        localStorage.setItem("usersId", usersId);

        return usersId;
    }

    save(){
        // array de dados armazenado no localStorege
        let users = User.getUsersStorage();

        if(this.id > 0){

            // a função map passa por cada item o array e já posso substituir os mesmos
            users.map(u=>{

                if(u._id == this.id){

                    // ele compara e tudo que ele tem igual ele mantem o que vem do this
                    Object.assign(u, this);

                }

                return u;
            });

        }else{

            this._id = this.getNewId();
            
            users.push(this);
            
        }
        
        // aqui uso sessionStorege
        // sessionStorage.setItem("users", JSON.stringify(users));
        // aqui uso o localStorege para armazenas as informações
        localStorage.setItem("users", JSON.stringify(users));
    }

    remove(){
        // array de dados armazenado no localStorege
        let users = User.getUsersStorage();

        users.forEach((userData, index)=>{

            if(this._id == userData._id){

                // o splice remove itens de arrays É só passar o índice e a quantidade
                users.splice(index, 1);
                // console.log(userData, index);

            }

        });

        // aqui uso o localStorege para armazenas as informações
        localStorage.setItem("users", JSON.stringify(users));
    }
}