module.exports = {
  _4wd: async function (ctx, next) {
    await ctx.render('index', {title: 'x2' + new Date()})
  }
}
