'use strict';
/* eslint no-undef:0, no-unused-vars:0 */

app.get('/express', (req, res, next) => {
  const id = req.query.id;

  // error handler
  const errorHanlder = err => {
    console.error(err);
    res.json({ success: false, err });
  };

  db.connect(host, (err, client) => { // connect to db
    if (err) return errorHanlder(err); // **need to process error every callback**
    client.user.get(id, (err, user) => { // fetch user info
      if (err) return errorHanlder(err);
      client.task.list({ id: user.id }, (err, taskList) => { // list task
        if (err) return errorHanlder(err);
        res.send({ // response data
          id,
          user,
          taskList,
        });
      });
    });
  });
});

app.get('/koa', async (ctx, next) => {
  const id = req.query.id;
  try {
    const client = await db.connect(host); // connect to db
    const user = await client.user.get(id); // fetch user info
    const articleList = await client.article.list({ id: user.id }); // list user's articles
    ctx.body = { success: true, id, user, articleList }; // pack and response data
  } catch (err) {
    // handler error once and like sync coding way
    console.error(err);
    ctx.body = { success: false, err };
  }
});

function doByCallback2(id, next) {
  startJob1(id, (err, res1) => {
    startJob2(res1, (err, res2) => {
      startJob3(res2, (err, res3) => {
        startJob4(res3, (err, res4) => {
          startJob5(res4, (err, res5) => {
            return next(null, res5);
          });
        });
      });
    });
  });
}

// 一级级抛出错误
// Callback Hell, by TZ
function doByCallback(id, next) {
  startJob1(id, (err, res1) => {
    if (err) return next(err);
    startJob2(res1, (err, res2) => {
      if (err) return next(err);
      startJob3(res2, (err, res3) => {
        if (err) return next(err);
        startJob4(res3, (err, res4) => {
          if (err) return next(err);
          // process with result;
          return next(null, res4);
        });
      });
    });
  });
}

// 统一在最后处理错误
function doByPromise(id) {
  return startJob1(id)
    .then(res1 => startJob2(res1))
    .then(res2 => startJob3(res2))
    .then(res3 => startJob4(res3))
    .then(res4 => {
      // process with result;
      return res4;
    })
    .catch(err => {
      // process with error
    });
}

// 类同步的方式，直观的处理错误
async function doByAsync(id) {
  try {
    const res1 = await startJob1(id);
    const res2 = await startJob2(res1);
    const res3 = await startJob3(res2);
    const res4 = await startJob4(res3);
    return res4;
  } catch (err) {
    // process with error
  }
}
