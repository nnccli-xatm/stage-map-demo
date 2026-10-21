# 阶段地图 · 免费传播版 H5 · v2.0-free

**工作名：** 阶段地图  
**性质：** 纯前端产品体验（**全程免费** · 无支付 · 无兑换码）  
**日期：** 2026-10-21（Asia/Shanghai）  
**版本：** **v2.0-free**  
**内容规格：** `md/15-chatgpt-content-design.md`（G3 · 职场迷茫 + 副业过载）  
**决策：** `md/16-free-viral-mvp-decision.md`

---

## 流程

1. **入口选择：** 职场迷茫（默认推荐）｜ 副业过载  
2. **首屏：** 画像主句 H1 + CTA「看看我现在卡在哪」+ 全程免费声明；边界折叠  
3. **约 8 题：** 最近 14 天场景化题干 · 统一频次选项（没有／1–2 天／3–5 天／6 天及以上／不适用或记不清）  
4. **免费摘要：** 「被说中」+ 相位 + 今天一步 + 依据摘录（完整小结论，无半遮罩付费诱导）  
5. **一键「展开完整地图」：** 无门槛 · 无代码 · 进入六块报告  
6. **分享卡：** 相位 + punch + 今天一步（默认不展示分数）  
7. **可选洞察反馈：** 报告末 3 题 · 默认 localStorage  

计分：规则映射四维观察（思考与行动 / 精力与恢复 / 关系与生活意义 / 工作与方向）；无线索维度显示「本次信息不足」。无后端、无账号。相位为近期行为称呼，不使用 Human 3.0 / Metatype 商标文案。

---

## 如何打开

### 方式 A · 直接打开（file://）

用浏览器打开本目录下的 `index.html`（可完全离线）。

### 方式 B · 本地静态服务（推荐）

```bash
cd demo
python3 -m http.server 8765
```

浏览器访问：`http://127.0.0.1:8765/`

### 方式 C · 公开 URL

见 `deliverables/growth/free-mvp-launch/hosting-notes.md`（GitHub Pages 或静态 host）。

---

## 洞察反馈（如何捕获）

| 项 | 说明 |
|----|------|
| 位置 | 完整报告页底部「可选反馈」 |
| 题目 | ① 被说中程度 1–5　② 是否愿分享　③ 一句想改的话（选填） |
| 默认存储 | 本机 `localStorage` 键 **`stage-map-insight-v2`**（JSON 数组） |
| 外发 | 「复制反馈 JSON」后打开 `FORM_URL`（GitHub Issue 模板 `insight-feedback.yml`） |
| Issue URL | https://github.com/nnccli-xatm/stage-map-demo/issues/new?template=insight-feedback.yml&title=%5B%E6%B4%9E%E5%AF%9F%5D%20 |
| 隐私 | **不自动上传**；与页内数据说明一致。清除站点数据即可删除 |

洞察默认在本机 `localStorage` 累积，直到用户外发。`FORM_URL` 已指向公开仓 Issue 模板（非 Google Form）。运营侧在 Issues 筛 label `insight`。本阶段不做后端埋点。

---

## 文件

| 文件 | 说明 |
|------|------|
| `index.html` | 单页壳（chooser → landing → quiz → summary → report） |
| `styles.css` | 移动优先样式 |
| `app.js` | 题库、相位、摘要、六块报告、分享、洞察 |
| `sample-report-static.md` | 虚构样稿（对齐文档 15 C4） |
| `README.md` | 本说明 |

相对 v1.2.1：**移除** DEMO / 兑换码 / 半遮罩付费预览 / 「揭开」支付话术；**新增** 画像入口、文档 15 题干与相位名、洞察表单、版本徽标 `v2.0-free`。

---

## 合规页脚

各屏保留「非医疗 / 非心理咨询 / 非投资建议」；危机求助为公共资源占位；数据说明与纯前端实现一致。
