import { loadFromStorage, saveToStorage, genId } from './helpers/storage.js';
import { renderControlsGridPlayers } from './helpers/controls.js';

let players = await loadFromStorage();

const form = document.getElementById('player-form');
const idField = document.getElementById('player-id');
const nomeField = document.getElementById('nome');
const posField = document.getElementById('posicao');
const clubeField = document.getElementById('clube');
const golsField = document.getElementById('gols');
const assistField = document.getElementById('assistencias');
const jogosField = document.getElementById('jogos');
const favField = document.getElementById('favorita');
const fotoField = document.getElementById('foto');
const formTitle = document.getElementById('form-title');
const clearBtn = document.getElementById('clear-btn');

export function createCard(player) {
    const card = document.createElement('div');
    card.className = 'player-card';
    const photo = document.createElement('div');
    photo.className = 'player-photo';
    photo.style.backgroundImage = `url("${player.foto || placeholderPhoto()}")`;

    const body = document.createElement('div');
    body.className = 'player-body';

    const name = document.createElement('div');
    name.className = 'player-name';
    name.textContent = player.nome;

    const description = document.createElement('div');
    description.className = 'player-sub';
    description.textContent = `${player.posicao || '—'} • ${player.clube || '—'}`;

    const stats = document.createElement('div');
    stats.className = 'stats';
    stats.innerHTML = `<span>⚽ ${player.gols ?? 0} gols</span><span>🅰️ ${player.assistencias ?? 0} assist.</span><span>🕒 ${player.jogos ?? 0} jogos</span>`;

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const favBtn = document.createElement('button');
    favBtn.className = 'icon-btn';
    favBtn.title = player.favorita ? 'Remover dos favoritos' : 'Marcar como favorita';
    favBtn.innerHTML = player.favorita ? '★ Favorita' : '☆ Favorita';
    if(player.favorita) favBtn.classList.add('fav');

    favBtn.addEventListener('click', ()=> toggleFavorite(player.id));

    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn';
    editBtn.textContent = '✎ Editar';
    editBtn.addEventListener('click', ()=> loadToForm(player.id));

    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn';
    delBtn.textContent = '🗑 Remover';
    delBtn.addEventListener('click', ()=> removePlayer(player.id));

    actions.append(favBtn, editBtn, delBtn);
    body.append(name, description, stats, actions);
    card.append(photo, body);

    return card;
}

function placeholderPhoto() {
    return "https://images.vexels.com/media/users/3/234548/isolated/preview/e7252460935961e2d62dd3006d00c653-jogador-de-futebol-feminino-plano.png";
}

function toggleFavorite(id) {
    const indexPlayer = players.findIndex(p=>p.id==id);
    if(indexPlayer===-1) return;
    players[indexPlayer].favorita = !players[indexPlayer].favorita;
    saveToStorage(players);
    renderControlsGridPlayers();
}

export function loadToForm(id) {
    const playerToEdit = players.find(player=>player.id==id);
    if(!playerToEdit) return;
    idField.value = playerToEdit.id;
    nomeField.value = playerToEdit.nome;
    posField.value = playerToEdit.posicao;
    clubeField.value = playerToEdit.clube;
    golsField.value = playerToEdit.gols ?? 0;
    assistField.value = playerToEdit.assistencias ?? 0;
    jogosField.value = playerToEdit.jogos ?? 0;
    favField.value = playerToEdit.favorita ? 'true' : 'false';
    fotoField.value = playerToEdit.foto || '';
    formTitle.textContent = 'Editar Jogadora';
    window.scrollTo({top:0, behavior:'smooth'});
}

function clearForm() {
    idField.value = '';
    nomeField.value = '';
    posField.value = '';
    clubeField.value = '';
    golsField.value = 0;
    assistField.value = 0;
    jogosField.value = 0;
    favField.value = 'false';
    fotoField.value = '';
    formTitle.textContent = 'Adicionar Jogadora';
}

clearBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    clearForm();
});

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if (!nomeField.value.trim() || !posField.value.trim() || !clubeField.value.trim()) {
        alert('Preencha pelo menos nome, posição e clube.');
        return;
    }
    const id = idField.value ? Number(idField.value) : null;
    const payload = buildPayload(id);
    if(id){
        editPlayer(id, payload);
    } else {
        insertPlayer(payload);
    }
    clearForm();
    renderControlsGridPlayers();
});

function buildPayload(id) {
    const payload = {
        id: id || genId(),
        nome: nomeField.value.trim(),
        posicao: posField.value.trim(),
        clube: clubeField.value.trim(),
        gols: Number(golsField.value) || 0,
        assistencias: Number(assistField.value) || 0,
        jogos: Number(jogosField.value) || 0,
        favorita: (favField.value === 'true'),
        foto: fotoField.value.trim()
    };

    return payload;
}

function editPlayer(id, payload) {
    const indexPlayer = players.findIndex(player => player.id == id);
    if(indexPlayer === -1){
        alert('Erro: jogadora não encontrada.');
        return;
    }
    players[indexPlayer] = payload;
    saveToStorage(players);
    alert('Jogadora editada com sucesso!');
}

function insertPlayer(payload) {
    players.push(payload);
    saveToStorage(players);
}

function removePlayer(id){
    if(!confirm('Deseja realmente remover essa jogadora?')) return;
    players = players.filter(p => p.id != id);
    saveToStorage(players);
    alert('Jogadora removida com sucesso!');
    renderControlsGridPlayers();
}
