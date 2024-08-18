# 本地开发

## 运行本地服务

```sh
yarn install
yarn dev
```

## 添加新书

| 文件 | 说明 |
| --- | --- |
| `README.md` | 添加新书链接 |
| `pages/<book>/index.md{,x}` | 新书首页 |
| `pages/<book>/_meta.json` | 新书边栏目录 |
| `pages/<book>` | 新书内容 |
| `public/<book>` | 新书图片 |
| `_meta.json` | 注册新书目录 |
| `pages/index.md` | 添加新书链接 |
| `utils.ts` | 注册书名 |

注意
- 新书首页文件 `index.md{,x}` 要放在 `pages/<book>` 目录下，这样首页也会显示侧边栏。如果放在 `pages` 目录下，则侧边栏不会显示。这一点 Nextra 文档并未提到。可以参考 Nextra 文档 [docs](https://github.com/shuding/nextra/blob/main/docs/pages/docs/index.mdx) 主页的实际设置。
- 不要用纯数字作为章节文件的文件名（例如：`1.md`），否则 `_meta.json` 无法正确对章节进行排序，因为数字会被设别成 json object 成员序号。
