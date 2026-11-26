# NotionBlog

Personal security-engineering blog and portfolio — **https://j1w0n.vercel.app**

Posts are written in Notion and rendered with Next.js (Pages Router, SSG + ISR).
Started from [morethan-log](https://github.com/morethanmin/morethan-log) (MIT);
the data layer, visibility rules and UI have since been rewritten.

## Stack

- Next.js 13 · React 18 · TypeScript · Emotion
- Official Notion SDK (`@notionhq/client`) → `react-notion-x` rendering
- TanStack Query for SSG hydration · Vitest for tests · Vercel hosting

## Development

```bash
yarn install --frozen-lockfile
cp .env.example .env.local   # or set the variables below
yarn dev
yarn test
```

| Variable | Scope | Purpose |
|---|---|---|
| `NOTION_API_KEY` | server only | Notion integration token (read-only) |
| `NOTION_PAGE_ID` | server only | Posts database ID |
| `TOKEN_FOR_REVALIDATE` | server only | Secret for `/api/revalidate` (required; unset = disabled) |
| `NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID` etc. | public | Analytics / site verification / Utterances |

Never prefix Notion or revalidation secrets with `NEXT_PUBLIC_`.

## Content & visibility

What can be managed from Notion, the post schema, the visibility matrix
(`Public` / `PublicOnDetail` / `Private`) and the security checklist are in
[docs/NOTION_CONTENT_GUIDE.md](docs/NOTION_CONTENT_GUIDE.md). Architecture notes:
[ARCHITECTURE.md](ARCHITECTURE.md).

The Notion database must **not** be shared to web, and the integration should
only have access to the posts database.

## License

MIT — see [LICENSE](LICENSE).
