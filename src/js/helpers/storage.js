const STORAGE_KEY = "playersData";

const seedData = async () => {
    let players = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!players) {
        try {
            const response = await fetch("src/data/players.json"); 
            const data = await response.json();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            players = data;
        } catch (error) {
            console.error("Erro ao carregar JSON externo:", error);
            players = [];
        }
    }
    return players;
}

export function genId() {
    const players = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const maxId = players.length ? Math.max(...players.map(player => player.id || 0)) : 0;
    return maxId + 1;
}

export async function loadFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        const players = await seedData(); 
        localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
        return players;
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        console.error('storage parse err', e);
        return [];
    }
}

export function saveToStorage(players) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players, null, 2));
}