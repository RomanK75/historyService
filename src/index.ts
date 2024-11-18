import app from './app';
import 'dotenv/config';

app.listen(Number(process.env.PORT), () => {
  console.log(`Server started on port ${process.env.PORT}`);
});