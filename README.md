<br>

<div align="center">

<sub>A PERSONAL READING ROOM THAT CAN BECOME YOURS</sub>

# Brooke's Reading Room

_A bookshelf as a room, a memory system, and a small beginning for a social reading product._

<br>

**[Enter the Reading Room](https://brookell.github.io/brooke-bookshelf/)**

<br>

[English](#english) &nbsp;&nbsp;·&nbsp;&nbsp; [中文](#中文)

</div>

<br>

---

<a id="english"></a>

## English

> A shelf is never only storage. It is a portrait made of returns.

### 01 / What This Is

Brooke's Reading Room began as a personal interactive bookshelf: a collection of
books that stayed with me through questions of memory, gender, body, language,
belonging, and the strange afterlife of reading.

It is now becoming something more product-like: a two-space reading experience.

| Space | Meaning |
| :--- | :--- |
| **Brooke's Space** | A curated public room, shown first as an example and atmosphere. |
| **Your Space** | A personal room where each user can save books, choose reading states, rename the room, and slowly build a shelf of their own. |

The intention is not to make a generic book tracker with a prettier skin. The
project asks a slightly different question: what if a reading product felt less
like a database and more like entering a room that remembers what you chose?

### 02 / Current Features

- Interactive bookshelf with spine hover, cover expansion, keyboard navigation, and book detail pages.
- A dedicated personal space separate from Brooke's public room.
- Personal shelf states: **Want / Reading / Finished**.
- List view and room view for the user's own shelf.
- Smooth transitions between Brooke's Space and Your Space.
- Search and add books through Google Books.
- WeRead import flow through a Supabase Edge Function.
- Supabase-backed user data for authenticated users.
- Local fallback for early exploration when auth is not configured or the user chooses to try first.

### 03 / Product Thinking

Most reading apps treat books as units in a system: rows, counts, progress,
metadata, completion. That is useful, but it often loses the emotional surface
of reading.

This project keeps the useful parts, but starts from another metaphor:

| Product Layer | Design Question |
| :--- | :--- |
| **Room** | Can a user's library feel like a place rather than a dashboard? |
| **Shelf** | Can saved books carry visual presence before they become data points? |
| **Status** | Can tracking stay quiet, direct, and low-friction? |
| **Import** | Can existing reading histories become raw material for a personal room? |
| **Identity** | Can Brooke's public room work as a sample, then gracefully step aside for the user's own space? |

The long-term direction is a reading room that feels intimate first and
functional second, but still has enough structure to become a real product.

### 04 / Tech Stack

| Layer | Tooling |
| :--- | :--- |
| Frontend | Vanilla HTML, CSS, JavaScript |
| Book Catalog | TSV-driven local catalog plus user-added books |
| Search | Google Books API |
| Backend | Supabase Auth, Postgres, Row Level Security |
| Functions | Supabase Edge Function for WeRead sync |
| Persistence | Supabase for signed-in users, localStorage as fallback |

### 05 / Supabase Model

The backend is intentionally small and strict.

| Table | Purpose |
| :--- | :--- |
| `public.user_books` | Stores each user's saved books, source, metadata, and reading status. |
| `public.user_settings` | Stores room name and whether the user prefers entering their own room first. |

Row Level Security is enabled on both tables. Policies limit each user to their
own rows through `auth.uid() = user_id`.

### 06 / Local Setup

Create a local config file:

```js
// config.local.js
window.BROOKE_SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co";
window.BROOKE_SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY";
window.BROOKE_GOOGLE_BOOKS_API_KEY = "YOUR_GOOGLE_BOOKS_API_KEY";
window.BROOKE_SUPABASE_FUNCTIONS_URL = "https://YOUR_PROJECT_REF.supabase.co/functions/v1";
```

Then serve the project locally:

```bash
python3 -m http.server 5173
```

Open:

```text
http://127.0.0.1:5173/
```

`config.local.js` is intentionally ignored by Git. Do not commit private API
keys or Supabase service role secrets.

### 07 / Supabase Setup

Apply the schema:

```bash
supabase db query --linked --project-ref YOUR_PROJECT_REF --file supabase/schema.sql
```

Deploy the WeRead sync function:

```bash
supabase functions deploy sync-weread-shelf --project-ref YOUR_PROJECT_REF --no-verify-jwt --use-api
```

For more detail, see [`SUPABASE_WEREAD_SETUP.md`](SUPABASE_WEREAD_SETUP.md).

<br>

<div align="center">

Designed and built by **Brooke / LIAO YUXIN**

[Open the room](https://brookell.github.io/brooke-bookshelf/) &nbsp;·&nbsp;
[Maintenance](MAINTENANCE.md) &nbsp;·&nbsp;
[Product plan](PRODUCT_UPGRADE_PLAN.md)

[Back to top](#brookes-reading-room)

</div>

<br>

---

<a id="中文"></a>

## 中文

> 书架从来不只是收纳。它是由一次次回望组成的自画像。

### 01 / 这是什么

Brooke's Reading Room 最初是一座个人互动书架：它收藏了一些持续影响我的书，
也收藏了我关于记忆、性别、身体、语言、归属感，以及阅读如何在最后一页之后继续
留在生活里的思考。

现在，它正在变成一个更像真实产品的阅读空间：它有两个清晰的空间。

| 空间 | 含义 |
| :--- | :--- |
| **Brooke 的空间** | 一个公开的策展式阅读房间，作为范例、气质和入口。 |
| **我的空间** | 每个用户自己的阅读房间，可以保存书籍、选择阅读状态、修改房间名，并慢慢搭建自己的书架。 |

它不是想把普通书籍管理工具换一个漂亮外壳，而是在问一个更细的问题：如果一个阅读
产品不像表格，而像进入一间会记住你选择的房间，它会是什么样？

### 02 / 当前功能

- 互动书架：悬停书脊、展开封面、键盘左右切换、打开书籍详情。
- Brooke 公共空间与用户个人空间分离。
- 个人书架状态：**想读 / 在读 / 读完**。
- 用户书架支持列表视图和房间视图。
- Brooke 空间与我的空间之间有更顺滑的切换动效。
- 通过 Google Books 搜索并新增书籍。
- 通过 Supabase Edge Function 接入微信读书导入流程。
- 登录用户的数据保存到 Supabase。
- 未登录或未配置后端时，仍然可以用本地模式体验。

### 03 / 产品思考

很多阅读软件会把书变成系统里的单位：行、数量、进度、元数据、完成状态。这些当然
有用，但它们经常丢失阅读本身的情绪表面。

这个项目保留“记录”的功能，但从另一个隐喻出发：

| 产品层 | 设计问题 |
| :--- | :--- |
| **房间** | 用户的书架能不能首先像一个可以进入的地方，而不是一个仪表盘？ |
| **书脊** | 一本被保存的书，能不能先拥有视觉存在，而不只是成为一条记录？ |
| **状态** | 记录想读、在读、读完，能不能安静、直接、不打扰？ |
| **导入** | 用户已有的阅读历史，能不能变成搭建个人房间的材料？ |
| **身份** | Brooke 的空间能不能先作为范例出现，再自然地让位给用户自己的空间？ |

长期来看，我希望它既有私人阅读房间的亲密感，也有真实产品所需要的结构和可靠性。

### 04 / 技术结构

| 层级 | 使用内容 |
| :--- | :--- |
| 前端 | 原生 HTML、CSS、JavaScript |
| 书籍目录 | 本地 TSV 书单 + 用户新增书籍 |
| 搜索 | Google Books API |
| 后端 | Supabase Auth、Postgres、Row Level Security |
| 云函数 | Supabase Edge Function，用于微信读书同步 |
| 数据保存 | 登录后保存到 Supabase，未登录时使用 localStorage 兜底 |

### 05 / Supabase 数据模型

后端刻意保持小而清晰。

| 表 | 用途 |
| :--- | :--- |
| `public.user_books` | 保存每个用户的书籍、来源、元数据和阅读状态。 |
| `public.user_settings` | 保存房间名，以及是否优先进入自己的房间。 |

两张表都开启了 Row Level Security，并通过 `auth.uid() = user_id` 确保每个用户
只能读写自己的数据。

### 06 / 本地运行

先创建本地配置：

```js
// config.local.js
window.BROOKE_SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co";
window.BROOKE_SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY";
window.BROOKE_GOOGLE_BOOKS_API_KEY = "YOUR_GOOGLE_BOOKS_API_KEY";
window.BROOKE_SUPABASE_FUNCTIONS_URL = "https://YOUR_PROJECT_REF.supabase.co/functions/v1";
```

然后启动本地服务：

```bash
python3 -m http.server 5173
```

打开：

```text
http://127.0.0.1:5173/
```

`config.local.js` 已经被 Git 忽略。不要提交私人 API Key 或 Supabase
`service_role` 密钥。

### 07 / Supabase 设置

应用数据库结构：

```bash
supabase db query --linked --project-ref YOUR_PROJECT_REF --file supabase/schema.sql
```

部署微信读书同步函数：

```bash
supabase functions deploy sync-weread-shelf --project-ref YOUR_PROJECT_REF --no-verify-jwt --use-api
```

更多说明见 [`SUPABASE_WEREAD_SETUP.md`](SUPABASE_WEREAD_SETUP.md)。

<br>

<div align="center">

由 **Brooke / LIAO YUXIN** 设计与制作

[进入阅读室](https://brookell.github.io/brooke-bookshelf/) &nbsp;·&nbsp;
[维护说明](MAINTENANCE.md) &nbsp;·&nbsp;
[产品升级计划](PRODUCT_UPGRADE_PLAN.md)

[返回顶部](#brookes-reading-room)

</div>

<br>
