import fs from 'fs';
import path from 'path';

// Adjust the path as per your system's directory structure
const jsonFilePath = path.join('B:', 'Json info', 'All_game_information.json');

export function getGameInfo(gameName, infoType = 'all') {
  try {
    const data = fs.readFileSync(jsonFilePath);
    const games = JSON.parse(data);
    const game = games.find(g => g.name.toLowerCase() === gameName.toLowerCase());

    if (!game) return 'Game not found.';

    const { description, system_requirements: { Win } } = game;

    switch (infoType) {
      case 'description':
        return description;
      case 'minimum':
        return `Minimum Specs:\n${Win.Minimum}`;
      case 'recommended':
        return `Recommended Specs:\n${Win.Recommended}`;
      default:
        return `Description: ${description}\n\nMinimum Specs:\n${Win.Minimum}\n\nRecommended Specs:\n${Win.Recommended}`;
    }
  } catch (err) {
    console.error('Error reading game data:', err);
    return 'Failed to retrieve game information.';
  }
}
