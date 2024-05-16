import allGameInfo from 'file:///B:/Json%20info/All_game_information.json' assert { type: 'json' };
import gpuList from 'file:///B:/real%20data/gpu_performance.json' assert { type: 'json' }
// Helper function to parse GPU performance data into a dictionary
function parseGPUPerformance(gpuList) {
    const gpuPerformance = {};
    gpuList.forEach(gpu => {
        const match = gpu.match(/(.+)\s\((\d+)%\)/);
        if (match) {
            gpuPerformance[match[1]] = parseInt(match[2]);
        }
    });
    return gpuPerformance;
}

// Extract GPU models from requirement strings
function extractGPUs(requirement) {
    const gpuRegex = /GeForce\s(RTX\s\d+|GTX\s\d+)|Radeon\s(RX\s\d+)|Arc\s(A\d+)/g;
    const matches = requirement.match(gpuRegex) || [];
    return matches;
}

export function canRunGame(gameName, gpuModel) {
    const game = allGameInfo.find(game => game.name === gameName);
    if (!game) {
        console.log(`Game "${gameName}" not found.`);
        return false;
    }

    const gpuPerformance = parseGPUPerformance(gpuList);
    const requirements = game.system_requirements.Win;
    const minimumGPUs = extractGPUs(requirements.Minimum);
    const recommendedGPUs = extractGPUs(requirements.Recommended);

    // Determine the required performance from the 'Recommended' list or fall back to 'Minimum' if empty
    const targetGPUs = recommendedGPUs.length > 0 ? recommendedGPUs : minimumGPUs;
    const requiredGpuPerformance = Math.max(...targetGPUs.map(gpu => gpuPerformance[gpu] || 0));

    if (!gpuPerformance[gpuModel]) {
        console.log(`Your GPU (${gpuModel}) is not recognized or listed in the GPU performance data.`);
        return false;
    }

    const userGpuPerformance = gpuPerformance[gpuModel];

    console.log("GPUs found in requirements: ", targetGPUs);
    console.log("User GPU Performance: ", userGpuPerformance, "Required GPU Performance: ", requiredGpuPerformance);

    if (userGpuPerformance >= requiredGpuPerformance) {
        console.log(`Yes, you can run "${gameName}" with your GPU (${gpuModel}).`);
        return true;
    } else {
        console.log(`Your GPU (${gpuModel}) performance is below the required performance for "${gameName}".`);
        return false;
    }
}
