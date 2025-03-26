# 健身动作API调用工具

## 项目简介

健身动作API调用工具是一个基于Web的应用程序，提供对健身动作数据的便捷访问和查询功能。通过这个工具，用户可以浏览超过300种健身动作的详细信息，包括动作名称、锻炼部位、所需器材、动作说明以及动作演示图片。

## 功能特点

- **自动加载**: 页面加载时自动获取并显示所有健身动作
- **分类查询**: 支持按肌肉群组和器材类型进行筛选
- **分页浏览**: 支持分页显示大量结果，便于浏览
- **图片预览**: 点击图片可放大查看动作演示和肌肉示意图
- **响应式设计**: 适配桌面和移动设备的界面
- **现代UI**: 美观的界面设计和流畅的交互体验

## 安装说明

1. 下载所有文件（index.html, styles.css, script.js）
2. 将文件放在同一目录下
3. 直接在浏览器中打开index.html即可使用

## 使用方法

### 浏览所有动作

- 页面加载时自动显示所有健身动作，默认每页显示10个
- 使用分页控件浏览更多动作
- 可以调整每页显示的动作数量（10、20、50或100个）

### 按肌肉群组查询

1. 点击"按肌肉群组查询"按钮
2. 从下拉菜单中选择想要查询的肌肉群组（胸部、背部、肩部等）
3. 点击"查询"按钮
4. 查看符合条件的动作列表

### 按器材类型查询

1. 点击"按器材查询"按钮
2. 从下拉菜单中选择想要查询的器材类型（哑铃、杠铃、徒手等）
3. 点击"查询"按钮
4. 查看符合条件的动作列表

### 查看详细信息

- 每个动作卡片显示动作名称、锻炼部位、器材、难度和动作说明
- 点击动作演示图或肌肉示意图可放大查看

## API调用原理

本工具使用以下API端点获取数据：

1. **获取所有动作**:
   ```
   https://jeffrey-done.github.io/fitness-api/actions.json
   ```

2. **按肌肉群组查询**:
   ```
   https://jeffrey-done.github.io/fitness-api/actions_by_muscle.json
   ```

3. **按器材类型查询**:
   ```
   https://jeffrey-done.github.io/fitness-api/actions_by_equipment.json
   ```

4. **获取动作详细信息**:
   ```
   https://jeffrey-done.github.io/fitness-api/actions_by_id.json
   ```

5. **动作图片路径格式**:
   - 动作演示GIF: `https://jeffrey-done.github.io/fitness-api/images/actions/{ID}/action_1.gif`
   - 肌肉示意图: `https://jeffrey-done.github.io/fitness-api/images/muscles/{ID}/muscle_1.jpg`

## 技术栈

- HTML5
- CSS3 (使用变量、过渡和动画等现代特性)
- JavaScript (原生JS，无框架依赖)
- Fetch API (用于数据请求)

## 自定义开发

如果需要进一步开发或修改：

1. **修改样式**: 编辑styles.css文件
2. **修改功能**: 编辑script.js文件
3. **修改结构**: 编辑index.html文件

## 数据来源

所有健身动作数据来源于[健身动作API](https://jeffrey-done.github.io/fitness-api/)，包含了317种健身动作的详细信息和图片资源。 