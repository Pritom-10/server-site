// const express = require("express");
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const app = express();
// const dotenv = require("dotenv");
// dotenv.config();
// const cors = require("cors");
// const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
// const port = process.env.PORT || 8000;
// app.use(cors());
// app.use(express.json());

// const uri =
//   "mongodb+srv://studyhook:hNHIlOPhxR3EWX6L@cluster0.ftqmtiq.mongodb.net/?appName=Cluster0";

// const JWKS=createRemoteJWKSet(new URL('http://localhost:3000/api/auth/jwks'));

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// const logger = (req, res, next) => {
//   next();
// };

// const  verifyToken = async (req, res, next) => {
//   const { authorization } = req.headers;
//   const token = authorization.split(" ")[1];
//   if (!token) {
//     return res.status(401).send({ message: "Unauthorized" });
//   }
//   try {
//     const JWKS = createRemoteJWKSet(
//       new URL('http://localhost:3000/api/auth/jwks')
//     )
//     const { payload } = await jwtVerify(token, JWKS);
//     req.user = payload;
//     next();
//   } catch (error) {
//     console.error('Token validation failed:', error)
//     return res.status(401).send({ message: "Unauthorized" });
//   }

// };
// // const JWKS = createRemoteJWKSet(new URL("http://localhost:3000/api/auth/jwks"));

// // const verifyToken = async (req, res, next) => {
// //   const authorization = req.headers.authorization;

// //   if (!authorization) {
// //     return res.status(401).send({
// //       message: "Unauthorized",
// //     });
// //   }

// //   const token = authorization.split(" ")[1];

// //   if (!token) {
// //     return res.status(401).send({
// //       message: "Unauthorized",
// //     });
// //   }

// //   try {

// //     const { payload } = await jwtVerify(token, JWKS);

// //     req.user = payload;

// //     next();
// //   } catch (error) {
// //     console.error("Token validation failed:", error);

// //     return res.status(401).send({
// //       message: "Unauthorized",
// //     });
// //   }
// // };
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     const db = client.db("studyhookdb");
//     const roomCollection = db.collection("room");
//     const add_roomCollection = db.collection("add-room");

//     app.get("/all_rooms", async (req, res) => {

//       const {search} = req.query;
//       let cursor;
//       if (search) {
//         cursor = await roomCollection.find({
//           $or: [
//             {
//             name:{$regex:search,$options:"i"},
//           },
//             {
//             floor:{$regex:search,$options:"i"},
//           },
//         ]});
//       }
//       else {
//         cursor=roomCollection.find();
//       }

//        const result = await cursor.toArray();
//        res.send(result);
//      });

//      app.get("/featured", async (req, res) => {
//        const cursor = roomCollection.find().limit(6);
//        const result = await cursor.toArray();
//        res.send(result);
//      });

//     app.get("/all_rooms/:roomId", logger,verifyToken, async (req, res) => {
//       const { roomId } = req.params;
//       const query = { _id: new ObjectId(roomId) };
//       const result = await roomCollection.findOne(query);
//       res.send(result);
//     });
//     app.get("/listing/:userId", verifyToken, async (req, res) => {
//       const { userId } = req.params;

//       const result = await roomCollection.find({ userId: userId }).toArray();

//       res.send(result);
//     });
//     app.get('/add-room/:userId',verifyToken, async (req, res) => {
//       const { userId } = req.params;
//       const result=await add_roomCollection.find({userId:userId}).toArray();
//       res.send(result);
//     })
//     app.patch('/add-room/:roomId', verifyToken, async (req, res) => {
//       const { roomId } = req.params;
//       const roomData = req.body;
//       const room = await roomCollection.findOne({ _id: new ObjectId(roomId) });
//       if (!room) {
//         return res.status(404).json({ message: "Room not found" });
//       }
//       await roomCollection.updateOne(
//         { _id: new ObjectId(roomId) },

//         {
//           $inc: { availableSeats: 1 },
//           $set: {
//              lastEnrolled: new Date()
//            }
//         },
//       );
//       const result = await add_roomCollection.insertOne({ ...roomData,enrollAt: new Date(),});
//       res.send(result);
//     });
//     app.post("/all_rooms", verifyToken, async (req, res) => {
//       const newRoom = req.body;
//       const result = await roomCollection.insertOne(newRoom);
//       res.send(result);
//     });
//     app.delete('/add-room/:id', verifyToken, async (req, res) => {
//       const { id } = req.params;
//       const enrollment = await add_roomCollection.findOne({ _id: new ObjectId(id) });
//       const roomId = enrollment?.roomId;
//       const result = await add_roomCollection.deleteOne({ _id: new ObjectId(id) });

//       await roomCollection.updateOne(
//         { _id: roomId }
//       );
//       res.send(result);
//     });
//   } finally {

//   }
// }
// run().catch(console.dir);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

// const express = require("express");
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const jwt = require("jsonwebtoken");

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 8000;

// // middleware
// app.use(express.json());
// app.use(cookieParser());

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   }),
// );
// app.use(express.json());

// // MongoDB
// const uri =
//   "mongodb+srv://studyhook:hNHIlOPhxR3EWX6L@cluster0.ftqmtiq.mongodb.net/?appName=Cluster0";

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// // ================= AUTH MIDDLEWARE =================
// const verifyToken = (req, res, next) => {
//   const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).send({ message: "Unauthorized" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = { id: decoded.userId };
//     next();
//   } catch (error) {
//     return res.status(401).send({ message: "Unauthorized" });
//   }
// };

// // ================= MAIN SERVER =================
// async function run() {
//   try {
//     await client.connect();

//     const db = client.db("studyhookdb");
//     const roomCollection = db.collection("room");
//     const add_roomCollection = db.collection("add-room");
//     const userCollection = db.collection("users");

//     // ================= AUTH ROUTES =================

//     // REGISTER
//     app.post("/register", async (req, res) => {
//       const user = req.body;

//       const result = await userCollection.insertOne(user);

//       res.send(result);
//     });

//     // LOGIN
//     app.post("/login", async (req, res) => {
//       const { email } = req.body;

//       const user = await userCollection.findOne({ email });

//       if (!user) {
//         return res.status(401).send({ message: "Invalid credentials" });
//       }

//       const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//         expiresIn: "7d",
//       });

//       res.cookie("token", token, {
//         httpOnly: true,
//         secure: false, // production এ true
//         sameSite: "strict",
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//       });

//       res.send({ message: "Login successful" });
//     });

//     // LOGOUT
//     app.post("/logout", (req, res) => {
//       res.clearCookie("token");
//       res.send({ message: "Logged out" });
//     });

//     // ================= ROOM ROUTES =================

//     // GET ALL ROOMS
//     app.get("/all_rooms", async (req, res) => {
//       const { search } = req.query;

//       let cursor;

//       if (search) {
//         cursor = roomCollection.find({
//           $or: [
//             { name: { $regex: search, $options: "i" } },
//             { floor: { $regex: search, $options: "i" } },
//           ],
//         });
//       } else {
//         cursor = roomCollection.find();
//       }

//       const result = await cursor.toArray();
//       res.send(result);
//     });

//     // FEATURED
//     app.get("/featured", async (req, res) => {
//       const result = await roomCollection.find().limit(6).toArray();
//       res.send(result);
//     });

//     // SINGLE ROOM (PROTECTED)
//     app.get("/all_rooms/:roomId", verifyToken, async (req, res) => {
//       const { roomId } = req.params;

//       const room = await roomCollection.findOne({
//         _id: new ObjectId(roomId),
//       });

//       res.send(room);
//     });

//     // USER LISTING (PROTECTED)
//     // app.get("/listing/:userId", verifyToken, async (req, res) => {
//     //   const { userId } = req.params;

//     //   const result = await roomCollection.find({ userId }).toArray();

//     //   res.send(result);
//     // });
//     //   app.get("/listing/:userId", async (req, res) => {
//     //   const { userId } = req.params;

//     //   const result = await add_roomCollection
//     //     .find({ userId: String(userId) })   // IMPORTANT FIX
//     //     .toArray();

//     //   res.send(result);
//     // });

//     // GET USER LISTING (PROTECTED)
//  app.get("/listing/:userId", verifyToken, async (req, res) => {
//    try {
//      const { userId } = req.params;

//      if (String(req.user.id) !== String(userId)) {
//        return res.status(403).send({ message: "Forbidden" });
//      }

//      const result = await roomCollection
//        .find({ userId: String(userId) })
//        .toArray();

//      return res.send(result);
//    } catch (err) {
//      console.log("GET ERROR:", err);
//      return res.status(500).send([]);
//    }
//  });
//     // ADD ROOM (PROTECTED)
//     // app.post("/all_rooms", verifyToken, async (req, res) => {
//     //   try {
//     //     const newRoom = {
//     //       ...req.body,
//     //       userId: req.user.id,
//     //       createdAt: new Date(),
//     //     };

//     //     const result = await roomCollection.insertOne(newRoom);

//     //     return res.send(result);
//     //   } catch (err) {
//     //     console.log("POST ERROR:", err);
//     //     return res.status(500).send({ message: "Server error" });
//     //   }
//     // });
//     app.post("/all_rooms", async (req, res) => {
//       const newRoom = req.body;
//       const result = await roomCollection.insertOne(newRoom);
//       res.send(result);
//     });

//     // ADD ROOM COLLECTION (PROTECTED)
//     app.get("/add-room/:userId", verifyToken, async (req, res) => {
//       const { userId } = req.params;

//       const result = await add_roomCollection.find({ userId }).toArray();

//       res.send(result);
//     });

//     // PATCH ROOM (PROTECTED)
//     app.patch("/add-room/:roomId", verifyToken, async (req, res) => {
//       const { roomId } = req.params;
//       const roomData = req.body;

//       const room = await roomCollection.findOne({
//         _id: new ObjectId(roomId),
//       });

//       if (!room) {
//         return res.status(404).send({ message: "Room not found" });
//       }

//       await roomCollection.updateOne(
//         { _id: new ObjectId(roomId) },
//         {
//           $inc: { availableSeats: 1 },
//           $set: { lastEnrolled: new Date() },
//         },
//       );

//       const result = await add_roomCollection.insertOne({
//         ...roomData,
//         enrollAt: new Date(),
//       });

//       res.send(result);
//     });

//     // DELETE ROOM (PROTECTED)
//     app.delete("/add-room/:id", verifyToken, async (req, res) => {
//       const { id } = req.params;

//       const enrollment = await add_roomCollection.findOne({
//         _id: new ObjectId(id),
//       });

//       const roomId = enrollment?.roomId;

//       const result = await add_roomCollection.deleteOne({
//         _id: new ObjectId(id),
//       });

//       if (roomId) {
//         await roomCollection.updateOne({
//           _id: new ObjectId(roomId),
//         });
//       }

//       res.send(result);
//     });
//   } finally {
//   }
// }

// run().catch(console.dir);

// // ROOT
// app.get("/", (req, res) => {
//   res.send("Server is running");
// });

// // START SERVER
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// const express = require("express");
// const dotenv = require("dotenv");
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const cors = require("cors");
// const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());
// const port = process.env.PORT || 8080;

// const uri = process.env.MONGODB_URI;

// const JWKS = createRemoteJWKSet(
//   new URL(`${process.env.CLIENT_URL}/api/auth/jwks`),
// );

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// const logger = (req, res, next) => {
//   console.log(`${req.method} | ${req.url}`);
//   next();
// };

// const verifyToken = async (req, res, next) => {
//   const { authorization } = req.headers;
//   //   console.log(req.headers, 'from verify token');
//   const token = authorization?.split(" ")[1];
//   //   console.log(token);

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorize" });
//   }

//   try {
//     const JWKS = createRemoteJWKSet(
//       new URL("http://localhost:3000/api/auth/jwks"),
//     );
//     const { payload } = await jwtVerify(token, JWKS);
//     req.user = payload;

//     next();
//   } catch (error) {
//     console.error("Token validation failed:", error);
//     return res.status(401).json({ message: "Unauthorize" });
//   }
// };

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     // await client.connect();
//     // Send a ping to confirm a successful connection
//     // await client.db('admin').command({ ping: 1 });
//     const db = client.db("studyhookdb");
//         const roomCollection = db.collection("room");
//         const add_roomCollection = db.collection("add-room");

//     app.get("/all_rooms", async (req, res) => {
//       //   console.log(req.query);

//       const { search } = req.query;

//       let cursor;
//       //   console.log(search.search);

//       //   console.log('from serch 1', search);
//       if (search) {
//         //   console.log('from serch 1');

//         // React core concept => Core
//         // cursor = await coursesCollection.find({
//         //   title: {
//         //     $regex: search,
//         //     $options: 'i',
//         //   },
//         // });
//         cursor = await roomCollection.find({
//           $or: [
//             {
//               title: {
//                 $regex: search,
//                 $options: "i",
//               },
//             },
//             {
//               instructor: {
//                 $regex: search,
//                 $options: "i",
//               },
//             },
//           ],
//         });

//         // console.log(cursor, 'from search');
//       } else {
//         cursor = roomCollection.find();
//       }

//       const result = await cursor.toArray();
//       //   console.log(result);

//       // console.log(result);
//       res.send(result);
//     });

//     app.get("/featured", async (req, res) => {
//       const cursor = roomCollection.find().limit(4);
//       const result = await cursor.toArray();
//       res.send(result);
//     });

//     app.get("/all_rooms/:roomId", logger, verifyToken, async (req, res) => {
//       // const roomId = req.params.roomId;
//       //   console.log(req.user, 'req');

//       const { roomId } = req.params;
//       //   console.log(roomId);
//       const query = { _id: new ObjectId(roomId) };
//       const result = await roomCollection.findOne(query);
//       res.send(result);
//     });

//     app.get("/add-room/:userId", verifyToken, async (req, res) => {
//       const { userId } = req.params;
//       const result = await add_roomCollection
//         .find({ userId: userId })
//         .toArray();
//       res.send(result);
//     });

//     app.patch("/add-room/:roomId", verifyToken, async (req, res) => {
//       //   console.log('from enrollment');

//       const { roomId } = req.params;
//       const enrollmentData = req.body;

//       const room = await roomCollection.findOne({
//         _id: new ObjectId(roomId),
//       });

//       if (!room) {
//         return res.status(404).json({ message: "Room not found" });
//       }
//       await roomCollection.updateOne(
//         { _id: new ObjectId(roomId) },
//         {
//           $inc: { enrollCount: 1 },
//           $set: {
//             lastEnrolledAt: new Date(),
//           },
//         },
//       );
//       //   console.log(enrollmentData);

//       const result = await add_roomCollection.insertOne({
//         ...enrollmentData,
//         enrolledAt: new Date(),
//       });

//       res.send(result);
//     });

//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!",
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

// const express = require("express");
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const app = express();
// const dotenv = require("dotenv");
// dotenv.config();
// const cors = require("cors");
// const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
// const port = process.env.PORT || 8000;
// app.use(cors());
// app.use(express.json());

// const uri =
//   "mongodb+srv://studyhook:hNHIlOPhxR3EWX6L@cluster0.ftqmtiq.mongodb.net/?appName=Cluster0";

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// const logger = (req, res, next) => {
//   next();
// };

// const verifyToken = async (req, res, next) => {
//   const { authorization } = req.headers;

//   // ✅ FIX: আগে check করো authorization আছে কিনা
//   if (!authorization) {
//     return res.status(401).send({ message: "Unauthorized" });
//   }

//   const token = authorization.split(" ")[1];

//   if (!token) {
//     return res.status(401).send({ message: "Unauthorized" });
//   }

//   try {
//     const JWKS = createRemoteJWKSet(
//       new URL("http://localhost:3000/api/auth/jwks"),
//     );
//     const { payload } = await jwtVerify(token, JWKS);
//     req.user = payload;
//     next();
//   } catch (error) {
//     console.error("Token validation failed:", error);
//     return res.status(401).send({ message: "Unauthorized" });
//   }
// };

// async function run() {
//   try {
//     await client.connect();
//     const db = client.db("studyhookdb");
//     const roomCollection = db.collection("room");
//     const add_roomCollection = db.collection("add-room");

//     app.get("/all_rooms", async (req, res) => {
//       const { search } = req.query;
//       let cursor;
//       if (search) {
//         cursor = await roomCollection.find({
//           $or: [
//             { name: { $regex: search, $options: "i" } },
//             { floor: { $regex: search, $options: "i" } },
//           ],
//         });
//       } else {
//         cursor = roomCollection.find();
//       }
//       const result = await cursor.toArray();
//       res.send(result);
//     });

//     app.get("/featured", async (req, res) => {
//       const cursor = roomCollection.find().limit(6);
//       const result = await cursor.toArray();
//       res.send(result);
//     });

//     app.get("/all_rooms/:roomId", logger, verifyToken, async (req, res) => {
//       const { roomId } = req.params;
//       const query = { _id: new ObjectId(roomId) };
//       const result = await roomCollection.findOne(query);
//       res.send(result);
//     });

//     app.get("/listing/:userId", verifyToken, async (req, res) => {
//       const { userId } = req.params;
//       const result = await roomCollection.find({ userId: userId }).toArray();
//       res.send(result);
//     });

//     app.get("/add-room/:userId", verifyToken, async (req, res) => {
//       const { userId } = req.params;
//       const result = await add_roomCollection
//         .find({ userId: userId })
//         .toArray();
//       res.send(result);
//     });

//     app.patch("/add-room/:roomId", verifyToken, async (req, res) => {
//       const { roomId } = req.params;
//       const roomData = req.body;
//       const room = await roomCollection.findOne({
//         _id: new ObjectId(roomId),
//       });
//       if (!room) {
//         return res.status(404).json({ message: "Room not found" });
//       }
//       await roomCollection.updateOne(
//         { _id: new ObjectId(roomId) },
//         {
//           $inc: { availableSeats: 1 },
//           $set: { lastEnrolled: new Date() },
//         },
//       );
//       const result = await add_roomCollection.insertOne({
//         ...roomData,
//         enrollAt: new Date(),
//       });
//       res.send(result);
//     });

//     app.post("/all_rooms", verifyToken, async (req, res) => {
//       const newRoom = req.body;
//       const result = await roomCollection.insertOne(newRoom);
//       res.send(result);
//     });

//     // ✅ FIX: delete route এ updateOne properly করা হয়েছে
//     app.delete("/add-room/:id", verifyToken, async (req, res) => {
//       const { id } = req.params;
//       const enrollment = await add_roomCollection.findOne({
//         _id: new ObjectId(id),
//       });
//       const roomId = enrollment?.roomId;
//       const result = await add_roomCollection.deleteOne({
//         _id: new ObjectId(id),
//       });

//       if (roomId) {
//         await roomCollection.updateOne(
//           { _id: new ObjectId(roomId) },
//           {
//             $inc: { availableSeats: -1 },
//           },
//         );
//       }

//       res.send(result);
//     });
//   } finally {
//   }
// }

// run().catch(console.dir);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

// const express = require("express");
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const app = express();
// const dotenv = require("dotenv");
// dotenv.config();
// const cors = require("cors");
// const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
// const port = process.env.PORT || 8000;
// app.use(cors());
// app.use(express.json());

// const uri =
//   "mongodb+srv://studyhook:hNHIlOPhxR3EWX6L@cluster0.ftqmtiq.mongodb.net/?appName=Cluster0";

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// const logger = (req, res, next) => {
//   next();
// };

// const verifyToken = async (req, res, next) => {
//   const { authorization } = req.headers;

//   if (!authorization) {
//     return res.status(401).send({ message: "Unauthorized" });
//   }

//   const token = authorization.split(" ")[1];

//   if (!token) {
//     return res.status(401).send({ message: "Unauthorized" });
//   }

//   try {
//     const JWKS = createRemoteJWKSet(
//       new URL("http://localhost:3000/api/auth/jwks"),
//     );
//     const { payload } = await jwtVerify(token, JWKS);
//     req.user = payload;
//     next();
//   } catch (error) {
//     console.error("Token validation failed:", error);
//     return res.status(401).send({ message: "Unauthorized" });
//   }
// };

// async function run() {
//   try {
//     await client.connect();
//     const db = client.db("studyhookdb");
//     const roomCollection = db.collection("room");
//     const add_roomCollection = db.collection("add-room");

//     app.get("/all_rooms", async (req, res) => {
//       const { search } = req.query;
//       let cursor;
//       if (search) {
//         cursor = await roomCollection.find({
//           $or: [
//             { name: { $regex: search, $options: "i" } },
//             { floor: { $regex: search, $options: "i" } },
//           ],
//         });
//       } else {
//         cursor = roomCollection.find();
//       }
//       const result = await cursor.toArray();
//       res.send(result);
//     });

//     app.get("/featured", async (req, res) => {
//       const cursor = roomCollection.find().limit(6);
//       const result = await cursor.toArray();
//       res.send(result);
//     });

//     app.get("/all_rooms/:roomId", logger, verifyToken, async (req, res) => {
//       const { roomId } = req.params;
//       const query = { _id: new ObjectId(roomId) };
//       const result = await roomCollection.findOne(query);
//       res.send(result);
//     });

//     // ✅ NEW: Room update route
//     app.patch("/all_rooms/:roomId", verifyToken, async (req, res) => {
//       const { roomId } = req.params;
//       const updatedData = req.body;

//       const room = await roomCollection.findOne({ _id: new ObjectId(roomId) });
//       if (!room) {
//         return res.status(404).json({ message: "Room not found" });
//       }

//       const result = await roomCollection.updateOne(
//         { _id: new ObjectId(roomId) },
//         {
//           $set: {
//             name: updatedData.name,
//             description: updatedData.description,
//             image: updatedData.image,
//             floor: updatedData.floor,
//             price: updatedData.price,
//             Capacity: updatedData.Capacity,
//             category: updatedData.category,
//           },
//         },
//       );

//       res.send(result);
//     });

//     app.get("/listing/:userId", verifyToken, async (req, res) => {
//       const { userId } = req.params;
//       const result = await roomCollection.find({ userId: userId }).toArray();
//       res.send(result);
//     });

//     app.get("/add-room/:userId", verifyToken, async (req, res) => {
//       const { userId } = req.params;
//       const result = await add_roomCollection
//         .find({ userId: userId })
//         .toArray();
//       res.send(result);
//     });

//     app.patch("/add-room/:roomId", verifyToken, async (req, res) => {
//       const { roomId } = req.params;
//       const roomData = req.body;
//       const room = await roomCollection.findOne({
//         _id: new ObjectId(roomId),
//       });
//       if (!room) {
//         return res.status(404).json({ message: "Room not found" });
//       }
//       await roomCollection.updateOne(
//         { _id: new ObjectId(roomId) },
//         {
//           $inc: { availableSeats: 1 },
//           $set: { lastEnrolled: new Date() },
//         },
//       );
//       const result = await add_roomCollection.insertOne({
//         ...roomData,
//         enrollAt: new Date(),
//       });
//       res.send(result);
//     });

//     app.post("/all_rooms", verifyToken, async (req, res) => {
//       const newRoom = req.body;
//       const result = await roomCollection.insertOne(newRoom);
//       res.send(result);
//     });

//     app.delete("/add-room/:id", verifyToken, async (req, res) => {
//       const { id } = req.params;
//       const enrollment = await add_roomCollection.findOne({
//         _id: new ObjectId(id),
//       });
//       const roomId = enrollment?.roomId;
//       const result = await add_roomCollection.deleteOne({
//         _id: new ObjectId(id),
//       });

//       if (roomId) {
//         await roomCollection.updateOne(
//           { _id: new ObjectId(roomId) },
//           { $inc: { availableSeats: -1 } },
//         );
//       }

//       res.send(result);
//     });
//   } finally {
//   }
// }

// run().catch(console.dir);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
const port = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://studyhook:hNHIlOPhxR3EWX6L@cluster0.ftqmtiq.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const logger = (req, res, next) => {
  next();
};

const verifyToken = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  const token = authorization.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  try {
    const JWKS = createRemoteJWKSet(
      new URL("http://localhost:3000/api/auth/jwks"),
    );
    const { payload } = await jwtVerify(token, JWKS);
    req.user = payload;
    next();
  } catch (error) {
    console.error("Token validation failed:", error);
    return res.status(401).send({ message: "Unauthorized" });
  }
};

async function run() {
  try {
    await client.connect();
    const db = client.db("studyhookdb");
    const roomCollection = db.collection("room");
    const add_roomCollection = db.collection("add-room");

    app.get("/all_rooms", async (req, res) => {
      const { search } = req.query;
      let cursor;
      if (search) {
        cursor = await roomCollection.find({
          $or: [
            { name: { $regex: search, $options: "i" } },
            { floor: { $regex: search, $options: "i" } },
          ],
        });
      } else {
        cursor = roomCollection.find();
      }
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/featured", async (req, res) => {
      const cursor = roomCollection.find().limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/all_rooms/:roomId", logger, verifyToken, async (req, res) => {
      const { roomId } = req.params;
      const query = { _id: new ObjectId(roomId) };
      const result = await roomCollection.findOne(query);
      res.send(result);
    });

    app.patch("/all_rooms/:roomId", verifyToken, async (req, res) => {
      const { roomId } = req.params;
      const updatedData = req.body;
      const room = await roomCollection.findOne({ _id: new ObjectId(roomId) });
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      const result = await roomCollection.updateOne(
        { _id: new ObjectId(roomId) },
        {
          $set: {
            name: updatedData.name,
            description: updatedData.description,
            image: updatedData.image,
            floor: updatedData.floor,
            price: updatedData.price,
            Capacity: updatedData.Capacity,
            category: updatedData.category,
          },
        },
      );
      res.send(result);
    });

    app.get("/listing/:userId", verifyToken, async (req, res) => {
      const { userId } = req.params;
      const result = await roomCollection.find({ userId: userId }).toArray();
      res.send(result);
    });

    app.get("/add-room/:userId", verifyToken, async (req, res) => {
      const { userId } = req.params;
      const result = await add_roomCollection
        .find({ userId: userId })
        .toArray();
      res.send(result);
    });

    // ✅ BOOKING: Create with conflict check
    app.post("/bookings", verifyToken, async (req, res) => {
      const {
        roomId,
        userId,
        studentName,
        studentEmail,
        bookingDate,
        startTime,
        endTime,
        totalCost,
        specialNote,
        roomName,
        roomImage,
      } = req.body;

      // Conflict check — same room, same date, confirmed booking, overlapping time
      const conflict = await add_roomCollection.findOne({
        roomId: roomId,
        bookingDate: bookingDate,
        status: "confirmed",
        $or: [
          // new booking starts inside existing
          { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        ],
      });

      if (conflict) {
        return res.status(409).json({
          message:
            "This time slot is already booked. Please choose another time.",
        });
      }

      const result = await add_roomCollection.insertOne({
        roomId,
        userId,
        studentName,
        studentEmail,
        bookingDate,
        startTime,
        endTime,
        totalCost,
        specialNote: specialNote || "",
        roomName,
        roomImage,
        status: "confirmed",
        enrollAt: new Date(),
      });

      res.send(result);
    });

    // ✅ Bookings GET — user এর সব bookings
    app.get("/bookings/:userId", verifyToken, async (req, res) => {
      const { userId } = req.params;
      const bookings = await add_roomCollection
        .find({ userId: userId })
        .toArray();

      const populated = await Promise.all(
        bookings.map(async (booking) => {
          let roomData = null;
          if (booking.roomId) {
            try {
              roomData = await roomCollection.findOne({
                _id: new ObjectId(booking.roomId),
              });
            } catch (e) {}
          }
          return {
            ...booking,
            roomName: roomData?.name || booking.roomName || "Unknown Room",
            roomImage: roomData?.image || booking.roomImage || "",
          };
        }),
      );

      res.send(populated);
    });

    // ✅ Cancel booking
    // app.patch("/bookings/:id/cancel", verifyToken, async (req, res) => {
    //   const { id } = req.params;
    //   const result = await add_roomCollection.updateOne(
    //     { _id: new ObjectId(id) },
    //     { $set: { status: "cancelled" } },
    //   );
    //   res.send(result);
    // });

    app.patch("/bookings/:id/cancel", verifyToken, async (req, res) => {
      const { id } = req.params;

      // booking খুঁজে বের করো
      let booking;
      try {
        booking = await add_roomCollection.findOne({ _id: new ObjectId(id) });
      } catch {
        return res.status(400).json({ message: "Invalid booking ID" });
      }

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // ✅ verify করো — এই booking টা logged-in user এর কিনা
      if (booking.userId !== req.user.sub && booking.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // ✅ already cancelled কিনা check করো
      if (booking.status === "cancelled") {
        return res
          .status(400)
          .json({ message: "Booking is already cancelled" });
      }

      // ✅ booking date future কিনা check করো
      const bookingDate = new Date(booking.bookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (bookingDate < today) {
        return res
          .status(400)
          .json({ message: "Cannot cancel a past booking" });
      }

      // ✅ status → "cancelled" update করো
      await add_roomCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "cancelled", cancelledAt: new Date() } },
      );

      // ✅ (Optional) room এর bookingCount কমাও
      if (booking.roomId) {
        try {
          await roomCollection.updateOne(
            { _id: new ObjectId(booking.roomId) },
            { $inc: { bookingCount: -1 } },
          );
        } catch {
          // roomId invalid হলেও main operation fail করবে না
        }
      }

      res.json({ message: "Booking cancelled successfully" });
    });

    app.patch("/add-room/:roomId", verifyToken, async (req, res) => {
      const { roomId } = req.params;
      const roomData = req.body;
      const room = await roomCollection.findOne({ _id: new ObjectId(roomId) });
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      await roomCollection.updateOne(
        { _id: new ObjectId(roomId) },
        {
          $inc: { availableSeats: 1 },
          $set: { lastEnrolled: new Date() },
        },
      );
      const result = await add_roomCollection.insertOne({
        ...roomData,
        enrollAt: new Date(),
        status: "confirmed",
        bookingDate: roomData.bookingDate || new Date(),
      });
      res.send(result);
    });

    app.post("/all_rooms", verifyToken, async (req, res) => {
      const newRoom = req.body;
      const result = await roomCollection.insertOne(newRoom);
      res.send(result);
    });

    app.delete("/add-room/:id", verifyToken, async (req, res) => {
      const { id } = req.params;
      const enrollment = await add_roomCollection.findOne({
        _id: new ObjectId(id),
      });
      const roomId = enrollment?.roomId;
      const result = await add_roomCollection.deleteOne({
        _id: new ObjectId(id),
      });
      if (roomId) {
        await roomCollection.updateOne(
          { _id: new ObjectId(roomId) },
          { $inc: { availableSeats: -1 } },
        );
      }
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});