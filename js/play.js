const GAME_STAGE_WIDTH = 1920;
const GAME_STAGE_HEIGHT = 1920;

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
    game.camera.roundPx = false;
}

function updatePlay() {
    eventSystem.CallEvent("update", []);
}


