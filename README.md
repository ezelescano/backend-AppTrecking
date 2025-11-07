# SocialApp - MVP Red Social

Una aplicación de red social moderna construida con React y arquitectura hexagonal, diseñada para escalabilidad y trabajo en equipo.

## 🏗️ Arquitectura

Este proyecto implementa **Arquitectura Hexagonal** (Ports & Adapters) organizando el código en capas bien definidas:

### Estructura de Carpetas Backend

```
src/
|
├── routes/
│   ├── auth.routes.ts
│   ├── posts.routes.ts
│   ├── comments.routes.ts
│   └── users.routes.ts
├── controllers/
│   ├── authController.ts
│   ├── postController.ts
│   └── commentController.ts
├── services/                # lógica que interactúa con Supabase
│   ├── authService.ts
│   ├── postService.ts
│   └── commentService.ts
├── middlewares/
│   └── authMiddleware.ts
│
├── interfaces/              # DTOs y tipos TypeScript
│   ├── IPost.ts
│   ├── IComment.ts
│   └── IAuthUser.ts
├── config/
│   ├── supabase.ts
│   └── envs.ts
|
|
└── index.ts                 # arranque del servidor (express)
```
### 🔐 Variables de entorno (ejemplo)

# Supabase
```.env
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # solo backend, no publicar
```
# App / Server
PORT=8080
NODE_ENV=development

# Seguridad / env extras
FRONTEND_URL=http://localhost:3000


### 🚩 Principales endpoints (REST)

- **Auth**:

- **POST /auth/register** — registrar usuario (email/password)

- Body: { email, password }

- Responses:

- 201 session present → { message, user, access_token }

- 201 session null → { message: "Check your email", user }

- **POST /auth/login** — login (email/password)

- Body: { email, password }

- Response 200: { message, user, access_token } + cookie HttpOnly refresh_token

- **POST /auth/logout** — logout (header Bearer or cookie)

- Header: Authorization: Bearer <token> or cookie refresh_token

- Response 200: { message }

- **GET** /auth/me — obtener usuario actual (header Bearer o cookie refresh)

- Response 200: { user, profile? }

### Users

- **GET /users/:id** — perfil público (user + profile)

- **PATCH /users/:id** — actualizar perfil (authenticated + owner)

### Posts

- **POST /posts** — crear post (authenticated)

- Body: { content, image_url?, place_id? }

- **GET /posts/me** — mis posts (authenticated)

- **GET /posts/:id** — obtener post + comentarios

- **GET /feed** — posts de los seguidos (authenticated) ?limit=&offset=

- **PUT/PATCH /posts/:id** — editar post (solo owner)

- **DELETE /posts/:id** — eliminar post (solo owner)

### Comments

- **POST /comments** — crear comentario { post_id, content } (authenticated)

- **GET /posts/:id/comments** — listar

- **DELETE /comments/:id** — borrar comentario (solo autor)

### Social

- **POST /follow/:id** — seguir usuario (authenticated)

- **DELETE /unfollow/:id** — dejar de seguir

- **GET /followers/:id** — listar seguidores

- **GET /following/:id** — listar seguidos



### 📐 DTOs / Interfaces (ejemplos)

-**IAuthUser**
```typescript
export interface IAuthUser {
  user: { id: string; email: string } | null;
  session: { access_token: string; refresh_token: string } | null;
}
```
- **IPost**

```typescript
export interface IPost {
  id: string;
  user_id: string;
  content: string;
  image_url?: string | null;
  place_id?: string | null;
  created_at?: string;
}
```

-**IComment**

```typescript
export interface IComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
}
```

### 🔁 Flujo de autenticación (resumen)
- Front envía POST /auth/login → recibe access_token (en JSON) y cookie refresh_token (HttpOnly).

- Para rutas protegidas front usa Authorization: Bearer <access_token> o confía en cookie + endpoint /auth/me//auth/refresh para renovar.

- Logout: POST /auth/logout que elimina cookie y llama signOut en Supabase.


### 🛡️ Seguridad y buenas prácticas

- No exponer SERVICE_ROLE_KEY en frontend. Solo backend.

- Cookies: HttpOnly, secure en producción, sameSite='lax' o 'strict' según UX.

- **RLS**: Habilitar Row Level Security y usar policies en tablas sensibles (posts, comments, Usuarios).

- **Policies recomendadas**:

- INSERT permitidos a auth.uid() = user_id (WITH CHECK).

- UPDATE/DELETE permitidos solo si auth.uid() = user_id.

- Rate limit en auth/login y POST /comments si fuera necesario.

- Validación de inputs con Zod/Joi (para DTOs).


### 🔧 Ejemplos de policies (Supabase SQL)

```sql
-- habilitar RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- permitir que un usuario inserte solo posts donde user_id = auth.uid()
CREATE POLICY "Insert own posts" ON public.posts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- permitir update/delete solo propios
CREATE POLICY "Modify own posts" ON public.posts
  FOR UPDATE, DELETE
  USING (auth.uid() = user_id);
```

### 💾 Ejemplo SQL: esquema posts y comments

```sql
create extension if not exists "pgcrypto"; -- para gen_random_uuid()

create table posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  image_url text,
  place_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);
```
### 📚 Controllers / Services — Convenciones

- **Controllers**: reciben req, validan (o usan middleware), llaman a services y devuelven res con status y payload. No lógica de negocio heavy.

- **Services**: orquestan llamadas a Supabase SDK y devuelven tipos (no manipulan res). Llenar con try/catch si quieres transformar errores; si no, propagar errores y controller decide status.

- **Middlewares**: verifyAuth (valida token, adjunta req.user), errorHandler global.


### 🧩 Ejemplos rápidos (código)

- Middleware de autenticación (resumen)

```typescript
// authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";

export const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  if (!accessToken) return res.status(401).json({ error: "Unauthorized" });

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) return res.status(401).json({ error: "Invalid token" });
  req.user = data.user;
  next();
};
```
### Crear post (controller → service)

```typescript
// postController.ts
export const createPost = async (req, res) => {
  try {
    const post = await postService.createPost(req.user.id, req.body);
    return res.status(201).json(post);
  } catch (err:any) {
    return res.status(err?.status ?? 400).json({ error: err?.message ?? "Failed" });
  }
}
```

### ⚙️ Cómo usarlo

- 📁 Asegurate de estar en la raíz de tu proyecto

- ```bash
  npm install
  ```
  - Esto va a instalar todas las dependencias automáticamente 🎉
