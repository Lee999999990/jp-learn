# 日语学习助手（jp-learn）

本地离线日语学习桌面应用（面向中文母语者、零基础）。当前为 **M0 里程碑**：项目脚手架 + Windows 安装包 CI 打包流程。

## 技术栈

- **Tauri 2**（Rust 后端，WebView2 渲染）
- **React 19 + TypeScript + Vite**（前端）
- **SQLite**（`tauri-plugin-sql`，本地存储，离线可用）

## 目录结构

```
jp-learn/
├─ src/                  # React 前端源码
│  ├─ App.tsx            # M0 落地页 + 存储自检
│  └─ ...
├─ src-tauri/            # Rust 后端
│  ├─ src/lib.rs         # 插件注册（opener / sql）
│  ├─ Cargo.toml
│  ├─ tauri.conf.json    # 窗口、打包配置
│  ├─ capabilities/      # 权限（含 sql:default）
│  └─ icons/
├─ .github/workflows/
│  └─ build-windows.yml  # Windows 安装包 CI
├─ package.json
└─ README.md
```

## 本地运行（开发）

前置要求：Node ≥ 20、Rust stable（`rustup`）、以及 [Tauri 系统依赖](https://tauri.app/start/prerequisites/)。

```bash
npm install
npm run tauri dev      # 启动桌面应用（开发模式，前端热更新）
```

仅验证前端（类型检查 + 打包，不启动桌面）：

```bash
npm run build          # = tsc && vite build，产物在 dist/
```

## 打包 Windows 安装包

### 方式 A：本机打包（Windows 上执行）

```bash
npm install
npm run tauri build
```

产物位置：`src-tauri/target/release/bundle/nsis/*.exe`（单文件 NSIS 安装包，含 `setup.exe`）。

> 注意：Tauri **不支持在 macOS/Linux 上直接交叉编译 Windows 安装包**，Windows 产物需在 Windows 机器或 CI 上构建。

### 方式 B：GitHub Actions 自动打包（推荐）

将本项目推送到 GitHub 仓库后，`main` 分支每次 push、手动 `workflow_dispatch`、或推送 `v*` 标签都会触发 `.github/workflows/build-windows.yml`，在 `windows-latest` 上构建并上传安装包。

- 触发：push 到 `main`；或 GitHub 仓库 → Actions → `build-windows` → Run workflow。
- 产物位置：该次运行页面底部 **Artifacts → `jp-learn-windows-installer`**，下载解压得到 `*.exe` 安装包。

## M0 验收清单

- [x] Tauri 2 + React + TS 项目脚手架
- [x] 接入 SQLite 插件（`tauri-plugin-sql` + `sql:default` 权限）
- [x] Windows 安装包 CI 工作流（`windows-latest` + NSIS + artifact 上传）
- [x] 前端类型检查 + 构建通过
- [ ] Rust 侧 `cargo check`（见 CI，Windows 上由 CI 完成）
- [ ] Windows `setup.exe` 安装并离线启动（需推送 GitHub 仓库后由 CI 产出）
