const allGameInfo = require('./All_game_information.json');  // Ensure this path is correct
const gpuPerformance = require('./gpu_performance.json');  // Ensure this path is correct

function canRunGame(gameName, gpuModel) {
    const game = allGameInfo.find(g => g.name === gameName);
    if (!game) {
        console.log(`Game "${gameName}" not found.`);
        return false;
    }

    const requiredGpu = game.system_requirements.gpu;  // This needs to be adjusted based on your actual game data structure

    // Check if the GPU model directly matches or if it meets a general performance requirement
    if (!gpuPerformance[gpuModel] || !gpuPerformance[requiredGpu]) {
        console.log(`No performance data found for provided GPU model (${gpuModel}) or required GPU (${requiredGpu}).`);
        return false;
    }

    const userGpuPerformance = parseFloat(gpuPerformance[gpuModel].replace('%', ''));
    const requiredGpuPerformance = parseFloat(gpuPerformance[requiredGpu].replace('%', ''));

    console.log(`Checking compatibility for ${gameName} with ${gpuModel}:`);
    console.log(`User GPU Performance: ${userGpuPerformance}%`);
    console.log(`Required GPU Performance: ${requiredGpuPerformance}%`);

    if (userGpuPerformance >= requiredGpuPerformance) {
        console.log(`The GPU (${gpuModel}) is sufficient to run ${gameName}.`);
        return true;
    } else {
        console.log(`The GPU (${gpuModel}) does not meet the requirements to run ${gameName}.`);
        return false;
    }
}

