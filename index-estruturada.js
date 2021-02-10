// À partir daqui, será construída uma forma otimizada das declarações de variávies. O objetivo é torna o código mais flexivel
// capituro todos os campos do formulário que possuem name com o querySelectorAll
var fields = document.querySelectorAll('#form-user-create [name]');
// crio a estrutura do JSON
var user = {};

// INSERE OS ITENS CADASTRADOS
function addLine(dataUser){

    // criar elemento html
    var tr = document.createElement("tr");

    // insere o html no elemento criado. IMPORTANTE: USO O TEMPLATE STRING PARA CONSEGUIR QUEBRAR LINHAS
    tr.innerHTML = `
                        <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
                        <td>${dataUser.name}</td>
                        <td>${dataUser.email}</td>
                        <td>${dataUser.admin}</td>
                        <td>${dataUser.birth}</td>
                        <td>
                        <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                        <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                        </td>
                    `;
    document.getElementById("table-users").appendChild(tr);

}

// CAPTURA O EVENTO SUBMIT DO FORMULÁRIO
document.getElementById('form-user-create').addEventListener('submit', (event)=>{

    event.preventDefault();
    
    // o loop percorre cada controle do formulário
    fields.forEach((field, index)=>{
        // o JSON serão preenchidos com o nome e o valor dos campos
        if(field.name == "gender"){

            if(field.checked){
                user[field.name] = field.value;
            } 
        }else{

            user[field.name] = field.value;
        }
    });

    // console.log(user);

    addLine(user);
});

