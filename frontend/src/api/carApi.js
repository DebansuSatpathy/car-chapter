const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  (import.meta.env.DEV ? 'http://localhost:5000/api' : '');

/**
 * Fetch approved cars from the backend.
 *
 * @returns {Promise<any>} The parsed JSON response from the API.
 * @throws If the request fails or the response is not OK.
 */
export async function fetchCars() {
  if (!API_BASE_URL) {
    console.warn('VITE_API_BASE_URL is not set; listings are empty on this host.');
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/cars`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch cars:', error);
    throw error;
  }
}
