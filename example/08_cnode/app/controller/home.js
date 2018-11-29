'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const ctx = this.ctx;

    if (ctx.isAuthenticated()) {
      await ctx.render('home.tpl');
    } else {
      ctx.session.returnTo = ctx.path;
      await ctx.render('login.tpl');
    }
  }

  async logout() {
    const ctx = this.ctx;

    ctx.logout();
    ctx.redirect(ctx.get('referer') || '/');
  }
}

module.exports = HomeController;
