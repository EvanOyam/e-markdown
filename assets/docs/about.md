# 关于 EMarkdown

一款以 Markdown 为基础，集合 Todo / Markdown Editor / Mindmap 为一体的工具软件

> Github: [EMarkdown](https://github.com/EvanOyam/e-markdown)  
> Author: [@Evan](https://github.com/EvanOyam)

```tsx
const aboutMdPath = path.join(__dirname, '..', 'assets', 'docs', 'about.md');
const aboutMd = fs.readFileSync(aboutMdPath).toString();

export default function About() {
  return (
    <AboutWrapper>
      <div className="markdown-body">
        <ReactMarkdown>{aboutMd}</ReactMarkdown>
      </div>
    </AboutWrapper>
  );
}
```

## 功能

#### 看板

- 今日代办看板
- 趋势总览看板
- 代办任务支持拖拽排序

#### 任务

- Todo list
- 支持按日期分类
- 提供标签分类的功能
- 每一条 todo 都支持 markdown 编辑

#### 笔记

- Markdown editor
- 提供可视化按钮操作
- 支持文件夹分类
- 支持模糊搜索
- 支持实时 review
- 支持全屏和分屏

#### 脑图

- 以 markdown 的形式写脑图
- 支持文件夹分类
- 支持模糊搜索

## TODO

- 云同步
