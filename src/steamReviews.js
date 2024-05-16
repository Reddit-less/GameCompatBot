import fetch from 'node-fetch';

// Function to search for a game on Steam and get its App ID
export async function searchGameAndGetAppId(gameName) {
  const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(gameName)}&l=english&cc=US`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.total > 0) {
      return data.items[0].id; // Assuming the first result is the correct game
    }
    return null; // No game found
  } catch (error) {
    console.error('Error searching for game:', error);
    return null;
  }
}

// Function to fetch game reviews from Steam using the App ID
export async function fetchReviews(appId) {
  const url = `http://store.steampowered.com/appreviews/${appId}?json=1&filter=summary&language=all`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.query_summary) {
      let reviewSummary = data.query_summary;
      return `Overall Reviews: ${reviewSummary.review_score_desc} (${reviewSummary.total_positive} positive of ${reviewSummary.total_reviews} reviews)`;
    }
    return 'Reviews not found.';
  } catch (error) {
    console.error('Failed to fetch Steam reviews:', error);
    return 'Failed to retrieve reviews.';
  }
}
