const cors = require('@koa/cors');
const Koa = require('koa');
const koaBody = require('koa-body');
const http = require('http');

const app = new Koa();

app.use(cors());

app.use(koaBody({
  urlencoded: true,
  text: true,
  json: true,
  multipart: true,
}));

const tickets = new Map();

app.use(async (ctx) => {
  if (ctx.request.method === 'GET') {
    let { id } = ctx.request.query;
    const { method } = ctx.request.query;
    id = +id;
    switch (method) {
      case 'allTickets': {
        const jsonArr = Array.from(tickets.values());
        const resp = jsonArr.map((el) => ({
          id: el.id,
          name: el.name,
          status: el.status,
          created: el.created,
        }));
          // console.log(jsonObject);
        ctx.response.body = resp;
        return;
      }
      case 'ticketById': {
        // console.log(Array.from(tickets.values()))
        const answer = JSON.stringify(tickets.get(id));
        // console.log(answer);
        ctx.response.body = answer;
        return;
      }
      case 'status': {
        const { status } = ctx.request.query;
        // console.log(status);
        tickets.get(id).status = status;
        ctx.body = { ok: true };
        return;
      }
      case 'delete': {
        tickets.delete(+id);
        ctx.body = { ok: true };
        return;
      }
      default: {
        ctx.response.status = 404;
        return;
      }
    }
  } else if (ctx.request.method === 'POST') {
    // console.log(ctx.request.body);
    const { taskName, taskDescr, created } = ctx.request.body;
    const ticketId = tickets.size + 1;
    tickets.set(ticketId, {
      id: ticketId,
      name: taskName,
      status: false,
      created,
      description: taskDescr,
    });
    // console.log(Array.from(tickets.values()));
    ctx.body = { ok: true };
    ctx.response.status = 200;
    return;
  } else if (ctx.request.method === 'PUT') {
    const { id, taskName, taskDescr } = ctx.request.body;
    const ticket = tickets.get(+id);
    ticket.name = taskName;
    ticket.description = taskDescr;
    // console.log(tickets.get(id));
    ctx.body = { ok: true };
    ctx.response.status = 200;
    return;
  };
  ctx.body = { status: 'OK' };
  ctx.response.status = 200;
});

const port = process.env.PORT || 7070;

app.listen(port, () => console.log('Server is works'));
