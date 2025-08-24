[1mdiff --git a/server.js b/server.js[m
[1mindex 77890ad..d15e125 100644[m
[1m--- a/server.js[m
[1m+++ b/server.js[m
[36m@@ -11,7 +11,13 @@[m [mconst app = express();[m
 const PORT = process.env.PORT || 3000;[m
 [m
 // Middleware[m
[31m-app.use(cors());[m
[32m+[m[32m// السماح فقط لدومين Frontend[m
[32m+[m[32mapp.use([m
[32m+[m[32m  cors({[m
[32m+[m[32m    origin: "https://royalnanoceramic-new.vercel.app",[m
[32m+[m[32m  })[m
[32m+[m[32m);[m
[32m+[m
 app.use(express.json());[m
 [m
 // MongoDB Connection with Caching for Serverless[m
