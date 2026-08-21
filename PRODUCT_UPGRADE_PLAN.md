# Brooke Bookshelf：产品化升级计划

这份计划把当前的个人互动书架，升级为可以让真实用户使用、保存个人书架，并记录关键使用数据的产品。

## 当前状态

当前项目是一个完整的静态网站：

- `index.html` 负责页面结构。
- `styles.css` 负责视觉、动画、响应式和书架布局。
- `app.js` 负责书籍展开、详情页、键盘和鼠标交互。
- `catalog.js` 从 `books.tsv` 读取书籍数据。
- `books.tsv` 是唯一的数据源。

这套结构非常适合保留为产品的核心体验：用户第一次进入时看到的是一个有记忆感、可探索的书架，而不是普通表格或列表。

## 产品方向

目标不是把它变成普通读书 App，而是保留 Brooke's Reading Room 的氛围，同时加入用户自己的阅读空间。

核心体验可以分成三层：

1. 公开书架：访客可以浏览 Brooke 的精选书架。
2. 个人书架：登录用户可以保存、标记、整理自己的书。
3. 数据记录：产品可以记录用户使用行为，用于理解哪些功能、书籍和路径真的被使用。

## 第一阶段：本地可用原型

先不接数据库，使用浏览器本地存储模拟用户数据。这一阶段适合快速验证产品体验。

建议功能：

- 给每本书增加操作按钮：`Add to my shelf`、`Want to read`、`Reading`、`Finished`。
- 用户可以在当前浏览器里保存自己的状态。
- 增加一个 `My shelf` 视图，只显示用户保存过的书。
- 增加基础筛选：全部、想读、在读、已读。
- 增加基础搜索：按书名和作者搜索。

本阶段数据可以存在 `localStorage`，例如：

```json
{
  "book-id": {
    "status": "reading",
    "savedAt": "2026-08-21T10:00:00.000Z",
    "updatedAt": "2026-08-21T10:30:00.000Z"
  }
}
```

第一阶段的意义是先确认：用户是不是愿意把书加入自己的书架，以及书架视图应该长什么样。

## 第二阶段：前端工程化

当前项目没有构建系统，维护成本低，但当功能变多之后，状态管理、登录、API、组件复用会变得困难。

建议升级为：

- Vite
- React
- TypeScript
- 原生 CSS 或 Tailwind CSS

迁移时不要重做视觉。应该先把现有页面拆成组件：

- `Shelf`
- `BookSpine`
- `BookDetail`
- `BookIndex`
- `ShelfToolbar`
- `MyShelf`
- `SearchAndFilters`

`books.tsv` 可以先转为 `books.json`，后面再迁到数据库。

## 第三阶段：用户系统与数据库

建议优先考虑 Supabase，因为它同时提供：

- 用户登录
- PostgreSQL 数据库
- Row Level Security
- 文件存储
- 简单 API

适合这个项目的初版数据表：

### `profiles`

用户公开资料。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | uuid | 对应 auth 用户 ID |
| `display_name` | text | 用户显示名 |
| `avatar_url` | text | 头像 |
| `created_at` | timestamptz | 创建时间 |

### `books`

公共书籍库。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | uuid | 书籍 ID |
| `title` | text | 书名 |
| `author` | text | 作者 |
| `cover_url` | text | 封面 |
| `description` | text | 简介 |
| `color` | text | 主色 |
| `spine_color` | text | 书脊颜色 |
| `created_at` | timestamptz | 创建时间 |

### `user_books`

用户自己的书架。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | uuid | 记录 ID |
| `user_id` | uuid | 用户 ID |
| `book_id` | uuid | 书籍 ID |
| `status` | text | `want_to_read` / `reading` / `finished` |
| `rating` | int | 评分，可选 |
| `note` | text | 用户笔记，可选 |
| `started_at` | date | 开始阅读日期 |
| `finished_at` | date | 完成阅读日期 |
| `created_at` | timestamptz | 加入书架时间 |
| `updated_at` | timestamptz | 更新时间 |

### `events`

记录产品使用数据。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | uuid | 事件 ID |
| `user_id` | uuid | 用户 ID，可为空 |
| `anonymous_id` | text | 未登录访客 ID |
| `event_name` | text | 事件名 |
| `book_id` | uuid | 关联书籍，可为空 |
| `properties` | jsonb | 额外数据 |
| `created_at` | timestamptz | 事件时间 |

## 应该记录的关键事件

第一版不需要记录太多。建议只记录真正能帮助判断产品方向的事件：

- `page_view`
- `book_previewed`
- `book_opened`
- `book_saved`
- `book_status_changed`
- `my_shelf_opened`
- `search_used`
- `filter_used`
- `signup_started`
- `signup_completed`

这些数据可以回答几个重要问题：

- 用户会不会打开书籍详情？
- 哪些书最吸引用户？
- 用户是否真的使用自己的书架？
- 搜索和筛选是否必要？
- 登录是否形成阻力？

## 隐私原则

如果要记录用户数据，产品里需要尽早建立几个原则：

- 不记录用户不需要你知道的内容。
- 未登录用户使用匿名 ID。
- 用户笔记默认私密。
- 明确告知会记录哪些行为数据。
- 后台分析优先看聚合数据，而不是单个用户轨迹。

## 推荐开发顺序

1. 保留当前静态项目，新增 `My shelf` 和本地保存状态。
2. 增加搜索、筛选和基础事件记录的本地模拟。
3. 确认产品交互后，迁移到 Vite + React + TypeScript。
4. 接 Supabase 用户登录和数据库。
5. 把 `books.tsv` 数据迁移到数据库或 `books.json`。
6. 增加真实事件上报。
7. 部署新版，同时保留 GitHub Pages 版本作为旧版备份。

## 下一步建议

下一步最适合先做第一阶段：在当前静态项目中增加一个轻量的个人书架原型。

这一步不需要登录，也不需要数据库，但可以马上看到产品形态：

- 用户点击一本书。
- 在详情页把它加入自己的书架。
- 选择阅读状态。
- 从工具栏进入 `My shelf`。
- 刷新页面后状态仍然保留。

等这个体验顺了，再接真实账户和数据库会更稳。
