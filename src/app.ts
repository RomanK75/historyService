import express, { Request, Response } from 'express';


const app = express();
app.use(express.json());


app.listen(3002, () => {
  console.log('Server started on port 3000');
});

export default app;