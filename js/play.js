let playState = {
    preload: preloadPlay,
    create: createPlay,
    update: updatePlay
};
const eventSystem = new EventSystem();
const player = new Player(eventSystem);
function preloadPlay() {
    eventSystem.CallEvent("preload", []);
}

function createPlay() {

    game.world.setBounds(0, 0, GAME_STAGE_WIDTH, GAME_STAGE_HEIGHT);
    eventSystem.CallEvent("create", []);
}

function updatePlay() {
    eventSystem.CallEvent("update", []);
}


