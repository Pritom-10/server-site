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
//       const { search, amenities, minPrice, maxPrice } = req.query;

//       const query = {};

//       if (search) {
//         query.$or = [
//           { name: { $regex: search, $options: "i" } },
//           { floor: { $regex: search, $options: "i" } },
//         ];
//       }

//      if (amenities) {
//   const amenityList = amenities.split(",").map((a) => a.trim());
//   query.amenities = { $all: amenityList };
//       }
//       if (minPrice || maxPrice) {
//         query.hourlyRate = {};
//         if (minPrice) query.hourlyRate.$gte = parseFloat(minPrice);
//         if (maxPrice) query.hourlyRate.$lte = parseFloat(maxPrice);
//       }

//       const result = await roomCollection.find(query).toArray();
//       res.send(result);
//     });

//     app.get("/featured", async (req, res) => {
//       const cursor = roomCollection.find().limit(6);
//       const result = await cursor.toArray();
//       res.send(result);
//     });

//     app.get("/all_rooms/:roomId", logger, async (req, res) => {
//       const { roomId } = req.params;
//       const query = { _id: new ObjectId(roomId) };
//       const result = await roomCollection.findOne(query);
//       res.send(result);
//     });

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
//             hourlyRate: updatedData.hourlyRate,
//             seatCapacity: updatedData.seatCapacity,
//             amenities: updatedData.amenities,
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
//     app.post("/bookings", verifyToken, async (req, res) => {
//       const {
//         roomId,
//         userId,
//         studentName,
//         studentEmail,
//         bookingDate,
//         startTime,
//         endTime,
//         totalCost,
//         specialNote,
//         roomName,
//         roomImage,
//       } = req.body;

//       const conflict = await add_roomCollection.findOne({
//         roomId: roomId,
//         bookingDate: bookingDate,
//         status: "confirmed",
//         $or: [

//           { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
//         ],
//       });

//       if (conflict) {
//         return res.status(409).json({
//           message:
//             "This time slot is already booked. Please choose another time.",
//         });
//       }

//       const result = await add_roomCollection.insertOne({
//         roomId,
//         userId,
//         studentName,
//         studentEmail,
//         bookingDate,
//         startTime,
//         endTime,
//         totalCost,
//         specialNote: specialNote || "",
//         roomName,
//         roomImage,
//         status: "confirmed",
//         enrollAt: new Date(),
//       });
//       if (roomId) {
//         await roomCollection.updateOne(
//           { _id: new ObjectId(roomId) },
//           { $inc: { seatCapacity: -1 } },
//         );
//       }

//       res.send(result);
//     });

//     app.get("/bookings/:userId", verifyToken, async (req, res) => {
//       const { userId } = req.params;
//        console.log("Bookings request আসছে, userId:", userId);
//       const bookings = await add_roomCollection
//         .find({ userId: userId })
//         .toArray();

//       const populated = await Promise.all(
//         bookings.map(async (booking) => {
//           let roomData = null;
//           if (booking.roomId) {
//             try {
//               roomData = await roomCollection.findOne({
//                 _id: new ObjectId(booking.roomId),
//               });
//             } catch (e) {}
//           }
//           return {
//             ...booking,
//             roomName: roomData?.name || booking.roomName || "Unknown Room",
//             roomImage: roomData?.image || booking.roomImage || "",
//           };
//         }),
//       );

//       res.send(populated);
//     });

//     app.patch("/bookings/:id/cancel", verifyToken, async (req, res) => {
//       const { id } = req.params;

//       let booking;
//       try {
//         booking = await add_roomCollection.findOne({ _id: new ObjectId(id) });
//       } catch {
//         return res.status(400).json({ message: "Invalid booking ID" });
//       }

//       if (!booking) {
//         return res.status(404).json({ message: "Booking not found" });
//       }

//       if (booking.userId !== req.user.sub && booking.userId !== req.user.id) {
//         return res.status(403).json({ message: "Forbidden" });
//       }

//       if (booking.status === "cancelled") {
//         return res
//           .status(400)
//           .json({ message: "Booking is already cancelled" });
//       }

//       const bookingDate = new Date(booking.bookingDate);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       if (bookingDate < today) {
//         return res
//           .status(400)
//           .json({ message: "Cannot cancel a past booking" });
//       }

//       await add_roomCollection.updateOne(
//         { _id: new ObjectId(id) },
//         { $set: { status: "cancelled", cancelledAt: new Date() } },
//       );

//       if (booking.roomId) {
//         try {
//           await roomCollection.updateOne(
//             { _id: new ObjectId(booking.roomId) },
//             { $inc: { bookingCount: -1 } },
//           );
//         } catch {
//           // roomId invalid হলেও main operation fail করবে না
//         }
//       }
//       if (booking.roomId) {
//         try {
//           await roomCollection.updateOne(
//             { _id: new ObjectId(booking.roomId) },
//             { $inc: { seatCapacity: 1 } },
//           );
//         } catch {}
//       }

//       res.json({ message: "Booking cancelled successfully" });
//     });

//     app.post("/all_rooms", verifyToken, async (req, res) => {
//       const newRoom = req.body;
//       const result = await roomCollection.insertOne(newRoom);
//       res.send(result);
//     });

//     app.delete("/all_rooms/:roomId", verifyToken, async (req, res) => {
//       const { roomId } = req.params;
//       try {
//         const result = await roomCollection.deleteOne({
//           _id: new ObjectId(roomId),
//         });
//         if (result.deletedCount === 0) {
//           return res.status(404).json({ message: "Room not found" });
//         }
//         res.json({ message: "Room deleted successfully" });
//       } catch (error) {
//         res.status(500).json({ message: "Server error" });
//       }
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
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // ← cookie পাঠাতে দরকার
  }),
);
app.use(express.json());
app.use(cookieParser());

const uri =
  "mongodb+srv://studyhook:hNHIlOPhxR3EWX6L@cluster0.ftqmtiq.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// ✅ নিজের verifyToken — cookie থেকে নেবে
const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

async function run() {
  try {
    await client.connect();
    const db = client.db("studyhookdb");
    const userCollection = db.collection("users");
    const roomCollection = db.collection("room");
    const add_roomCollection = db.collection("add-room");

    // ✅ Register
    app.post("/register", async (req, res) => {
      const { name, email, password, photoURL } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const existing = await userCollection.findOne({ email });
      if (existing) {
        return res.status(409).json({ message: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await userCollection.insertOne({
        name,
        email,
        password: hashedPassword,
        photoURL: photoURL || "",
        createdAt: new Date(),
      });

      res
        .status(201)
        .json({ message: "Registration successful! Please login." });
    });

    // ✅ Login
    app.post("/login", async (req, res) => {
      const { email, password } = req.body;

      const user = await userCollection.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          photoURL: user.photoURL,
        },
      });
    });

    // ✅ Logout
    app.post("/logout", (req, res) => {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      });
      res.json({ message: "Logged out successfully" });
    });

    // ✅ Get current user (session check)
    app.get("/me", verifyToken, async (req, res) => {
      const user = await userCollection.findOne(
        { _id: new ObjectId(req.user.id) },
        { projection: { password: 0 } },
      );
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    });

    // All Rooms
    app.get("/all_rooms", async (req, res) => {
      const { search, amenities, minPrice, maxPrice } = req.query;
      const query = {};

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { floor: { $regex: search, $options: "i" } },
        ];
      }
      if (amenities) {
        const amenityList = amenities.split(",").map((a) => a.trim());
        query.amenities = { $all: amenityList };
      }
      if (minPrice || maxPrice) {
        query.hourlyRate = {};
        if (minPrice) query.hourlyRate.$gte = parseFloat(minPrice);
        if (maxPrice) query.hourlyRate.$lte = parseFloat(maxPrice);
      }

      const result = await roomCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/featured", async (req, res) => {
      const result = await roomCollection.find().limit(6).toArray();
      res.send(result);
    });

    app.get("/all_rooms/:roomId", async (req, res) => {
      const { roomId } = req.params;
      const result = await roomCollection.findOne({
        _id: new ObjectId(roomId),
      });
      res.send(result);
    });

    app.patch("/all_rooms/:roomId", verifyToken, async (req, res) => {
      const { roomId } = req.params;
      const updatedData = req.body;
      const room = await roomCollection.findOne({ _id: new ObjectId(roomId) });
      if (!room) return res.status(404).json({ message: "Room not found" });

      const result = await roomCollection.updateOne(
        { _id: new ObjectId(roomId) },
        {
          $set: {
            name: updatedData.name,
            description: updatedData.description,
            image: updatedData.image,
            floor: updatedData.floor,
            hourlyRate: updatedData.hourlyRate,
            seatCapacity: updatedData.seatCapacity,
            amenities: updatedData.amenities,
          },
        },
      );
      res.send(result);
    });

    app.post("/all_rooms", verifyToken, async (req, res) => {
      const newRoom = req.body;
      const result = await roomCollection.insertOne(newRoom);
      res.send(result);
    });

    app.delete("/all_rooms/:roomId", verifyToken, async (req, res) => {
      const { roomId } = req.params;
      try {
        const result = await roomCollection.deleteOne({
          _id: new ObjectId(roomId),
        });
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Room not found" });
        }
        res.json({ message: "Room deleted successfully" });
      } catch {
        res.status(500).json({ message: "Server error" });
      }
    });

    // My Listings
    app.get("/listing/:userId", verifyToken, async (req, res) => {
      const { userId } = req.params;
      const result = await roomCollection.find({ userId: userId }).toArray();
      res.send(result);
    });

    // Bookings
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

      const conflict = await add_roomCollection.findOne({
        roomId,
        bookingDate,
        status: "confirmed",
        $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
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

      if (roomId) {
        await roomCollection.updateOne(
          { _id: new ObjectId(roomId) },
          { $inc: { seatCapacity: -1 } },
        );
      }

      res.send(result);
    });

    app.get("/bookings/:userId", verifyToken, async (req, res) => {
      const { userId } = req.params;
      const bookings = await add_roomCollection.find({ userId }).toArray();

      const populated = await Promise.all(
        bookings.map(async (booking) => {
          let roomData = null;
          if (booking.roomId) {
            try {
              roomData = await roomCollection.findOne({
                _id: new ObjectId(booking.roomId),
              });
            } catch {}
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

    app.patch("/bookings/:id/cancel", verifyToken, async (req, res) => {
      const { id } = req.params;

      let booking;
      try {
        booking = await add_roomCollection.findOne({ _id: new ObjectId(id) });
      } catch {
        return res.status(400).json({ message: "Invalid booking ID" });
      }

      if (!booking)
        return res.status(404).json({ message: "Booking not found" });

      // ✅ req.user.id দিয়ে check
      if (booking.userId !== req.user.id.toString()) {
        return res.status(403).json({ message: "Forbidden" });
      }

      if (booking.status === "cancelled") {
        return res
          .status(400)
          .json({ message: "Booking is already cancelled" });
      }

      const bookingDate = new Date(booking.bookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (bookingDate < today) {
        return res
          .status(400)
          .json({ message: "Cannot cancel a past booking" });
      }

      await add_roomCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "cancelled", cancelledAt: new Date() } },
      );

      if (booking.roomId) {
        try {
          await roomCollection.updateOne(
            { _id: new ObjectId(booking.roomId) },
            { $inc: { seatCapacity: 1 } },
          );
        } catch {}
      }

      res.json({ message: "Booking cancelled successfully" });
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});