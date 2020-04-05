var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');

const videoFolder = 'public/videos';

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, videoFolder);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname );
  }
});

var upload = multer({ storage: storage }).single('file');

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Let Rock & Roll!', domain: 'Localhost', beware: 'Deepfakes' });
});

router.get('/allVideo', (req, res) => {
  const files = fs.readdirSync(videoFolder);
  return res.status(200).send(files);
});

router.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
});

router.get('/video/:filename', (req, res) => {
  try {
    const path = videoFolder + '/' + req.params.filename;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize - 1;
      const chunksize = (end-start) + 1;
      const file = fs.createReadStream(path, {start, end});
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head);
      fs.createReadStream(path).pipe(res);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
