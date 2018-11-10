'use strict';

const { assert, app } = require('egg-mock/bootstrap');

describe('=== Yadan ===', () => {
  beforeEach(() => {
    app.mockCsrf();
  });

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200);
  });

  it('should list todo', () => {
    return app.httpRequest()
      .get('/api/todo')
      .expect('Content-Type', /json/)
      .expect('X-Response-Time', /\d+ms/)
      .expect(200)
      .then(res => {
        assert(res.body[0].title.includes('Express'));
      });
  });

  it('should GET list with filter: completed=false', () => {
    return app.httpRequest()
      .get('/api/todo')
      .query({ completed: false })
      .expect('Content-Type', /json/)
      .expect('X-Response-Time', /\d+ms/)
      .expect(200)
      .then(res => {
        assert(res.body[0].title.includes('Egg'));
      });
  });

  it('should add todo', () => {
    return app.httpRequest()
      .post('/api/todo')
      .send({ title: 'Add one' })
      .expect('Content-Type', /json/)
      // .expect('X-Response-Time', /\d+ms/)
      .expect(201)
      .then(res => {
        assert(res.body.id);
        assert(res.body.title === 'Add one');
        assert(res.body.completed === false);
      });
  });

  it('should add todo fail', () => {
    return app.httpRequest()
      .post('/api/todo')
      .send({ title: undefined })
      .expect(500);
  });

  it('should update todo', async () => {
    await app.httpRequest()
      .put('/api/todo/1')
      .send({ id: '1', title: 'Modify Express' })
      .expect('X-Response-Time', /\d+ms/)
      .expect(204);

    // validate
    await app.httpRequest()
      .get('/api/todo')
      .expect(200)
      .then(res => {
        assert(res.body[0].title === 'Modify Express');
      });
  });

  it('should update todo fail', () => {
    return app.httpRequest()
      .put('/api/todo/999')
      .send({ id: '999', title: 'Modify Express' })
      .expect(500);
  });

  it('should delete todo', async () => {
    await app.httpRequest()
      .delete('/api/todo/1')
      .expect(204);

    // validate
    await app.httpRequest()
      .get('/api/todo')
      .expect('X-Response-Time', /\d+ms/)
      .expect(200)
      .then(res => {
        assert(res.body[0].title.includes('Koa'));
      });
  });

  it('should delete todo fail', () => {
    return app.httpRequest()
      .delete('/api/todo/999')
      .expect(500);
  });

  it('should 404', () => {
    return app.httpRequest().get('/no_exist').expect(404);
  });

  it('should serve static', () => {
    return app.httpRequest().get('/public/main.js').expect(200);
  });
});
