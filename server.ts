import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("school.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    birth_date TEXT,
    parent_name TEXT,
    parent_phone TEXT,
    status TEXT DEFAULT 'active'
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    amount REAL,
    due_date TEXT,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY(student_id) REFERENCES students(id)
  );

  CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT,
    time TEXT,
    plan TEXT
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    message TEXT,
    date TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    date TEXT DEFAULT CURRENT_TIMESTAMP,
    passing INTEGER,
    shooting INTEGER,
    dribbling INTEGER,
    vision INTEGER,
    positioning INTEGER,
    speed INTEGER,
    endurance INTEGER,
    comments TEXT,
    FOREIGN KEY(student_id) REFERENCES students(id)
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    date TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS equipment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    total_quantity INTEGER DEFAULT 0,
    available_quantity INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS equipment_loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    equipment_id INTEGER,
    student_id INTEGER,
    loan_date TEXT DEFAULT CURRENT_TIMESTAMP,
    expected_return_date TEXT,
    actual_return_date TEXT,
    FOREIGN KEY(equipment_id) REFERENCES equipment(id),
    FOREIGN KEY(student_id) REFERENCES students(id)
  );

  -- Seed data
  INSERT OR IGNORE INTO students (id, name, category, birth_date, parent_name, parent_phone) VALUES 
  (1, 'Lucas Silva', 'Sub-11', '2013-05-12', 'Ricardo Silva', '(48) 99123-4567'),
  (2, 'Gabriel Santos', 'Sub-13', '2011-08-20', 'Maria Santos', '(48) 98877-6655'),
  (3, 'Enzo Oliveira', 'Sub-7', '2017-02-15', 'Juliana Oliveira', '(48) 99911-2233');

  INSERT OR IGNORE INTO classes (id, title, category, date, time, plan) VALUES 
  (1, 'Treino Técnico: Passe e Recepção', 'Sub-11', '2024-03-10', '14:30', 'Foco em passes curtos e domínio orientado.'),
  (2, 'Coletivo Tático', 'Sub-13', '2024-03-10', '16:00', 'Posicionamento defensivo e transição rápida.');

  INSERT OR IGNORE INTO notifications (id, title, message) VALUES 
  (1, 'Uniforme Novo Disponível', 'Os novos uniformes de treino já podem ser retirados na secretaria.'),
  (2, 'Reunião de Pais', 'Convidamos todos para a reunião trimestral no próximo sábado às 09h.');

  INSERT OR IGNORE INTO equipment (id, name, total_quantity, available_quantity) VALUES 
  (1, 'Bola Penalty S11', 20, 15),
  (2, 'Colete Azul', 30, 25),
  (3, 'Cone Chinês', 50, 50);

  INSERT OR IGNORE INTO news (id, title, description, image_url) VALUES 
  (1, 'Vitória no Clássico!', 'Nossa equipe Sub-15 venceu o clássico estadual por 2x0 no último final de semana.', 'https://picsum.photos/seed/soccer1/800/400'),
  (2, 'Peneira Aberta', 'Estão abertas as inscrições para a nova seletiva de atletas nascidos entre 2010 e 2012.', 'https://picsum.photos/seed/soccer2/800/400');

  INSERT OR IGNORE INTO evaluations (id, student_id, passing, shooting, dribbling, vision, positioning, speed, endurance, comments) VALUES 
  (1, 1, 8, 7, 9, 8, 7, 9, 8, 'Excelente evolução no drible e velocidade. Precisa focar mais no posicionamento defensivo.'),
  (2, 2, 9, 9, 7, 9, 8, 7, 9, 'Finalizador nato. Visão de jogo acima da média para a categoria.');
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/students", (req, res) => {
    const students = db.prepare("SELECT * FROM students").all();
    res.json(students);
  });

  app.post("/api/students", (req, res) => {
    const { name, category, birth_date, parent_name, parent_phone } = req.body;
    const info = db.prepare("INSERT INTO students (name, category, birth_date, parent_name, parent_phone) VALUES (?, ?, ?, ?, ?)").run(name, category, birth_date, parent_name, parent_phone);
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/payments", (req, res) => {
    const payments = db.prepare(`
      SELECT p.*, s.name as student_name 
      FROM payments p 
      JOIN students s ON p.student_id = s.id
    `).all();
    res.json(payments);
  });

  app.post("/api/payments", (req, res) => {
    const { student_id, amount, due_date } = req.body;
    const info = db.prepare("INSERT INTO payments (student_id, amount, due_date) VALUES (?, ?, ?)").run(student_id, amount, due_date);
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/classes", (req, res) => {
    const classes = db.prepare("SELECT * FROM classes").all();
    res.json(classes);
  });

  app.post("/api/classes", (req, res) => {
    const { title, category, date, time, plan } = req.body;
    const info = db.prepare("INSERT INTO classes (title, category, date, time, plan) VALUES (?, ?, ?, ?, ?)").run(title, category, date, time, plan);
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/notifications", (req, res) => {
    const notifications = db.prepare("SELECT * FROM notifications ORDER BY date DESC").all();
    res.json(notifications);
  });

  app.post("/api/notifications", (req, res) => {
    const { title, message } = req.body;
    const info = db.prepare("INSERT INTO notifications (title, message) VALUES (?, ?)").run(title, message);
    res.json({ id: info.lastInsertRowid });
  });

  // New API Routes
  app.get("/api/evaluations", (req, res) => {
    const evaluations = db.prepare(`
      SELECT e.*, s.name as student_name 
      FROM evaluations e 
      JOIN students s ON e.student_id = s.id
      ORDER BY e.date DESC
    `).all();
    res.json(evaluations);
  });

  app.post("/api/evaluations", (req, res) => {
    const { student_id, passing, shooting, dribbling, vision, positioning, speed, endurance, comments } = req.body;
    const info = db.prepare(`
      INSERT INTO evaluations (student_id, passing, shooting, dribbling, vision, positioning, speed, endurance, comments) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(student_id, passing, shooting, dribbling, vision, positioning, speed, endurance, comments);
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/news", (req, res) => {
    const news = db.prepare("SELECT * FROM news ORDER BY date DESC").all();
    res.json(news);
  });

  app.post("/api/news", (req, res) => {
    const { title, description, image_url } = req.body;
    const info = db.prepare("INSERT INTO news (title, description, image_url) VALUES (?, ?, ?)").run(title, description, image_url);
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/equipment", (req, res) => {
    const equipment = db.prepare("SELECT * FROM equipment").all();
    res.json(equipment);
  });

  app.post("/api/equipment", (req, res) => {
    const { name, total_quantity } = req.body;
    const info = db.prepare("INSERT INTO equipment (name, total_quantity, available_quantity) VALUES (?, ?, ?)").run(name, total_quantity, total_quantity);
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/equipment/loans", (req, res) => {
    const loans = db.prepare(`
      SELECT l.*, e.name as equipment_name, s.name as student_name 
      FROM equipment_loans l 
      JOIN equipment e ON l.equipment_id = e.id
      JOIN students s ON l.student_id = s.id
      ORDER BY l.loan_date DESC
    `).all();
    res.json(loans);
  });

  app.post("/api/equipment/loans", (req, res) => {
    const { equipment_id, student_id, expected_return_date } = req.body;
    const info = db.prepare("INSERT INTO equipment_loans (equipment_id, student_id, expected_return_date) VALUES (?, ?, ?)").run(equipment_id, student_id, expected_return_date);
    // Update available quantity
    db.prepare("UPDATE equipment SET available_quantity = available_quantity - 1 WHERE id = ?").run(equipment_id);
    res.json({ id: info.lastInsertRowid });
  });

  app.post("/api/equipment/return/:id", (req, res) => {
    const { id } = req.params;
    const loan = db.prepare("SELECT equipment_id FROM equipment_loans WHERE id = ?").get();
    if (loan) {
      db.prepare("UPDATE equipment_loans SET actual_return_date = CURRENT_TIMESTAMP WHERE id = ?").run(id);
      db.prepare("UPDATE equipment SET available_quantity = available_quantity + 1 WHERE id = ?").run(loan.equipment_id);
    }
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
