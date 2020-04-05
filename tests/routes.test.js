const request = require('supertest');
const app = require('../app');
const { expect, assert } = require('chai');
const fs = require('fs');
const videoFileForTesting = 'fliteboard%20hero.mp4';

describe('Get Root', () => {
  it('should create a new get', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).to.be.equal(200);
  })
})

describe('Get All Video', () => {
  it('should create a new get', async () => {
    const res = await request(app).get('/allVideo');
    expect(res.statusCode).to.be.equal(200);
    //expect(res.body).to.have.lengthOf(1);
    expect(res.body).to.be.an('array');
    assert.isString(res.body[0]);
  })
})

describe('Get a Video', () => {
  it('should create a new get', async () => {
    const res = await request(app).get('/video/' + videoFileForTesting);
    expect(res.statusCode).to.be.equal(200);
    assert.ok(Buffer.isBuffer(res.body));
  })
})

describe('Get a Video', () => {
  it('should create a new get', async () => {
    const res = await request(app).get('/video/' + videoFileForTesting);
    expect(res.statusCode).to.be.equal(200);
    assert.ok(Buffer.isBuffer(res.body));
  })
})

describe('Upload a Video', () => {
  it('should create a new post', async () => {
    const res = await request(app).post('/upload')
      .attach('file', __dirname + '/test_video_upload.mp4')
      .expect(200)
      .then((err, res)=> {
        try {
          const fileExist = fs.existsSync('./public/videos/test_video_upload.mp4');
          assert.isTrue(fileExist);
        } catch(err) {
          console.error(err);
        }
      });
  })
})