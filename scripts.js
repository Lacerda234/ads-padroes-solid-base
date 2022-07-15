
let modal = document.getElementById('cadastrados-modal');
let nome = document.getElementById('txtNome')
let nameValidation = document.getElementById('name-validation')
let email = document.getElementById('txtEmail')
let mailValidation = document.getElementById('mail-validation')


function openModal(id){

    if (verificarModal())
        return;

    document.getElementById(id).style.display = 'block'
    document.body.style.overflow = 'hidden';
    mailValidation.innerText = '';

}

function openModalConfirmacao(){

    if (verificarModal())
    return;

  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  mailValidation.innerText = '';
  
}

function verificarModal(){
    if (typeof modal == 'undefined' || modal === null)
        return true;
}

function closeModal(id){

    if (verificarModal()){
        return;
    }

    document.getElementById(id).style.display = 'none'

}


function validarNome(){

  if (nome.value.length < 3) {
      nameValidation.innerText = 'Por favor, preencha o campo nome';
      nome.style.border = '';
  }
  else {
    nameValidation.innerText = '';
  }

}

function validarEmail(){
  
    const regexmail = /\S+@\S+\.\S+/;

    if (regexmail.test(email.value)) {
        mailValidation.innerText = 'Seu email é válido';
        mailValidation.style.color = 'lime';
    }
    else {
        mailValidation.innerText = 'Seu email não é válido';
        mailValidation.style.color = 'red';
    }

}


function verificarCamposVazios(){

  let campoNome = document.querySelector('#txtNome').value
  let campoEmail = document.querySelector('#txtEmail').value
  

  if (campoEmail == '' || campoNome == '') {
    alert('Preencha os campos')
    return true;
  }

  return false;

}


function obterUsuarios(){
    return JSON.parse(localStorage.getItem('usuarios'))
}


let operacao = 'A';
let usuarios;
let resultSorteio = [];

if (localStorage.getItem('usuarios')) {
    usuarios = obterUsuarios()
}
else {
    usuarios = [];
}
function numpar(e) {
    if (e % 2 == 0) {

        return true;

    } else {
        return false;
    }
}

let indice_selecionado = -1;
const frmCadastro = document.getElementById('frmCadastro');

function add() {
    if (operacao == 'A') {
        return Adicionar();
    }
    else {
        return Editar();

    }

}

function Adicionar() {
    let usuario = {
        nome: document.querySelector('#txtNome').value,
        email: document.querySelector('#txtEmail').value
    }
    
    if(verificarCamposVazios()){
      return;
    }
    else {
        usuarios.push(usuario);
        resultSorteio.push(usuario.nome);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        openModal('cadastro-modal')
        return true;
    }
}


function cleantext() {
    document.querySelector("#txtNome").value = '';
    document.querySelector("#txtEmail").value = '';
}

function handleEditar(e) {

    operacao = "E";
    indice_selecionado = parseInt(e.getAttribute("alt"));
    let users = obterUsuarios();
    let user = users[indice_selecionado];

    document.querySelector("#txtNome").value = user.nome;
    document.querySelector("#txtEmail").value = user.email;

    if (verificarModal())
        return;

    modal.style.display = 'none';

}

function Editar() {

    let users = obterUsuarios()

    const userAtualizado = {
        nome: document.querySelector("#txtNome").value,
        email: document.querySelector("#txtEmail").value
    }

    users[indice_selecionado] = userAtualizado;
    localStorage.setItem('usuarios', JSON.stringify(users));
    alert('Usuario atualizado');
    operacao = 'A';
    closeModal('cadastrados-modal');

}


function listar() {
    let tbody = document.querySelector('#tblListar tbody');
    let linhas = '';
    let users = obterUsuarios()

    for (let i in users) {
        let user = users[i];
        linhas += `<tr>
                <td class="icons">
                    <img class="img-m" src='../imagens/editar.png' alt ='${i}' onclick='handleEditar(this)'/>
                    <img class="img-m" src='../imagens/deletar.png' alt ='${i}' onclick='handleDeletar(this)'/>
                </td>
                <td>${user.nome}</td>
                <td>${user.email}</td>
              </tr>`

    }
    tbody.innerHTML = linhas;

}
document.querySelector('#modal-cadastrados').addEventListener('click', function (e) {
    listar();
})

function deletar(indice) {
    usuarios.splice(indice, 1);
    if (usuarios.length == 0) {
        localStorage.removeItem('usuarios');
        return;
    }
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

function handleDeletar(e) {
    let indice_selecionado = parseInt(e.getAttribute("alt"));
    deletar(indice_selecionado);
    listar();
}

function sorteio() {
    usuarios = obterUsuarios()
    let max = usuarios.length
    let sbody = document.querySelector('.modal-body-resultado');
    let slinhas = '';
    if (max <= 3) {
        alert("É necessário adicionar pelo menos 4 pessoas")
        return;
    }
    else if (max % 2 != 0) {
        alert("O numero de candidatos deve ser par")
        return;
    }
    let resultado = [];
    let num = 0;
    for (let i = 0; i < usuarios.length; i++) {
        num = Math.floor((Math.random() * max) + 0);
        if (resultado.includes(num)) {
            i--;
        }
        else {
            resultado.push(num);

        }
    }
    for (let i = 0; i < resultado.length; i++) {
        if (numpar(i)) {
            slinhas += `<p> ${resultSorteio[resultado[i]]} - ${resultSorteio[resultado[i + 1]]}`
        }
    }
    sbody.innerHTML += slinhas;
    openModal('resultado-modal')
    resultSorteio = [];
}

document.querySelector('#btnSortear').addEventListener('click', function (e) {
    sorteio()
})


function reset() {
    let sbody = document.querySelector('.modal-body-resultado');
    sbody.innerHTML = ``;
    localStorage.clear();
    closeModal('resultado-modal');
    closeModal('cadastrados-modal');
    resultSorteio = [];
    let tbody = document.querySelector('#tblListar tbody');
    tbody.innerHTML = ``;
    usuarios = [];
}

