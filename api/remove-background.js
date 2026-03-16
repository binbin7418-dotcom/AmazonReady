// Vercel Serverless Function for background removal
// maxDuration: 60 seconds

export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
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

    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN || process.env.VITE_REPLICATE_API_TOKEN;

    if (!REPLICATE_API_TOKEN) {
      return res.status(500).json({ error: 'API token not configured' });
    }

    // 创建预测任务
    const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: '95fcc2a26d3899cd6c2691c900465aaeff466285d65c14638cc5f36f34befaf1',
        input: { image: imageBase64 }
      })
    });

    if (!createResponse.ok) {
      const errText = await createResponse.text();
      console.error('Replicate create error:', errText);
      return res.status(500).json({ error: 'Failed to start processing', details: errText });
    }

    const prediction = await createResponse.json();
    console.log('Prediction created:', prediction.id, 'status:', prediction.status);

    // 轮询结果，最多等 55 秒
    let result = prediction;
    const deadline = Date.now() + 55000;

    while ((result.status === 'starting' || result.status === 'processing') && Date.now() < deadline) {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: { 'Authorization': `Token ${REPLICATE_API_TOKEN}` }
      });

      result = await pollResponse.json();
      console.log('Poll status:', result.status);
    }

    if (result.status !== 'succeeded' || !result.output) {
      console.error('Processing failed:', result.status, result.error);
      return res.status(500).json({
        error: 'Processing failed',
        status: result.status,
        details: result.error
      });
    }

    console.log('Success! Output URL:', result.output);
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
