class UserController{

    constructor(formIdCreate, formIdUpdate, tableId){

        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
        this.selectAll();
    }

    onEdit(){

        document.querySelector("#box-user-update .btn-cancel").addEventListener('click', e=>{
            this.showPanelCreate();
        });

        this.formUpdateEl.addEventListener('submit', event=>{
            
            // não permite que a página seja submetida
            event.preventDefault();
            // captura o botão submit pelo type para usar o disabled
            let btn = this.formUpdateEl.querySelector("[type=submit]")
            // desabilita o botão salvar
            btn.disabled=true;

            let values = this.getValues(this.formUpdateEl);

            let index = this.formUpdateEl.dataset.trIndex;

            let tr = this.tableEl.rows[index];

            let userOld = JSON.parse(tr.dataset.user);
            // o assign mescla os objetos. Obs: os objetos mais à direita sobrescrevem os da esquerda
            let result = Object.assign({}, userOld, values);

            
            this.getPhoto(this.formUpdateEl).then(
                (content)=>{
                     // se o usuário não clicar para inserir a foto o values será vazio. Então fazemos teste
                    if(!values.photo){
                        result._photo = userOld._photo;
                    } else {
                        result._photo = content;
                    }
                    
                    let user = new User();

                    user.loadFromJSON(result);

                    user.save();

                    this.getTr(user, tr);
                    
                    this.updateCount();

                    // Zera o formulário
                    this.formUpdateEl.reset();

                    this.formEl.reset();
                    // habilita o botão salvar
                    btn.disabled = false;

                    this.showPanelCreate();
                },
                (e)=>{
                    console.error(e);
                }
            );
        });
    }

    onSubmit(){

        // CAPTURA O EVENTO SUBMIT DO FORMULÁRIO
        // OBS: O this muda de escopo de acordo com a função. Se eu não usar o arrow function, não consigo usar o this.getValues() e chamar o método, pois para this será do formEl
        this.formEl.addEventListener('submit', event=>{

            // não permite que a página seja submetida
            event.preventDefault();
            // captura o botão submit pelo type para usar o disabled
            let btn = this.formEl.querySelector("[type=submit]")
            // desabilita o botão salvar
            btn.disabled=true;

            let values = this.getValues(this.formEl);
            
            if(!values) return false;

            this.getPhoto(this.formEl).then(
                (content)=>{
                    values.photo = content;

                    values.save();

                    this.addLine(values);

                    this.formEl.reset();
                    // habilita o botão salvar
                    btn.disabled = false;
                },
                (e)=>{
                    console.error(e);
                }
            );
        });
    }

    getPhoto(formEl){

        // Promise é uma classe e precisa ser instanciada com new
        return new Promise((resolve, reject)=>{
            let fileReader = new FileReader();

            let elements = [...formEl.elements].filter(item=>{

                if(item.name === 'photo'){
                    return item;
                }

            });

            let file = elements[0].files[0];

            fileReader.onload = ()=>{

                resolve(fileReader.result);

            };

            fileReader.onerror = (e)=>{

                reject();

            }

            // para não dar erro caso o usuário abra a janela de seleção do arquivo, mas não selecione uma foto
            if(file){
                fileReader.readAsDataURL(file);
            }else{
                resolve('dist/img/boxed-bg.jpg');
            }

        });
    }

    getValues(formEl){
        
        let user = {};
        let isValid = true;
        // Não posso fazer um forEach em this.formEl.elements, pois ele é uma coleção Html e não possue a função forEach. Poderia no lugar usar: var fields = document.querySelectorAll("#form-user-create [name]");. Aí sim poderia rodar o forEach para pegar os elementos
        // console.log(typeof this.formEl.elements);

        // Para resolver o problema, uso o operador SPREAD [...this.formEl.elements] que retornará um matríz que pode ser percorrida pelo forEach

        // o loop percorre cada controle do formulário
        [...formEl.elements].forEach((field, index)=>{

            // crio uma falidação do formulário para os campos de preenchimento obrigatório
            if(['name', 'email', 'password'].indexOf(field.name)>-1 && !field.value){

                // ver o elemento html como objeto
                // console.dir(field);
                // adicionando uma classe no elemento
                field.parentElement.classList.add('has-error');
                isValid = false;
            }

            // o JSON serão preenchidos com o nome e o valor dos campos
            if(field.name == "gender"){

                if(field.checked){
                    user[field.name] = field.value;
                } 
            }else if(field.name == "admin"){
                user[field.name] = field.checked;
            }else{

                user[field.name] = field.value;
            }
        });

        if(!isValid){
            return false;
        }

        return new User(
            user.name, 
            user.gender, 
            user.birth, 
            user.country, 
            user.email, 
            user.password, 
            user.photo, 
            user.admin
        );

    }


    selectAll(){
        
        let users = User.getUsersStorage(); 

        users.forEach(dataUser=>{

            let user = new User();

            user.loadFromJSON(dataUser);

            this.addLine(user);

        });
    }

    // // sessionStorege
    // insert(data){
        
    //     let users = this.getUsersStorage();

    //     users.push(data);
    //     // aqui uso sessionStorege
    //     // sessionStorage.setItem("users", JSON.stringify(users));
    //     // aqui uso o localStorege
    //     localStorage.setItem("users", JSON.stringify(users));
    // }

    // INSERE OS ITENS CADASTRADOS
    addLine(dataUser){

        let tr = this.getTr(dataUser);

        // console.log(dataUser);
        
        // insiro a linha com os dados na tabela
        this.tableEl.appendChild(tr);

        // atualiza a quantidade de usuários cadastrados
        this.updateCount();
    }

    getTr(dataUser, tr = null){

        if(tr===null) tr = document.createElement('tr');

        // o dataset é utilizado para inserir uma propriedade ao HTML
        // o método JSON.stringify() converte para um string em JSON, do contrário o dataset converterá em string comum
        tr.dataset.user = JSON.stringify(dataUser);
        // insere o html no elemento criado. IMPORTANTE: USO O TEMPLATE STRING PARA CONSEGUIR QUEBRAR LINHAS
        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin)? 'Sim': 'Não'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
            <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>
        `;

        // adiciona o evento de ediçao.
        this.addEventsTr(tr);

        return tr;
    }

    addEventsTr(tr){

        // acessa o botão excluir da linha
        tr.querySelector(".btn-delete").addEventListener('click', e=>{

            if(confirm('Deseja realmente excluir?')){

                let user = new User();

                user.loadFromJSON(JSON.parse(tr.dataset.user));
                // metodo da model User
                user.remove();
                // comando HTML
                tr.remove();

                this.updateCount();
            }

        });

        // acesso o botão Editar da linha. Para funcionar, insiro a classe btn-edit no botão Editar
        tr.querySelector(".btn-edit").addEventListener('click', e=>{
            // para ver o retorno do elemento
            // console.log(JSON.parse(tr.dataset.user));
            let json = JSON.parse(tr.dataset.user);
            let form = document.querySelector("#form-user-update");
            // guarda o número da linha à partir do zero
            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            // uso forIn para percorrer as propriedades do JSON
            for(let name in json){
                
                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "]");
                
                if(field){
                    // uso switch para verificar outros tipos de controle com radio e checks
                    switch (field.type) {
                        // se achar o campo, mas for do tipo file, então ele não atribuirá o valor por causa do continue
                        case 'file':
                            continue;
                            break;
                        
                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                            field.checked = true;
                        break;

                        case 'checkbox':
                            field.checked = json[name];
                            break;

                        default:
                            field.value = json[name];
                    } 
                }
            }
            
            this.formUpdateEl.querySelector('.photo').src = json._photo;

            this.showPanelUpdate();
            
        });
    }

    showPanelCreate(){
        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";
    }

    showPanelUpdate(){
        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";
    }

    updateCount(){
        let numberUser = 0;
        let numberAdmin = 0;

        // para atualizar a quantidade de usuários será preciso contar a quantidade linhas
        // console.dir() possibilita encontrar verificar métodos, propriedades dos itens
        // console.dir(this.tableEl);
        [...this.tableEl.children].forEach(tr=>{

            numberUser++;
            
            // recuperando pelo dataset
            // o JSON.parse(), converte um JSON em string para objeto   
            // console.log(JSON.parse(tr.dataset.user));
            let user = JSON.parse(tr.dataset.user);

            if(user._admin) numberAdmin++;
        });

        document.querySelector("#number-users").innerHTML = numberUser;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;
    }
}