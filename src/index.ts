import {AppDataSource, connectDB} from "./config/data-source";
import * as express from "express";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import "reflect-metadata";
import { errorHandler } from "./middleware/errorHandler";
import { authRouter } from "./routes/auth.routes";

// Importer les routes
import organisationRouter from './routes/organisation.routes';
import universiteRouter from './routes/universite.routes';
import departementRouter from './routes/departement.routes';
import programmeRouter from './routes/programme.routes';
import academicYearRouter from './routes/academicYear.routes';
import subjectRouter from './routes/subject.routes';
import classSessionRouter from './routes/classSession.routes';
import userRouter from './routes/user.routes';
import emargementRouter from './routes/emargement.routes';
import notificationRouter from './routes/notification.routes';
import {RoleEnum} from "./entity/User.entity";
import {createUser} from "./controllers/user.controllers";

dotenv.config();
const app = express();
const globalPath = '/api/v1';

// Middlewares
//app.use(cors());
app.use(express.json());

// Routes avec préfixe '/api'
app.use(`${globalPath}/auth`, authRouter);
app.use(`${globalPath}/users`, userRouter);
app.use(`${globalPath}/organisations`, organisationRouter);
app.use(`${globalPath}/universites`, universiteRouter);
app.use(`${globalPath}/departements`, departementRouter);
app.use(`${globalPath}/programmes`, programmeRouter);
app.use(`${globalPath}/academicYears`, academicYearRouter);
app.use(`${globalPath}/subjects`, subjectRouter);
app.use(`${globalPath}/classSessions`, classSessionRouter);
app.use(`${globalPath}/emargements`, emargementRouter);
app.use(`${globalPath}/notifications`, notificationRouter);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
}).catch((error) => {
    console.error("Database connection error:", error);
});

app.use(errorHandler);

app.get("*", (req: Request, res: Response) => {
  res.status(505).json({ message: "Bad Request" });
});

