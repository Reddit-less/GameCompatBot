import { Client, GatewayIntentBits } from 'discord.js';
import { getGameInfo } from './gameInfo.js';
import { searchGameAndGetAppId, fetchReviews } from './steamReviews.js';
import { canRunGame } from './compare.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const BOT_TOKEN = ''; 
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
  if (!message.content.startsWith('!') || message.author.bot) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'canrun') {
    const gpuRegex = /\b(GeForce\sRTX\s\d+|Radeon\sRX\s\d+|GeForce\sGTX\s\d+)\b/i;
    const gpuMatch = message.content.match(gpuRegex);

    if (!gpuMatch) {
      message.channel.send('Please provide a valid GPU model as part of your command.');
      return;
    }

    const gpuModel = gpuMatch[0];
    const gameName = args.join(' ').replace(gpuModel, '').trim();

    if (!gameName) {
      message.channel.send('Please provide the name of the game you want to check.');
      return;
    }

    try {
      const result = await canRunGame(gameName, gpuModel);
      message.channel.send(result ? `Yes, you can run "${gameName}" with your "${gpuModel}".` : `No, you cannot run "${gameName}" with your "${gpuModel}".`);
    } catch (error) {
      console.error(error);
      message.channel.send('There was an error processing your request.');
    }
    return;
  }

  if (command === 'gameinfo') {
    if (args.length === 0) {
      message.channel.send("Please specify a game name to fetch information.");
      return;
    }

    const infoType = args[args.length - 1].toLowerCase();
    const validInfoTypes = ['description', 'minimum', 'recommended', 'reviews'];
    
    if (!validInfoTypes.includes(infoType)) {
      message.channel.send(`Please provide a valid info type: ${validInfoTypes.join(', ')}.`);
      return;
    }
    
    args.pop(); 
    const gameName = args.join(' '); 
    
    if (infoType === 'reviews') {
      const appId = await searchGameAndGetAppId(gameName);
      if (appId) {
        const reviews = await fetchReviews(appId);
        message.channel.send(reviews);
      } else {
        message.channel.send('Game not found.');
      }
    } else {
      const gameInfo = await getGameInfo(gameName, infoType);
      message.channel.send(gameInfo || 'No information found.');
    }
  }
});

client.login('');
