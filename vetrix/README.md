# Vetrix 🐾

Sistema de Gestión Veterinaria moderno y completo desarrollado con React y MySQL para el aprendizaje y práctica de tecnologías web.

![Vetrix Banner](https://img.shields.io/badge/Vetrix-Sistema%20de%20Gestión%20Veterinaria-blue?style=for-the-badge&logo=react)

## 📋 Descripción

Vetrix es un sistema integral de gestión para clínicas veterinarias que permite administrar pacientes (mascotas), propietarios, citas médicas, historiales clínicos, inventario y facturación de manera eficiente y moderna.

## ✨ Características Principales

### 🏠 Dashboard
- Panel de control con métricas importantes
- Vista general de citas próximas
- Alertas de stock bajo
- Estadísticas en tiempo real

### 🐕 Gestión de Pacientes
- Registro completo de mascotas
- Historial médico detallado
- Seguimiento de vacunaciones
- Búsqueda y filtros avanzados

### 👥 Gestión de Propietarios
- Base de datos de clientes
- Información de contacto
- Asociación con múltiples mascotas
- Historial de visitas

### 📅 Sistema de Citas
- Calendario interactivo
- Programación de citas
- Estados de citas (programada, completada, cancelada)
- Notificaciones y recordatorios

### 💊 Inventario
- Control de stock de medicamentos
- Alertas de stock bajo
- Categorización de productos
- Control de precios

### 💰 Facturación
- Generación de facturas
- Historial de pagos
- Reportes financieros
- Control de cobros

### 📊 Reportes y Estadísticas
- Reportes de ventas
- Estadísticas de pacientes
- Análisis de tendencias
- Exportación de datos

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18+** - Biblioteca principal de UI
- **React Router** - Navegación
- **React Hooks** - Gestión de estado
- **Tailwind CSS** - Estilos y diseño responsive
- **Lucide React** - Iconos modernos
- **React Query** - Gestión de datos del servidor
- **React Hook Form** - Manejo de formularios

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MySQL** - Base de datos relacional
- **Sequelize ORM** - Object-Relational Mapping
- **JWT** - Autenticación
- **Bcrypt** - Encriptación de contraseñas
- **Multer** - Manejo de archivos

### Herramientas de Desarrollo
- **Vite** - Bundler y dev server
- **ESLint** - Linting
- **Prettier** - Formateo de código
- **Jest** - Testing
- **Docker** - Contenedorización
- **GitHub Actions** - CI/CD

## 📁 Estructura del Proyecto

```
vetrix/
├── frontend/                   # Aplicación React
│   ├── public/
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/            # Páginas principales
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # APIs y servicios
│   │   ├── utils/            # Utilidades
│   │   ├── contexts/         # Contextos de React
│   │   └── styles/           # Estilos globales
│   ├── package.json
│   └── vite.config.js
├── backend/                   # API Node.js
│   ├── src/
│   │   ├── controllers/      # Controladores
│   │   ├── models/           # Modelos de base de datos
│   │   ├── routes/           # Rutas de la API
│   │   ├── middleware/       # Middlewares
│   │   ├── services/         # Lógica de negocio
│   │   └── utils/            # Utilidades del servidor
│   ├── package.json
│   └── server.js
├── database/                  # Scripts de base de datos
│   ├── migrations/           # Migraciones
│   ├── seeders/              # Datos de prueba
│   └── vetrix_schema.sql     # Esquema completo
├── docs/                      # Documentación
├── docker-compose.yml
├── .gitignore
├── README.md
└── LICENSE
```

## ⚡ Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- MySQL 8.0+
- Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/vetrix.git
cd vetrix
```

### 2. Configurar la base de datos
```bash
# Crear base de datos
mysql -u root -p
CREATE DATABASE vetrix;

# Importar esquema
mysql -u root -p vetrix < database/vetrix_schema.sql
```

### 3. Configurar variables de entorno
```bash
# Backend
cp backend/.env.example backend/.env
# Editar backend/.env con tus credenciales

# Frontend
cp frontend/.env.example frontend/.env
# Editar frontend/.env con la URL de la API
```

### 4. Instalar dependencias y ejecutar

#### Opción 1: Instalación manual
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (nueva terminal)
cd frontend
npm install
npm run dev
```

#### Opción 2: Con Docker
```bash
docker-compose up -d
```

## 🚀 Scripts Disponibles

### Frontend
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting
npm run format       # Formatear código
npm test             # Ejecutar tests
```

### Backend
```bash
npm run dev          # Servidor con nodemon
npm start            # Servidor de producción
npm run migrate      # Ejecutar migraciones
npm run seed         # Ejecutar seeders
npm test             # Ejecutar tests
npm run test:watch   # Tests en modo watch
```

## 📊 Base de Datos

### Modelo de Datos Principal

```sql
-- Propietarios de mascotas
owners (id, name, email, phone, address, created_at, updated_at)

-- Pacientes (mascotas)
patients (id, name, species, breed, age, gender, owner_id, created_at, updated_at)

-- Citas médicas
appointments (id, patient_id, appointment_date, appointment_time, reason, status, notes, created_at, updated_at)

-- Tratamientos médicos
treatments (id, patient_id, treatment_date, description, veterinarian, cost, created_at, updated_at)

-- Inventario de productos
inventory (id, product_name, category, stock, min_stock, price, supplier, created_at, updated_at)

-- Facturas
invoices (id, owner_id, invoice_date, total_amount, status, created_at, updated_at)

-- Usuarios del sistema
users (id, username, email, password_hash, role, created_at, updated_at)
```

## 🔧 Configuración

### Variables de Entorno

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=vetrix
DB_USER=root
DB_PASS=your_password
JWT_SECRET=your_jwt_secret
UPLOAD_PATH=./uploads
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Vetrix
VITE_APP_VERSION=1.0.0
```

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si quieres contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Guías de Contribución
- Sigue las convenciones de código existentes
- Escribe tests para nuevas funcionalidades
- Actualiza la documentación según sea necesario
- Usa conventional commits para los mensajes

## 📝 Roadmap

### v1.0.0 - MVP (Actual)
- ✅ Gestión básica de pacientes y propietarios
- ✅ Sistema de citas
- ✅ Dashboard con métricas
- ✅ Inventario básico

### v1.1.0 - Próximas funcionalidades
- [ ] Sistema de autenticación y roles
- [ ] Historial médico completo
- [ ] Generación de reportes PDF
- [ ] Sistema de notificaciones

### v1.2.0 - Funcionalidades avanzadas
- [ ] API REST completa
- [ ] Aplicación móvil (React Native)
- [ ] Integración con sistemas de pago
- [ ] Dashboard avanzado con gráficos

### v2.0.0 - Futuro
- [ ] Telemedicina veterinaria
- [ ] IA para diagnóstico asistido
- [ ] Multi-sucursal
- [ ] Integración con laboratorios

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto y Soporte

- **Proyecto:** [GitHub Repository](https://github.com/tu-usuario/vetrix)
- **Issues:** [GitHub Issues](https://github.com/tu-usuario/vetrix/issues)
- **Documentación:** [Wiki del Proyecto](https://github.com/tu-usuario/vetrix/wiki)

## 🙏 Agradecimientos

- Desarrollado con fines educativos para aprender React y MySQL
- Inspirado en las necesidades reales de clínicas veterinarias
- Gracias a la comunidad open source por las herramientas utilizadas

---

**Vetrix** - *Gestión veterinaria moderna y eficiente* 🐾