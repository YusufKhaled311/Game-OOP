
let GamesId = [];

class FetchGames {
    constructor(category = '') {
        this.url = category
            ? `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${category}`
            : '';
        this.option = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '218b341c33mshf943e0cb9e35519p1ffe23jsndf2b93d3a83d',
                'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
            }
        };
    }

    async getGames() {
        try {
            const response = await fetch(this.url, this.option);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error fetching games:', error);
            return [];
        }
    }


    detailsApi(id) {
        return `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${id}`;
    }

    async getGameDetails(id) {
        try {
            const response = await fetch(this.detailsApi(id), this.option);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error fetching game details:', error);
            return null;
        }
    }
}




class UiGames {
    constructor() {
        this.Container = document.getElementById('gamesContainer');
        this.closeBtn = document.getElementById('closeBtn');

        this.closeBtn.addEventListener('click', () => {


            this.closeDetails('.details-Section')

        })
 
        this.setupNavEvents();

    }

    display(givenElement) {

        givenElement.classList.remove('d-none');
        document.body.style.overflow = 'hidden';

    }

    closeDetails(selector) {

        const element = document.querySelector(selector);
        if (element) {
            element.classList.add('d-none');
            document.body.style.overflow = 'auto'; // re-enable page scroll
        }

    }

    setupNavEvents() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                navLinks.forEach(l => l.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

    }

    displayGames(games) {
        let box = ``;
        GamesId = [];

        for (let i = 0; i < games.length; i++) {
            const game = games[i];
            box += `
        <div class="col-xl-3 col-lg-4 col-md-6 d-flex">
          <div class="game-card h-100 w-100 d-flex flex-column justify-content-between" data-id="${game.id}">
            <div class="card-body px-2 pt-3 pb-1">
              <div class="image-wrapper">
                <img src="${game.thumbnail}" class="img-fluid" alt="${game.title}">
              </div>
              <div class="d-flex justify-content-between align-items-center pt-2 text-white">
                <span class="f-14 fw-500 p-2 cursive-font">${game.title}</span>
                <span class="badge f-14 fw-700 p-2">Free</span>
              </div>
              <p class="text-center pt-2 pb-0 light-gray-color">
                ${game.short_description.split(" ").slice(0, 10).join(" ")}...
              </p>
            </div>
            <div class="card-footer small   px-2 py-2 d-flex justify-content-between align-items-center align-self-stretch">
              <span class="text-capitalize text-white bg-dark-gray badge me-1 ">${game.genre}</span>
              <span class="text-capitalize text-white bg-dark-gray badge">${game.platform}</span>
            </div>
          </div>
        </div>
      `;

            GamesId[i] = game.id;
        }

        this.Container.innerHTML = box;

        const gamesList = this.Container.getElementsByClassName('game-card');
        for (let item of gamesList) {
            item.addEventListener('click', async (e) => {
                this.loadingScreen(true)
                const gameId = item.dataset.id;

                const gameFetcher = new FetchGames();
                const details = await gameFetcher.getGameDetails(gameId);

                this.displayGameDetails(details);

                const detailsSection = document.querySelector('.details-Section');
                this.display(detailsSection);
                this.loadingScreen(false)

            });
        }
    }

    displayGameDetails(data) {
        const detailsContainer = document.getElementById('DetailsContainer');

        const box = `
          <div class="col-md-4 py-2">
            <figure>
              <img src="${data.thumbnail}" alt="${data.title}" class="w-100">
            </figure>
          </div>
          <div class="col-md-8 text-white py-2">
            <h3>Title: ${data.title}</h3>
            <h4 class="f-16 pt-2 pb-1">Category: <span class="badge">${data.genre}</span></h4>
            <h4 class="f-16 pt-2 pb-1">Platform: <span class="badge">${data.platform}</span></h4>
            <h4 class="f-16 pt-2 pb-1">Status: <span class="badge">${data.status}</span></h4>
            <p class="f-14 lead fw-500 ">${data.description}</p>
            <a href="${data.game_url}" target="_blank" class="btn btn-outline-warning text-white f-18 Nerko-font">Show Game</a>
          </div>
        `;

        detailsContainer.innerHTML = box;
    }

    loadingScreen(show = true) {
        const loading = document.getElementById('loading');
        loading.classList.toggle('d-none', !show);
    }


}


async function loadGamesByCategory(category) {
    const gamesUI = new UiGames();
    gamesUI.loadingScreen(true)
    const fetcher = new FetchGames(category);
    const games = await fetcher.getGames();
    gamesUI.displayGames(games);
    gamesUI.loadingScreen(false)

}

window.addEventListener("DOMContentLoaded", () => {
    loadGamesByCategory("mmorpg");
});


const categoryList = document.getElementsByClassName('nav-item');
for (let item of categoryList) {
    item.addEventListener('click', (e) => {
        const category = e.target.innerText.trim().toLowerCase();
        loadGamesByCategory(category);

    });
}



const gamesList = document.getElementsByClassName('game-card');


for (let item of gamesList) {
    item.addEventListener('click', (e) => {

        console.log(e.target);
    })
}





