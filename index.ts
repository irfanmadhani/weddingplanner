import express, { Express } from "express";
import { listGuests, addGuest, getGuest, countMollyGuests, countJamesGuests, countJamesFamilyGuests, countMollyFamilyGuests } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.get("/api/list", listGuests);
app.post("/api/add", addGuest);
app.get("/api/countM", countMollyGuests);
app.get("/api/countJ", countJamesGuests);
app.get("/api/countJFam", countJamesFamilyGuests);
app.get('/api/countMFam', countMollyFamilyGuests);
app.get("/api/get", getGuest);

app.listen(port, () => console.log(`Server listening on ${port}`));

