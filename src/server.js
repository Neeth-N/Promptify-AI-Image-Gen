const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate-image', async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await axios.post('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0', {
      inputs: prompt,
      options: { wait_for_model: true }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      responseType: 'arraybuffer'  // Important: HF returns binary image data
    });

    // Convert binary data to base64
    const base64Image = Buffer.from(response.data).toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64Image}`;

    // Send response in the format the frontend expects
    res.json({
      data: [{
        url: dataUrl
      }]
    });

  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Failed to generate image', 
        details: error.message 
      });
    }
    console.error('Error:', error.message);
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));