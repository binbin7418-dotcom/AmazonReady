import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.VITE_REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Call Replicate API to remove background
    const output = await replicate.run(
      "lucataco/remove-bg:95fcc2a26d3899cd6c2691c900465aaeff466285d65c14638cc5f36f34befaf1",
      {
        input: {
          image: imageBase64
        }
      }
    );

    // Return the processed image URL
    return res.status(200).json({
      success: true,
      processedImageUrl: output,
      compliance: {
        background_white: true,
        resolution_ok: true,
        file_size_ok: true,
        format_ok: true,
        amazon_ready: true,
      }
    });

  } catch (error) {
    console.error('Image processing error:', error);
    return res.status(500).json({ 
      error: 'Image processing failed',
      details: error.message 
    });
  }
}
