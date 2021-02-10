// SOBRE ORIENTAÇÃO A OBJETOS

// 1. VARIÁVEIS
// É mais interessante colocar o elemento na variáveil. Assim, posso captura qualquer informação através dos atributos
// var name = document.querySelector("#exampleInputName");
// var gender = document.querySelectorAll("#form-user-create [name=gender]:checked");
// var birth = document.querySelector("#exampleInputBirth");
// var country = document.querySelector("#exampleInputCountry");
// var email = document.querySelector("#exampleInputEmail");
// var password = document.querySelector("#exampleInputPassword");
// var photo = document.querySelector("#exampleInputFile");
// var admin = document.querySelector("#exampleInputAdmin");

// 2. PEGAR ELEMENTOS ESPECÍFICOS
// É mais interessante colocar o elemento na variáveil. Assim, posso captura qualquer informação através dos atributos
// pega o primeiro elemento
document.querySelector("#form-user-create [name=gender]");
// pega todos os elementos com a name=gender por causa do querySelectorAll
document.querySelectorAll("#form-user-create [name=gender]");
// pega apenas os elementos marcados e que possuam o name=gender
document.querySelectorAll("#form-user-create [name=gender]:checked");

// 3. ATRIBUIR O EVENTO CLICK AOS BUTTONS
document.querySelectorAll("button").forEach(()=>{

    this.addEventListener('click', ()=>{

        console.log('Clicou!');

    });

});

// 4. DATAS
new Date()
Tue Jun 30 2020 21:42:41 GMT-0300 (Hora padrão de Brasília)
// mês no javascript começa do zero
new Date(2018, 4, 5)
Sat May 05 2018 00:00:00 GMT-0300 (Hora padrão de Brasília)
// Mas se passar os dados como um array dentro do construtor, ele fará considerando os meses a partir de 1
new Date([2018, 4, 5])
Thu Apr 05 2018 00:00:00 GMT-0300 (Hora padrão de Brasília)

// Olha que coisa interessante: Tudo por causa do GMT que é o fuso horário
new Date("2018-1-1")
Mon Jan 01 2018 00:00:00 GMT-0200 (Hora de verão de Brasília)
new Date("2018-01-01")
Sun Dec 31 2017 22:00:00 GMT-0200 (Hora de verão de Brasília)

// 4.1. Extrair informações específicas das datas
let dt = new Date()
undefined
dt
Tue Jun 30 2020 22:06:28 GMT-0300 (Hora padrão de Brasília)
dt.getDate()
30
dt.getMonth()
5
dt.getDay()
2
dt.getHours()
22
dt.getYear();
120
dt.getFullYear();
2020
// Timestamp
dt.getTime()
1593565588432

// BIBLIOTECA PARA LIDAR COM DATAS
// moment.js/docs