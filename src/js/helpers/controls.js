import { loadFromStorage } from './storage.js';
import { createCard } from '../app.js';

const filterClube = document.getElementById('filter-clube');
const searchInput = document.getElementById('search');
const playersGrid = document.getElementById('players-grid');
const emptyState = document.getElementById('empty-state');
const sortNameBtn = document.getElementById('sort-name'); 
const sortPosBtn = document.getElementById('sort-pos');

let players = await loadFromStorage();
let currentSort = null;

export async function renderControlsGridPlayers() {
    players = await loadFromStorage();
    insertClubOptions();
    let playersFiltered = applyFilters();
    applySort(playersFiltered);
    displayGridPlayers(playersFiltered);
}

function applyFilters() {
    const querySearch = (searchInput.value || '').trim().toLowerCase();
    const clubFilter = filterClube.value;

    return players.filter(player => {
        const matchesQuery = querySearch === '' 
            || player.nome.toLowerCase().includes(querySearch) 
            || (player.posicao || '').toLowerCase().includes(querySearch);
        const matchesClub = !clubFilter || player.clube === clubFilter;
        return matchesQuery && matchesClub;
    });
}

function applySort(playersFiltered) {
    if (currentSort === 'nome'){
        playersFiltered.sort((a,b) => a.nome.localeCompare(b.nome));
    } else if (currentSort === 'posicao'){
        playersFiltered.sort((a,b) => (a.posicao || '').localeCompare(b.posicao || ''));
    }
}

function displayGridPlayers(players) {
    playersGrid.innerHTML = '';
    if (players.length === 0){
        emptyState.style.display = 'block';
        return;
    } 
    emptyState.style.display = 'none';
    players.forEach(player => playersGrid.appendChild(createCard(player)));
}

function insertClubOptions() {
    const clubs = Array.from(new Set(players.map(player => player.clube))).sort();
    const prevValue = filterClube.value;
    filterClube.innerHTML = '<option value="">Filtrar por time</option>';
    for (const club of clubs){
        const optionHTML = document.createElement('option');
        optionHTML.value = club;
        optionHTML.textContent = club;
        filterClube.appendChild(optionHTML);
    }
    if (clubs.includes(prevValue)) filterClube.value = prevValue;
}

searchInput.addEventListener('input', renderControlsGridPlayers);
filterClube.addEventListener('change', renderControlsGridPlayers);
sortNameBtn.addEventListener('click', ()=> { currentSort = currentSort === 'nome' ? null : 'nome'; renderControlsGridPlayers(); });
sortPosBtn.addEventListener('click', ()=> { currentSort = currentSort === 'posicao' ? null : 'posicao'; renderControlsGridPlayers(); });