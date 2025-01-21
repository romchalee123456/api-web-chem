import express from 'express';
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Mock Database
let users = [
  {
    id: 1,
    firstName: "รมย์ชลี",
    lastName: "เดือนแร่รัมย์",
    position: "เจ้าหน้าที่ปฏิบัติการ",
    major: "เคมี",
    email: "romchalee477@gmail.com",
    password: "admin123",
  },
];
let requisitions = [];
let equipment = [
  {
    id: 1,
    name: "Petri Dish",
    available: true,
    image:
      "https://snp-scientific.com/wp-content/uploads/2021/02/Petridish_1-300x300.jpg",
    quantity: 10,
  },
  {
    id: 2,
    name: "Watch Glass",
    available: true,
    image:
      "https://snp-scientific.com/wp-content/uploads/2021/02/Watch-Glass-300x300.jpg",
    quantity: 10,
  },
  {
    id: 3,
    name: "Graduated Pipette",
    available: true,
    image:
      "https://snp-scientific.com/wp-content/uploads/2021/02/18620087-300x300.jpg",
    quantity: 10,
  },
  {
    id: 4,
    name: "Volumetric Pipette",
    available: true,
    image: "https://snp-scientific.com/wp-content/uploads/2021/02/11691624.jpg",
    quantity: 10,
  },
  {
    id: 5,
    name: "Burette",
    available: true,
    image:
      "https://snp-scientific.com/wp-content/uploads/2021/02/049_We_offer_amber_burettes-300x300.jpg",
    quantity: 10,
  },
  {
    id: 6,
    name: "Beaker",
    available: true,
    image:
      "https://snp-scientific.com/wp-content/uploads/2021/04/1.Beaker-417010250-2-1-300x300.jpg",
    quantity: 10,
  },
  {
    id: 7,
    name: "Erlenmeyer flask",
    available: true,
    image:
      "https://snp-scientific.com/wp-content/uploads/2021/04/2.Erlen-flask-417119500-2-300x300.jpg",
    quantity: 10,
  },
  {
    id: 8,
    name: "Screw Erlenmeyer flask",
    available: true,
    image:
      "https://snp-scientific.com/wp-content/uploads/2021/04/Screw-Erlenmayer-flask-1-300x300.jpg",
    quantity: 10,
  },
  {
    id: 9,
    name: "Volumetric flask",
    available: true,
    image:
      "https://snp-scientific.com/wp-content/uploads/2021/04/4.volum-flask-431622044-2-300x300.jpg",
    quantity: 10,
  },
  {
    id: 10,
    name: "Volumetric flask brown",
    available: true,
    image:
      "https://snp-scientific.com/wp-content/uploads/2021/04/Volumetric-flask-brown-1-300x300.jpg",
    quantity: 10,
  },
  {
    id: 11,
    name: "Reagent bottle with screw GL45",
    available: true,
    image:
      "https://snp-scientific.com/wp-content/uploads/2021/04/Reagent-bottle-with-screw-GL45-1-300x300.jpg",
    quantity: 10,
  },
  {
    id: 12,
    name: "Reagent bottle with screw GL45 Brown",
    available: true,
    image:
      "https://snp-scientific.com/wp-content/uploads/2021/04/Reagent-bottle-with-screw-GL45-brown-1-300x300.jpg",
    quantity: 10,
  },
  // เพิ่มข้อมูลเริ่มต้นอื่น ๆ ตามต้องการ
];

// 1. เส้น API เก็บข้อมูลบุคคล
app.post("/api/users", (req, res) => {
  const { firstName, lastName, position, major, email, password } = req.body;
  if (!firstName || !lastName || !position || !major || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (!["เจ้าหน้าที่ปฏิบัติการ", "อาจารย์", "นักศึกษา"].includes(position)) {
    return res.status(400).json({ error: "Invalid position" });
  }
  const newUser = {
    id: users.length + 1,
    firstName,
    lastName,
    position,
    major,
    email,
    password,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// 2. เส้น API ดึงข้อมูลบุคคล
app.get("/api/users", (req, res) => {
  // ดึงเฉพาะข้อมูลชื่อ (firstName, lastName)
  const userNames = users.map((user) => ({
    firstName: user.firstName,
    lastName: user.lastName,
  }));

  res.json(userNames);
});

// 3. เส้น API เก็บข้อมูลการเบิก การอนุมัติ
app.post("/api/requisitions", (req, res) => {
  const { userId, status = "รออนุมัติ" } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  const newRequisition = { id: requisitions.length + 1, userId, status };
  requisitions.push(newRequisition);
  res.status(201).json(newRequisition);
});

// เส้น API แสดงข้อมูลการเบิก
app.get("/api/requisitions", (req, res) => {
  res.json(requisitions);
});

// เส้น API สำหรับเพิ่มอุปกรณ์ใหม่
app.post("/api/equipment", (req, res) => {
  const { name, image, quantity } = req.body;

  // ตรวจสอบข้อมูลที่ต้องการ
  if (!name || !image || quantity == null) {
    return res
      .status(400)
      .json({ error: "Name, image, and quantity are required" });
  }
  // สร้าง ID ใหม่ (โดยการเพิ่ม 1 จาก ID ที่สูงสุดในปัจจุบัน)
  const newId =
    equipment.length > 0 ? Math.max(...equipment.map((e) => e.id)) + 1 : 1;

  // สร้างอุปกรณ์ใหม่
  const newEquipment = { id: newId, name, image, available: true, quantity };

  // เพิ่มข้อมูลใหม่เข้าไปในอาร์เรย์
  equipment.push(newEquipment);

  // ส่งข้อมูลที่เพิ่มไป
  res.status(201).json(newEquipment);
});

// เส้น API สำหรับ login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // ตรวจสอบว่าผู้ใช้ส่ง email และ password มาหรือไม่
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // ค้นหาผู้ใช้ใน mock database
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // ลบ password ออกจาก response เพื่อความปลอดภัย
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    message: "Login successful",
    user: userWithoutPassword,
  });
});

// เส้น API แก้ไขข้อมูลอุปกรณ์
app.put("/api/equipment/:id", (req, res) => {
  const { id } = req.params;
  const { name, image, type, quantity } = req.body;
  const item = equipment.find((e) => e.id === parseInt(id));
  if (!item) return res.status(404).json({ error: "Equipment not found" });
  if (name) item.name = name;
  if (image) item.image = image;
  if (type) item.type = type;
  if (quantity != null) item.quantity = quantity;
  res.json(item);
});

// เส้น API แสดงข้อมูลอุปกรณ์
app.get("/api/equipment", (req, res) => {
  res.json(equipment);
});

// เส้น API สำหรับการยืมอุปกรณ์
app.post("/api/borrow/:id", (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body; // จำนวนที่ยืม

  if (!quantity || quantity <= 0) {
    return res
      .status(400)
      .json({ error: "Quantity to borrow must be greater than 0" });
  }

  const item = equipment.find((e) => e.id === parseInt(id));
  if (!item) {
    return res.status(404).json({ error: "Equipment not found" });
  }

  if (item.quantity < quantity) {
    return res.status(400).json({ error: "Not enough equipment available" });
  }

  // ลดจำนวนอุปกรณ์ที่ยืมไป
  item.quantity -= quantity;
  res.json({ message: `${quantity} items borrowed`, equipment: item });
});

// เส้น API สำหรับการคืนอุปกรณ์
app.post("/api/return/:id", (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body; // จำนวนที่คืน

  if (!quantity || quantity <= 0) {
    return res
      .status(400)
      .json({ error: "Quantity to return must be greater than 0" });
  }

  const item = equipment.find((e) => e.id === parseInt(id));
  if (!item) {
    return res.status(404).json({ error: "Equipment not found" });
  }

  // เพิ่มจำนวนอุปกรณ์ที่คืน
  item.quantity += quantity;
  res.json({ message: `${quantity} items returned`, equipment: item });
});

// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
