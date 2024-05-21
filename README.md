# 天朝禁书

## 书目

- [习近平和他的情人们](pages/lovers/index.md)
- [红色赌盘](pages/roulette/index.mdx)
- [墓碑](pages/tombstone/index.md)

## 添加新书

| 文件 | 说明 |
| --- | --- |
| `README.md` | 添加新书链接 |
| `pages/<book>/index.md{,x}` | 新书首页 |
| `pages/<book>` | 新书内容 |
| `public/<book>` | 新书图片 |
| `_meta.json` | 注册新书目录 |
| `pages/index.md` | 添加新书链接 |
| `theme.config.tsx` | 注册书名 |

注意，新书首页文件 `index.md{,x}` 要放在 `pages/<book>` 目录下，这样首页也会显示侧边栏。如果放在 `pages` 目录下，则侧边栏不会显示。这一点 Nextra 文档并未提到。可以参考 Nextra 文档 [docs](https://github.com/shuding/nextra/blob/main/docs/pages/docs/index.mdx) 主页的实际设置。

## 本地开发

```sh
yarn install
yarn dev
```
