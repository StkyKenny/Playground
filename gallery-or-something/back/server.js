const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const cors = require('cors');
const { ENV_VARIABLES } = require('./env');

const corsOption = {
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:4200']
}


app.use(cors({origin: true}));


app.get('/', (req, res) => {
  res.send('Hello World!');
});


const IMAGE_FOLDER = ENV_VARIABLES.LOCAL_FOLDER_PATH;
app.use('/images', express.static(IMAGE_FOLDER));



app.get('/api/images', (req, res) => {

  fs.readdir(IMAGE_FOLDER, (err, files) => {

    if (err) {
      return res.status(500).json({
        error: 'Cannot read folder'
      });
    }

    const imageFiles = files.filter(file =>
      file.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    );

    const imageUrls = imageFiles.map(file => ({
      name: file,
      url: `http://localhost:3000/images/${encodeURIComponent(file)}`
    }));

    res.json(imageUrls.sort(() => Math.random() - 0.5));

  });

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});