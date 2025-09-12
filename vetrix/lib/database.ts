import Database from "better-sqlite3"
import { join } from "path"

let db: Database.Database | null = null

export function getDatabase() {
  if (!db) {
    const dbPath = join(process.cwd(), "veterinary.db")
    db = new Database(dbPath)

    // Enable foreign keys
    db.pragma("foreign_keys = ON")
  }
  return db
}

export function closeDatabase() {
  if (db) {
    db.close()
    db = null
  }
}

export interface Species {
  id: number; // TINYINT UNSIGNED, PK
  name: string; // Nombre de la especie (perro, gato, etc.)
  scientificName?: string; // Nombre científico (nullable)
  averageLifespanYears?: number; // Esperanza de vida promedio (nullable)
  isActive: boolean; // Especie activa en el sistema
  createdAt: Date; // Fecha de creación
  updatedAt: Date; // Última actualización
}

export interface ProficiencyLevel {
  id: number; // TINYINT UNSIGNED, PK
  code: string; // Código del nivel (basic, intermediate, etc.)
  description: string; // Descripción del nivel de competencia
  weight: number; // Nivel de dominio (1=básico, 4=experto)
  isActive: boolean; // Nivel habilitado para uso
}

export interface SizeCategory {
  id: number; // TINYINT UNSIGNED, PK
  name: string; // Nombre de la categoría: toy, small, medium, large, giant
  description?: string; // Descripción general del tamaño (nullable)
  isActive: boolean; // Categoría activa
  createdAt: Date; // Fecha de creación
}

export interface Breed {
  id: number; // SMALLINT UNSIGNED, PK
  speciesId: number; // FK → cat_species.id
  name: string; // Nombre de la raza
  sizeCategoryId?: number; // FK → cat_size_categories.id (nullable)
  averageWeightMin?: number; // Peso mínimo promedio en kg
  averageWeightMax?: number; // Peso máximo promedio en kg
  isActive: boolean; // Raza activa
  createdAt: Date; // Fecha de creación
  updatedAt: Date; // Última actualización
}

export interface Color {
  id: number; // TINYINT UNSIGNED, PK
  name: string; // Nombre del color
  hexCode?: string; // Código hexadecimal (#RRGGBB)
  isActive: boolean; // Color activo
  createdAt: Date; // Fecha de creación
}

export interface Sex {
  id: number; // TINYINT UNSIGNED, PK
  name: string; // Nombre del sexo
  abbreviation: 'M' | 'F' | 'U'; // Abreviación validada (M/F/U)
  isActive: boolean; // Sexo activo
  createdAt: Date; // Fecha de creación
}

export interface Specialty {
  id: number; // TINYINT UNSIGNED, PK
  name: string; // Nombre de la especialidad
  description?: string; // Descripción de la especialidad
  requiresCertification: boolean; // Requiere certificación especial
  isActive: boolean; // Especialidad activa
  createdAt: Date; // Fecha de creación
  updatedAt: Date; // Última actualización
}

export interface AppointmentStatus {
  id: number; // TINYINT UNSIGNED, PK
  name: string; // Nombre del estado
  description?: string; // Descripción del estado
  colorCode?: string; // Color para UI (#RRGGBB)
  isActive: boolean; // Estado activo
  isFinalStatus: boolean; // Estado final (no permite cambios)
  allowsModification: boolean; // Permite modificar la cita
  sortOrder: number; // Orden de visualización
  createdAt: Date; // Fecha de creación
}

export interface PaymentStatus {
  id: number; // TINYINT UNSIGNED, PK
  name: string; // Nombre del estado de pago
  description?: string; // Descripción del estado
  colorCode?: string; // Color para UI (#RRGGBB)
  isFinal: boolean; // Estado final (no cambia más)
  isActive: boolean; // Estado activo
  allowsPayment: boolean; // Permite recibir pagos
  sortOrder: number; // Orden de visualización
  createdAt: Date; // Fecha de creación
}

export interface PaymentMethod {
  id: number; // TINYINT UNSIGNED, PK
  name: string; // Nombre del método de pago
  requiresReference: boolean; // Requiere número de referencia
  processingFeePercentage: number; // Comisión por procesamiento (0.000 – 100.000)
  isElectronic: boolean; // Es método electrónico
  isActive: boolean; // Método activo
  sortOrder: number; // Orden de visualización
  createdAt: Date; // Fecha de creación
}

export interface Role {
  id: number; // TINYINT UNSIGNED, PK
  name: string; // Nombre del rol
  description?: string; // Descripción del rol
  level: number; // Nivel de privilegios (1 = bajo, 10 = alto)
  isSystemRole: boolean; // Rol del sistema (no se puede eliminar)
  isActive: boolean; // Rol activo
  createdAt: Date; // Fecha de creación
  updatedAt: Date; // Última actualización
}

export interface Permission {
  id: number; // SMALLINT UNSIGNED, PK
  name: string; // Nombre del permiso
  resource: string; // Recurso al que aplica
  action: string; // Acción permitida
  description?: string; // Descripción del permiso
  isSystemPermission: boolean; // Permiso del sistema
  isActive: boolean; // Permiso activo
  createdAt: Date; // Fecha de creación
}

export interface RolePermission {
  roleId: number; // FK → cat_roles.id
  permissionId: number; // FK → cat_permissions.id
  grantedAt: Date; // Fecha de concesión
  grantedBy?: number; // Usuario que otorgó el permiso (nullable)
}

export interface UserStatus {
  id: number; // TINYINT UNSIGNED, PK
  name: string; // Nombre del estado
  description?: string; // Descripción del estado
  canLogin: boolean; // Permite iniciar sesión
  requiresApproval: boolean; // Requiere aprobación admin
  isActive: boolean; // Estado activo
  createdAt: Date; // Fecha de creación
}

export interface IdentificationType {
  id: number; // TINYINT UNSIGNED, PK
  code: string; // Código del tipo (CC, CE, TI, etc.)
  name: string; // Nombre descriptivo del tipo
  isActive: boolean; // Tipo habilitado
}

export interface Country {
  id: number; // INT UNSIGNED, PK
  iso2: string; // ISO 3166-1 alpha-2
  iso3: string; // ISO 3166-1 alpha-3
  name: string; // Nombre del país
  phoneCode?: string; // Código telefónico internacional
  currencyCode?: string; // Código de moneda ISO 4217
  isActive: boolean; // País activo
  createdAt: Date; // Fecha de creación
}

export interface State {
  id: number; // INT UNSIGNED, PK
  countryId: number; // FK → cat_countries.id
  code: string; // Código del estado
  name: string; // Nombre del estado
  isActive: boolean; // Estado activo
  createdAt: Date; // Fecha de creación
}

export interface City {
  id: number; // INT UNSIGNED, PK
  stateId: number; // FK → cat_states.id
  name: string; // Nombre de la ciudad
  postalCodePattern?: string; // Patrón de código postal
  isActive: boolean; // Ciudad activa
  createdAt: Date; // Fecha de creación
}

export interface EmploymentStatus {
  id: number; // TINYINT UNSIGNED, PK
  code: string; // Código del estado (active, inactive, etc.)
  description: string; // Descripción del estado laboral
  isActive: boolean; // Estado habilitado
}

export interface Owner {
  id: number; // INT UNSIGNED, PK
  firstName: string; // Nombre del propietario
  lastName: string; // Apellido del propietario
  phonePrimary?: string; // Teléfono principal
  phoneSecondary?: string; // Teléfono secundario
  email?: string; // Correo electrónico
  addressStreet?: string; // Dirección calle/número
  cityId?: number; // FK → cat_cities.id
  addressPostalCode?: string; // Código postal
  dateOfBirth?: Date; // Fecha de nacimiento
  identificationTypeId?: number; // FK → cat_identification_types.id
  identificationNumber?: string; // Número de identificación
  emergencyContactName?: string; // Contacto de emergencia
  emergencyContactPhone?: string; // Teléfono de emergencia
  emergencyContactRelationship?: string; // Relación contacto emergencia
  marketingConsent: boolean; // Acepta marketing
  dataProcessingConsent: boolean; // Acepta tratamiento de datos
  isActive: boolean; // Cliente activo
  creditLimit: number; // Límite de crédito
  notes?: string; // Notas adicionales
  createdAt: Date; // Fecha de creación
  updatedAt: Date; // Última actualización
}

export interface Veterinarian {
  id: number; // INT UNSIGNED, PK
  employeeNumber: string; // Número de empleado
  firstName: string; // Nombre
  lastName: string; // Apellido
  licenseNumber: string; // Número de licencia profesional
  licenseExpiryDate?: Date; // Fecha de vencimiento de licencia
  phone?: string; // Teléfono
  email?: string; // Correo electrónico

  yearsExperience?: number; // Años de experiencia
  education?: string; // Formación académica
  certifications?: Record<string, any>[]; // JSON con certificaciones
  specializationNotes?: string; // Notas sobre especializaciones

  hireDate: Date; // Fecha de contratación
  terminationDate?: Date; // Fecha de terminación
  employmentStatusId?: number; // FK → cat_employment_statuses.id
  salary?: number; // Salario base
  commissionRate: number; // Porcentaje de comisión

  maxDailyAppointments: number; // Máximo de citas por día
  appointmentDurationDefault: number; // Duración por defecto de citas (minutos)

  isActive: boolean; // Veterinario activo
  notes?: string; // Notas adicionales
  createdAt: Date; // Fecha de creación
  updatedAt: Date; // Última actualización
}

export interface VeterinarianSpecialty {
  veterinarianId: number; // FK → vet_veterinarians.id
  specialtyId: number; // FK → cat_specialties.id

  certificationDate?: Date; // Fecha de certificación
  certificationExpiryDate?: Date; // Fecha de vencimiento
  certificationBody?: string; // Entidad certificadora
  certificateNumber?: string; // Número de certificado

  isPrimary: boolean; // Especialidad principal
  proficiencyLevelId?: number; // FK → cat_proficiency_levels.id

  createdAt: Date; // Creación
  updatedAt: Date; // Última actualización
}

export interface Clinic {
  id: number; // BIGINT UNSIGNED AUTO_INCREMENT PK
  name: string; // Nombre de la clínica
  address?: string; // Dirección (opcional)
  cityId: number; // FK → cat_cities.id
  phone?: string; // Teléfono (opcional)
  email?: string; // Correo (opcional)
  isActive: boolean; // Clínica activa
  createdAt: Date; // Fecha de creación
}

export interface ClinicRoom {
  id: number; // BIGINT UNSIGNED AUTO_INCREMENT PK
  clinicId: number; // FK → cli_clinics.id
  name: string; // Nombre de la sala
  capacity: number; // Capacidad (>= 1)
  isActive: boolean; // Sala activa
}

export interface VeterinarianSchedule {
  id: number; // INT UNSIGNED AUTO_INCREMENT PK
  veterinarianId: number; // FK → vet_veterinarians.id
  roomId?: number; // FK → cli_rooms.id (nullable)
  dayOfWeek: number; // 1 = Lunes ... 7 = Domingo
  startTime: string; // Formato "HH:MM:SS"
  endTime: string; // Formato "HH:MM:SS"
  breakStartTime?: string; // Puede ser null
  breakEndTime?: string; // Puede ser null
  isActive: boolean; // Horario activo
  effectiveFrom: Date; // Fecha inicio de vigencia
  effectiveTo?: Date; // Fecha fin de vigencia (opcional)
  notes?: string; // Notas
  createdAt: Date;
  updatedAt: Date;
}

export interface SterilizationType {
  id: number; // TINYINT UNSIGNED AUTO_INCREMENT
  code: string; // Código interno
  description: string; // Descripción del tipo
  isActive: boolean; // Estado activo
  createdAt: Date;
}

export interface InsuranceProvider {
  id: number; // BIGINT UNSIGNED AUTO_INCREMENT
  name: string; // Nombre aseguradora
  contactInfo?: string; // Información de contacto (nullable)
  phone?: string; // Teléfono
  email?: string; // Correo electrónico
  website?: string; // Sitio web
  isActive: boolean;
  createdAt: Date;
}

export interface Pet {
  id: number; // INT UNSIGNED AUTO_INCREMENT
  petNumber: string; // Número único mascota
  ownerId: number; // FK → mas_owners.id
  name: string; // Nombre
  speciesId: number; // FK → cat_species.id
  breedId?: number; // FK → cat_breeds.id (nullable)
  sexId: number; // FK → cat_sexes.id
  primaryColorId?: number; // FK → cat_colors.id
  secondaryColorId?: number; // FK → cat_colors.id

  dateOfBirth?: Date;
  isBirthEstimated: boolean;

  microchipNumber?: string;
  microchipDate?: Date;
  microchipLocation?: string;
  tattooNumber?: string;

  isSterilized?: boolean;
  sterilizationDate?: Date;
  sterilizationTypeId?: number;

  registrationNumber?: string;

  isActive: boolean;
  dateOfDeath?: Date;
  causeOfDeath?: string;

  specialNeeds?: string;
  behavioralNotes?: string;
  dietaryRestrictions?: string;
  exerciseRequirements?: string;

  acquisitionDate?: Date;
  acquisitionSource?: string;
  previousOwnerInfo?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface PetColor {
  petId: number;   // BIGINT UNSIGNED → FK a pets.pet_id
  colorId: number; // BIGINT UNSIGNED → FK a colors.color_id
}

export interface PetColorRelation {
  petId: number;
  colorId: number;
  // Relaciones opcionales
  // pet?: Pet;
  // color?: Color;
}

export interface TimeoffStatus {
  id: number;        // TINYINT UNSIGNED AUTO_INCREMENT
  code: string;      // Código corto (ej: PENDING, APPROVED)
  description: string; 
  isFinal: boolean;  // Si es estado final
  isActive: boolean;
  createdAt: Date;
}

export interface VeterinarianTimeOff {
  id: number;               // BIGINT UNSIGNED AUTO_INCREMENT
  veterinarianId: number;   // FK → vet_veterinarians.id
  startDate: string;        // DATE (ISO format yyyy-mm-dd)
  endDate: string;          // DATE
  reason?: string;          // Motivo opcional
  statusId: number;         // FK → cat_timeoff_statuses.id
  requestedAt: Date;        // TIMESTAMP
}

export interface VeterinarianTimeOffWithRelations extends VeterinarianTimeOff {
  status?: TimeoffStatus;          // Estado del tiempo libre
  veterinarian?: Veterinarian;     // Información del veterinario
}

export interface AppointmentReminder {
  reminderId: number;       // BIGINT UNSIGNED AUTO_INCREMENT
  appointmentId: number;    // FK → cit_appointments.id
  scheduledAt: Date;        // DATETIME
  sentAt?: Date | null;     // DATETIME NULL
  methodId: number;         // FK → cat_reminder_methods.id
  statusId: number;         // FK → cat_reminder_statuses.id
  retryCount: number;       // TINYINT UNSIGNED DEFAULT 0
  lastAttemptAt?: Date | null; // DATETIME NULL
  errorMessage?: string | null; // TEXT NULL
}

export interface ReminderMethod {
  id: number;            // TINYINT UNSIGNED AUTO_INCREMENT
  code: string;          // VARCHAR(20) UNIQUE
  description: string;   // VARCHAR(100)
  isActive: boolean;     // BOOLEAN
  createdAt: Date;       // TIMESTAMP
}

export interface ReminderStatus {
  id: number;            // TINYINT UNSIGNED AUTO_INCREMENT
  code: string;          // VARCHAR(20) UNIQUE
  description: string;   // VARCHAR(100)
  isFinal: boolean;      // BOOLEAN
  isActive: boolean;     // BOOLEAN
  createdAt: Date;       // TIMESTAMP
}

export interface Appointment {
  id: number;                      // INT UNSIGNED AUTO_INCREMENT
  appointmentNumber: string;       // VARCHAR(20) UNIQUE
  petId: number;                   // FK → mas_pets.id
  ownerId: number;                 // FK → mas_owners.id
  veterinarianId?: number | null;  // FK → vet_veterinarians.id

  // Programación
  appointmentDatetime: Date;       // DATETIME
  appointmentDate: string;         // DATE (derivado, ISO format YYYY-MM-DD)
  durationMinutes: number;         // SMALLINT UNSIGNED
  statusId: number;                // FK → cat_appointment_statuses.id
  typeId: number;                  // FK → cat_appointment_types.id
  priorityId: number;              // FK → cat_appointment_priorities.id

  // Motivo
  reason: string;                  // VARCHAR(500)
  isFollowUp: boolean;             // BOOLEAN
  parentAppointmentId?: number | null; // FK self-reference

  // Llegada
  petConditionOnArrival?: string | null; // TEXT
  checkInTime?: Date | null;        // DATETIME
  actualStartTime?: Date | null;    // DATETIME
  actualEndTime?: Date | null;      // DATETIME
  waitingTimeMinutes?: number | null; // SMALLINT

  // Recordatorios
  reminderSent: boolean;            // BOOLEAN
  reminderSentAt?: Date | null;     // TIMESTAMP
  confirmationRequired: boolean;    // BOOLEAN
  isConfirmed: boolean;             // BOOLEAN
  confirmedAt?: Date | null;        // TIMESTAMP

  // Seguimiento
  followUpRequired: boolean;        // BOOLEAN
  followUpDate?: string | null;     // DATE
  followUpReason?: string | null;   // VARCHAR(300)

  // Costos
  estimatedCost?: number | null;    // DECIMAL(10,2)
  actualCost?: number | null;       // DECIMAL(10,2)

  // Cancelaciones
  cancellationReason?: string | null; // TEXT
  cancelledAt?: Date | null;        // TIMESTAMP
  cancelledBy?: number | null;      // Usuario que canceló
  rescheduledFromId?: number | null; // FK self-reference

  // Notas
  notes?: string | null;            // TEXT
  internalNotes?: string | null;    // TEXT

  // Auditoría
  createdAt: Date;                  // TIMESTAMP
  updatedAt: Date;                  // TIMESTAMP
}

export interface AppointmentReminderWithRelations extends AppointmentReminder {
  method?: ReminderMethod;
  status?: ReminderStatus;
  appointment?: Appointment;
}

export interface AppointmentType {
  id: number;           // TINYINT UNSIGNED
  name: string;         // VARCHAR(50)
  description?: string | null; // VARCHAR(255) NULL
  isActive: boolean;    // BOOLEAN
  createdAt: Date;      // TIMESTAMP
}

export interface AppointmentPriority {
  id: number;           // TINYINT UNSIGNED
  name: string;         // VARCHAR(50)
  level: number;        // TINYINT UNSIGNED (1=baja, 4=emergencia)
  isActive: boolean;    // BOOLEAN
  createdAt: Date;      // TIMESTAMP
}

export interface MedicalRecord {
  id: number;                   // INT UNSIGNED
  recordNumber: string;         // VARCHAR(20)
  petId: number;                // FK → mas_pets.id
  appointmentId?: number | null;// FK → cit_appointments.id
  veterinarianId: number;       // FK → vet_veterinarians.id
  visitDatetime: Date;          // DATETIME
  recordTypeId: number;         // FK → cat_record_types.id

  // Información médica
  chiefComplaint: string;       // TEXT
  historyPresentIllness?: string | null; // TEXT

  prognosisId?: number | null;  // FK → cat_prognosis.id
  prognosisNotes?: string | null; // TEXT

  // Próximas visitas
  nextVisitDate?: string | null;  // DATE
  nextVisitReason?: string | null;// VARCHAR(300)

  // Cargos y notas
  totalCharges?: number | null;   // DECIMAL(10,2)
  veterinarianNotes?: string | null; // TEXT

  // Auditoría
  createdAt: Date;               // TIMESTAMP
  updatedAt: Date;               // TIMESTAMP
}

export interface RecordType {
  id: number;      // TINYINT UNSIGNED
  name: string;    // VARCHAR(50)
}

export interface MedicalRecordWithRelations extends MedicalRecord {
  recordType?: RecordType;
  appointment?: Appointment;       // de cit_appointments
  pet?: Pet;                       // de mas_pets
  veterinarian?: Veterinarian;     // de vet_veterinarians
}

export interface Prognosis {
  id: number;     // TINYINT UNSIGNED
  name: string;   // VARCHAR(50) - Ej: Excelente, Bueno, Grave...
}

export interface ExamSystem {
  id: number;            // TINYINT UNSIGNED
  name: string;          // VARCHAR(100)
  description?: string | null; // TEXT NULL
  isActive: boolean;     // BOOLEAN
}

export interface ExamFinding {
  id: number;              // BIGINT UNSIGNED
  medicalRecordId: number; // FK → mas_medical_records.id
  systemId: number;        // FK → cat_exam_systems.id
  findings: string;        // TEXT - hallazgos clínicos

  createdAt: Date;         // TIMESTAMP
}

export interface ExamFindingWithRelations extends ExamFinding {
  medicalRecord?: MedicalRecord;
  system?: ExamSystem;
}

export interface VitalSigns {
  id: number;              // BIGINT UNSIGNED
  medicalRecordId: number; // FK → mas_medical_records.id

  temperature?: number | null;          // DECIMAL(4,1) °C
  weight?: number | null;               // DECIMAL(6,2) kg
  heartRate?: number | null;            // SMALLINT UNSIGNED
  respiratoryRate?: number | null;      // SMALLINT UNSIGNED
  bloodPressureSystolic?: number | null;// SMALLINT UNSIGNED
  bloodPressureDiastolic?: number | null;// SMALLINT UNSIGNED
  bodyConditionScore?: number | null;   // TINYINT UNSIGNED (1–9)

  createdAt: Date;         // TIMESTAMP
}

// fac_invoice_items.interface.ts

export interface InvoiceItem {
  id: number; // Identificador único
  invoiceId: number;
  lineNumber: number;

  // Información del ítem
  itemCode?: string | null;
  catalogItemId?: number | null;
  itemTypeId: number;
  description: string;

  // Cantidades y precios
  quantity: number;
  unitPrice: number;

  // Descuentos
  discountTypeId?: number | null;
  lineDiscountPercentage: number; // 0 - 100
  lineDiscountAmount: number;

  // Subtotal (calculado en DB, opcional en el modelo)
  lineSubtotal?: number;

  // Facturación y seguros
  isBillable: boolean;
  isCoveredByInsurance: boolean;
  insuranceClaimAmount?: number | null;

  // Información del servicio
  serviceDate?: string | null; // YYYY-MM-DD
  veterinarianId?: number | null;
  medicalRecordId?: number | null;

  // Inventario
  batchNumber?: string | null;
  expirationDate?: string | null; // YYYY-MM-DD
  serialNumber?: string | null;

  // Notas
  notes?: string | null;
  internalNotes?: string | null;

  // Auditoría
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  createdBy?: number | null;
  updatedBy?: number | null;
}

// fac_invoice_item_taxes.interface.ts
export interface InvoiceItemTax {
  id: number; // Identificador único
  invoiceItemId: number; // FK a InvoiceItem
  taxName: string; // IVA, Retefuente, etc.
  taxRate: number; // %
  taxAmount: number; // Valor calculado
}

// fac_invoice_item_discounts.interface.ts
export interface InvoiceItemDiscount {
  id: number; // Identificador único
  invoiceItemId: number; // FK a InvoiceItem
  discountTypeId: number; // FK a cat_discount_types
  discountValue: number; // Monto fijo o %
  source?: string | null; // Origen del descuento (cupón, promo, etc.)
}

// fac_invoices.interface.ts
export interface Invoice {
  id: number;
  invoiceNumber: string;

  // Relaciones
  ownerId: number;
  petId: number;
  appointmentId?: number | null;
  medicalRecordId?: number | null;

  // Fechas
  invoiceDate: string; // YYYY-MM-DD
  serviceDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD

  // Totales
  subtotal: number;
  totalAmount: number;
  balanceDue: number;

  // Estado y moneda
  statusId: number; // FK a cat_invoice_statuses
  currencyCode: string; // ISO-4217 (COP, USD, etc.)
  exchangeRate: number;

  // Veterinario
  attendingVeterinarianId?: number | null;

  // Notas
  notes?: string | null;
  internalNotes?: string | null;

  // Auditoría
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

// fac_invoice_discounts.interface.ts
export interface InvoiceDiscount {
  id: number;
  invoiceId: number;
  itemId?: number | null; // null = descuento global
  description: string;
  discountType: 'percentage' | 'amount';
  value: number;
  createdAt: string; // ISO datetime
}

// fac_invoice_taxes.interface.ts
export interface InvoiceTax {
  id: number;
  invoiceId: number;
  itemId?: number | null; // null = impuesto global
  taxName: string;
  taxRate: number; // Ej: 0.19 = 19%
  taxAmount: number;
  createdAt: string; // ISO datetime
}

// fac_payments.interface.ts
export interface Payment {
  id: number;
  paymentNumber: string;
  invoiceId: number;
  amount: number;
  currencyCode: string;
  exchangeRate: number;
  amountInBaseCurrency: number;

  // Método y referencia
  paymentMethodId: number;
  referenceNumber?: string | null;
  bankName?: string | null;
  accountLastDigits?: string | null;

  // Fechas
  paymentDate: string; // YYYY-MM-DD
  transactionDate?: string | null; // ISO datetime
  processingDate?: string | null; // YYYY-MM-DD

  // Estado
  paymentStatus: 'pending' | 'confirmed' | 'rejected' | 'reversed' | 'cancelled';
  isPartialPayment: boolean;
  remainingBalance?: number | null;

  // Comisiones
  processingFee: number;
  netAmount?: number | null;

  // Control administrativo
  processedBy?: number | null;
  approvedBy?: number | null;
  receiptNumber?: string | null;

  // Devoluciones
  isRefund: boolean;
  originalPaymentId?: number | null;
  refundReason?: string | null;

  // Auditoría
  notes?: string | null;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

// cat_invoice_statuses.interface.ts
export interface InvoiceStatus {
  id: number;
  code: string; // DRAFT, ISSUED, PAID, PARTIAL, CANCELLED
  name: string;
  isFinal: boolean;
  createdAt: string; // ISO datetime
}

// cat_currencies.interface.ts
export interface Currency {
  code: string; // ISO 4217
  name: string;
  symbol: string;
  decimals: number;
  isActive: boolean;
}

// usr_users.interface.ts
export interface User {
  id: number;
  username: string;
  email: string;
  passwordHash: string;

  // Roles y permisos
  roleId: number;
  statusId: number;
  veterinarianId?: number | null;

  // Control de sesiones
  lastLogin?: string | null; // ISO datetime
  lastLoginIp?: string | null;
  currentSessionId?: string | null;
  failedLoginAttempts: number;
  lockedUntil?: string | null; // ISO datetime

  // Seguridad de contraseñas
  passwordChangedAt: string; // ISO datetime
  passwordExpiresAt?: string | null;
  mustChangePassword: boolean;
  passwordHistory?: string[] | null; // JSON array de hashes

  // Autenticación de dos factores
  twoFactorEnabled: boolean;
  twoFactorSecret?: string | null;
  backupCodes?: string[] | null; // JSON array de códigos
  twoFactorVerifiedAt?: string | null; // ISO datetime

  // Configuración de sesión
  sessionTimeoutMinutes: number;
  timezone: string;
  preferredLanguage: string; // 'es', 'en', etc.

  // Configuración de notificaciones
  emailNotifications: boolean;
  smsNotifications: boolean;
  notificationPreferences?: Record<string, any> | null; // JSON flexible

  // Información de activación
  isEmailVerified: boolean;
  emailVerificationToken?: string | null;
  emailVerifiedAt?: string | null; // ISO datetime

  // API y tokens
  apiAccessEnabled: boolean;
  apiKeyHash?: string | null;
  apiLastUsed?: string | null; // ISO datetime

  // Auditoría
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

// usr_user_profiles.interface.ts
export interface UserProfile {
  userId: number; // FK → usr_users.id

  // Información personal
  firstName: string;
  lastName: string;
  phone?: string | null;
  address?: string | null;
  dateOfBirth?: string | null; // formato YYYY-MM-DD
  profilePictureUrl?: string | null;
  bio?: string | null;

  // Preferencias de idioma y zona horaria
  preferredLanguage: string; // 'es', 'en', etc.
  timezone: string;

  // Notificaciones
  notificationPreferences?: Record<string, any> | null;

  // Auditoría
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

// usr_user_roles.interface.ts
export interface UserRole {
  userId: number; // FK → usr_users.id
  roleId: number; // FK → cat_roles.id
}

// usr_user_activity_log.interface.ts
export type ActivitySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface UserActivityLog {
  id: number;
  userId: number; // FK → usr_users.id
  action: string;
  resourceType: string;
  resourceId?: number | null;

  // Auditoría de cambios
  oldValues?: Record<string, any> | null;
  newValues?: Record<string, any> | null;

  // Información de sesión
  ipAddress?: string | null;
  userAgent?: string | null;
  sessionId?: string | null;

  // Clasificación
  severity: ActivitySeverity;

  // Auditoría
  createdAt: string; // ISO datetime
}