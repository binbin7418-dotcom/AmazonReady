// Vercel Serverless Function for background removal
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const REPLICATE_API_TOKEN = process.env.VITE_REPLICATE_API_TOKEN;

    if (!REPLICATE_API_TOKEN) {
      return res.status(500).json({ error: 'API token not configured' });
    }

    // Call Replicate API
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: '95fcc2a26d3899cd6c2691c900465aaeff466285d65c14638cc5f36f34befaf1',
        input: {
          image: imageBase64
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Replicate API error:', error);
      return res.status(500).json({ error: 'Failed to start processing' });
    }

    const prediction = await response.json();

    // Poll for result (max 30 seconds)
    let result = prediction;
    let attempts = 0;
    const maxAttempts = 30;

    while ((result.status === 'starting' || result.status === 'processing') && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;

      const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        }
      });

      result = await pollResponse.json();
    }

    if (result.status !== 'succeeded' || !result.output) {
      return res.status(500).json({ 
        error: 'Processing failed', 
        status: result.status,
        details: result.error 
      });
    }

    // Return the processed image URL
    return res.status(200).json({
      success: true,
      imageUrl: result.output
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
