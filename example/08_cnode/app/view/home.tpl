<div>
  <h2>{{ ctx.path }}</h2>
  <hr>
  Logined user: <img src="{{ ctx.user.photo }}"> {{ ctx.user.displayName }} / {{ ctx.user.id }} | <a href="/logout">Logout</a>
  <pre><code>{{ ctx.user | dump }}</code></pre>
  <hr>
  <a href="/">Home</a> | <a href="/user">User</a>
</div>