import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Catchy Fabric Market backend server running on port ${PORT}`);
});