/* eslint-disable no-unused-vars */
import express from 'express';
import cors from 'cors';

const app = express();
// eslint-disable-next-line no-undef
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json())



app.use('/', express.static('dist'))

let globalDoctor = ""
let globalIAm = ""


app.post('/send-iam-data', async (req, res) => {
  try {
    const { iAm, doctor } = req.body; // Extract iAm and doctor from the request body
    globalIAm = iAm; // Store iAm globally
    globalDoctor = doctor; // Store doctor globally

    console.log('Received data from frontend:', globalIAm, globalDoctor);

    res.json({ message: 'Data received successfully!' });
  } catch (error) {
    console.error('Error processing send-iam-data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});