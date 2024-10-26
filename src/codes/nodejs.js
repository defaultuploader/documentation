const axios = require('axios');
const express = require('express');
const multer = require('multer');
const FormData = require('form-data');

const app = express();
const port = 3000;

const url = 'https://api.defaultuploader.com/v1/upload';
const token = 'YOUR_SECRET_CLIENT_TOKEN'; // Заменить на ваш токен!

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/upload', upload.any('file'), async (req, res) => {
  try {
    const form = new FormData();
      for (const file of req.files) {
        form.append('file', file.buffer, {
        filename: file.originalname,
      });
    }

    const response = await axios.post(url, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `${token}`,
      },
    });

    console.log('File uploaded successfully!');
    console.log('Response:', response.data);

    res.status(200).json({ data: response.data });
  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(500).json({ error: 'File upload failed' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
