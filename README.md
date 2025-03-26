# 健身动作数据库

这是一个包含健身动作数据的开放数据库，可以通过GitHub Pages作为API使用。

## API使用方法

### 获取所有动作
```
GET https://[你的用户名].github.io/fitness-api/actions.json
```

### 获取特定ID的动作
```
GET https://[你的用户名].github.io/fitness-api/actions_by_id.json
```

### 获取按肌肉分组的动作
```
GET https://[你的用户名].github.io/fitness-api/actions_by_muscle.json
```

### 获取按器材分组的动作
```
GET https://[你的用户名].github.io/fitness-api/actions_by_equipment.json
```

## 数据来源

数据来自健身网站www.fitsns.cn，仅用于个人学习和研究。

## 统计

- 动作总数: 317
- 肌肉群组: 7
- 器材类型: 12
