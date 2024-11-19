import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import 'dotenv/config';

import historyRouter from './routes/history';

import bodyParser from 'body-parser';

import { createHistoryTable } from './db/querys';

const apiProxy = createProxyMiddleware({
  target: String(process.env.PROXY_URL),
  changeOrigin: true,
  pathRewrite: {
    '^/api': '',
  },
});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.use('/api', historyRouter);
app.use('/api', apiProxy);

createHistoryTable();

export default app;
