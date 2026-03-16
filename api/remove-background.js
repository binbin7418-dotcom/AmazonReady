// Vercel Serverless Function - remove.bg API

export const config = {
  maxDuration: 30,
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: 'No image provided' });

    const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;
    if (!REMOVE_BG_API_KEY) {
      return res.status(500).json({ error: 'REMOVE_BG_API_KEY not configured' });
    }

    // 把 base64 转成二进制
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // 构建 multipart form data
    const boundary = '----FormBoundary' + Math.random().toString(36).substr(2);
    const formParts = [
      `--${boundary}\r\nContent-Disposition: form-data; name="image_file"; filename="image.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`,
      imageBuffer,
      `\r\n--${boundary}\r\nContent-Disposition: form-data; name="size"\r\n\r\nauto\r\n--${boundary}--\r\n`
    ];

    const bodyParts = formParts.map(p => typeof p === 'string' ? Buffer.from(p) : p);
    const body = Buffer.concat(bodyParts);

    console.log('Calling remove.bg API, image size:', imageBuffer.length, 'bytes');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body,
    });

    console.log('remove.bg response status:', response.status);

    if (!response.ok) {
      const errText = await response.text();
      console.error('remove.bg error:', errText);
      return res.status(500).json({ error: 'remove.bg API failed', details: errText, status: response.status });
    }

    // 返回透明 PNG 的 base64
    const arrayBuffer = await response.arrayBuffer();
    const pngBase64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:image/png;base64,${pngBase64}`;

    console.log('Success! PNG size:', arrayBuffer.byteLength, 'bytes');

    return res.status(200).json({
      success: true,
      imageUrl: dataUrl  // 直接返回 base64，不需要再下载
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
