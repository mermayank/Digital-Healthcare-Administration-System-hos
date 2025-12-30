-- SQL schema generated from Prisma schema.prisma
-- Database: SQLite

-- Enums
CREATE TABLE Role (
  value TEXT PRIMARY KEY
);

INSERT INTO Role (value) VALUES 
('ADMIN'),
('DOCTOR'),
('PATIENT'),
('NURSE'),
('RECEPTIONIST'),
('LAB_STAFF');

CREATE TABLE AppointmentStatus (
  value TEXT PRIMARY KEY
);

INSERT INTO AppointmentStatus (value) VALUES 
('PENDING'),
('CONFIRMED'),
('CANCELLED'),
('COMPLETED'),
('RESCHEDULED');

CREATE TABLE PaymentStatus (
  value TEXT PRIMARY KEY
);

INSERT INTO PaymentStatus (value) VALUES 
('PENDING'),
('COMPLETED'),
('FAILED'),
('REFUNDED');

-- Tables
CREATE TABLE User (
  id TEXT PRIMARY KEY DEFAULT (substr(replace(hex(randomblob(16)), '-', ''), 1, 25)),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL REFERENCES Role(value),
  phone TEXT,
  address TEXT,
  dateOfBirth DATETIME,
  gender TEXT,
  image TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Department (
  id TEXT PRIMARY KEY DEFAULT (substr(replace(hex(randomblob(16)), '-', ''), 1, 25)),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  head TEXT,
  location TEXT,
  phone TEXT,
  isActive BOOLEAN DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Doctor (
  id TEXT PRIMARY KEY DEFAULT (substr(replace(hex(randomblob(16)), '-', ''), 1, 25)),
  userId TEXT UNIQUE NOT NULL REFERENCES User(id) ON DELETE CASCADE,
  specialization TEXT NOT NULL,
  license TEXT UNIQUE NOT NULL,
  experience INTEGER NOT NULL,
  education TEXT NOT NULL,
  bio TEXT,
  consultationFee REAL NOT NULL,
  rating REAL DEFAULT 0,
  departmentId TEXT REFERENCES Department(id),
  isActive BOOLEAN DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Patient (
  id TEXT PRIMARY KEY DEFAULT (substr(replace(hex(randomblob(16)), '-', ''), 1, 25)),
  userId TEXT UNIQUE NOT NULL REFERENCES User(id) ON DELETE CASCADE,
  bloodGroup TEXT,
  allergies TEXT,
  medicalHistory TEXT,
  emergencyContact TEXT,
  insurance TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Staff (
  id TEXT PRIMARY KEY DEFAULT (substr(replace(hex(randomblob(16)), '-', ''), 1, 25)),
  userId TEXT UNIQUE NOT NULL REFERENCES User(id) ON DELETE CASCADE,
  position TEXT NOT NULL,
  department TEXT,
  salary REAL,
  joinDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  isActive BOOLEAN DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Service (
  id TEXT PRIMARY KEY DEFAULT (substr(replace(hex(randomblob(16)), '-', ''), 1, 25)),
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  departmentId TEXT REFERENCES Department(id),
  isActive BOOLEAN DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE DoctorSession (
  id TEXT PRIMARY KEY DEFAULT (substr(replace(hex(randomblob(16)), '-', ''), 1, 25)),
  doctorId TEXT NOT NULL REFERENCES Doctor(id) ON DELETE CASCADE,
  date DATETIME NOT NULL,
  startTime TEXT NOT NULL,
  endTime TEXT NOT NULL,
  maxPatients INTEGER DEFAULT 10,
  isActive BOOLEAN DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE DoctorAvailability (
  id TEXT PRIMARY KEY DEFAULT (substr(replace(hex(randomblob(16)), '-', ''), 1, 25)),
  doctorId TEXT NOT NULL REFERENCES Doctor(id) ON DELETE CASCADE,
  dayOfWeek INTEGER NOT NULL, -- 0 = Sunday, 6 = Saturday
  startTime TEXT NOT NULL,
  endTime TEXT NOT NULL,
  isAvailable BOOLEAN DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Appointment (
  id TEXT PRIMARY KEY DEFAULT (substr(replace(hex(randomblob(16)), '-', ''), 1, 25)),
  patientId TEXT NOT NULL REFERENCES Patient(id),
  doctorId TEXT NOT NULL REFERENCES Doctor(id),
  sessionId TEXT REFERENCES DoctorSession(id),
  serviceId TEXT REFERENCES Service(id),
  date DATETIME NOT NULL,
  time TEXT NOT NULL,
  status TEXT NOT NULL REFERENCES AppointmentStatus(value) DEFAULT 'PENDING',
  reason TEXT,
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Payment (
  id TEXT PRIMARY KEY DEFAULT (substr(replace(hex(randomblob(16)), '-', ''), 1, 25)),
  appointmentId TEXT UNIQUE NOT NULL REFERENCES Appointment(id),
  patientId TEXT NOT NULL REFERENCES Patient(id),
  amount REAL NOT NULL,
  status TEXT NOT NULL REFERENCES PaymentStatus(value) DEFAULT 'PENDING',
  paymentMethod TEXT,
  transactionId TEXT,
  paidAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Prescription (
  id TEXT PRIMARY KEY DEFAULT (substr(replace(hex(randomblob(16)), '-', ''), 1, 25)),
  patientId TEXT NOT NULL REFERENCES Patient(id),
  doctorId TEXT NOT NULL REFERENCES Doctor(id),
  medications TEXT NOT NULL, -- JSON array of medications
  dosage TEXT,
  instructions TEXT,
  validUntil DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE MedicalReport (
  id TEXT PRIMARY KEY DEFAULT (substr(replace(hex(randomblob(16)), '-', ''), 1, 25)),
  patientId TEXT NOT NULL REFERENCES Patient(id),
  doctorId TEXT NOT NULL REFERENCES Doctor(id),
  title TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  treatment TEXT,
  notes TEXT,
  attachments TEXT, -- JSON array of file URLs
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Review (
  id TEXT PRIMARY KEY DEFAULT (substr(replace(hex(randomblob(16)), '-', ''), 1, 25)),
  patientId TEXT NOT NULL REFERENCES Patient(id),
  doctorId TEXT NOT NULL REFERENCES Doctor(id),
  rating INTEGER NOT NULL, -- 1-5
  comment TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Message (
  id TEXT PRIMARY KEY DEFAULT (substr(replace(hex(randomblob(16)), '-', ''), 1, 25)),
  senderId TEXT NOT NULL REFERENCES User(id),
  recipientId TEXT, -- null for announcements
  subject TEXT,
  content TEXT NOT NULL,
  isRead BOOLEAN DEFAULT 0,
  isAnnouncement BOOLEAN DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Chat (
  id TEXT PRIMARY KEY DEFAULT (substr(replace(hex(randomblob(16)), '-', ''), 1, 25)),
  patientId TEXT NOT NULL REFERENCES Patient(id),
  doctorId TEXT REFERENCES Doctor(id),
  messages TEXT NOT NULL, -- JSON array of messages
  lastMessage DATETIME DEFAULT CURRENT_TIMESTAMP,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE HealthCard (
  id TEXT PRIMARY KEY DEFAULT (substr(replace(hex(randomblob(16)), '-', ''), 1, 25)),
  patientId TEXT UNIQUE NOT NULL REFERENCES Patient(id),
  cardNumber TEXT UNIQUE NOT NULL,
  cardType TEXT NOT NULL, -- e.g., "Ayushman", "Insurance", "Government"
  provider TEXT NOT NULL, -- e.g., "Government of India", "Private Insurer"
  discount REAL DEFAULT 0, -- Discount percentage (e.g., 20 for 20%)
  validFrom DATETIME NOT NULL,
  validUntil DATETIME NOT NULL,
  isActive BOOLEAN DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Notification (
  id TEXT PRIMARY KEY DEFAULT (substr(replace(hex(randomblob(16)), '-', ''), 1, 25)),
  userId TEXT NOT NULL REFERENCES User(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- APPOINTMENT, PAYMENT, MESSAGE, etc.
  isRead BOOLEAN DEFAULT 0,
  link TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_user_email ON User(email);
CREATE INDEX idx_doctor_userId ON Doctor(userId);
CREATE INDEX idx_patient_userId ON Patient(userId);
CREATE INDEX idx_staff_userId ON Staff(userId);
CREATE INDEX idx_appointment_patientId ON Appointment(patientId);
CREATE INDEX idx_appointment_doctorId ON Appointment(doctorId);
CREATE INDEX idx_appointment_date ON Appointment(date);
CREATE INDEX idx_payment_appointmentId ON Payment(appointmentId);
CREATE INDEX idx_prescription_patientId ON Prescription(patientId);
CREATE INDEX idx_prescription_doctorId ON Prescription(doctorId);
CREATE INDEX idx_medical_report_patientId ON MedicalReport(patientId);
CREATE INDEX idx_review_patientId ON Review(patientId);
CREATE INDEX idx_review_doctorId ON Review(doctorId);
CREATE INDEX idx_message_senderId ON Message(senderId);
CREATE INDEX idx_message_recipientId ON Message(recipientId);
CREATE INDEX idx_chat_patientId ON Chat(patientId);
CREATE INDEX idx_health_card_patientId ON HealthCard(patientId);
CREATE INDEX idx_notification_userId ON Notification(userId);