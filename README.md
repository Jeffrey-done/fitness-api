# 健身动作 API 使用说明

## 项目简介

健身动作API是一个基于GitHub Pages的静态API，提供超过300种健身动作的详细信息，包括动作名称、目标肌肉群、所需器材、详细描述以及动作演示GIF。该API适用于健身应用、健身追踪软件或任何需要健身动作数据的项目。

## 主要特点

- **完全免费**: 基于GitHub Pages，无需服务器成本
- **易于集成**: 简单的HTTP请求即可获取数据
- **丰富的数据**: 包含317种健身动作的详细信息
- **多种查询方式**: 支持按ID、肌肉群组、器材类型等多种查询
- **包含图片资源**: 提供肌肉示意图和动作演示GIF

## API基础信息

### 基本URL

```
https://jeffrey-done.github.io/fitness-api/
```

### 数据格式

所有API返回的数据均为JSON格式。

## API端点

### 1. 获取所有动作

获取完整的健身动作列表。

**请求:**
```
GET https://jeffrey-done.github.io/fitness-api/actions.json
```

**响应示例:**
```json
[
  {
    "id": "1",
    "action_name": "侧卧哑铃侧拉",
    "fitness_areas": ["肩部"],
    "exercise_parts": "肩部",
    "equipment": "哑铃",
    "desc": "侧卧哑铃侧拉是一种锻炼肩部肌肉的动作，主要锻炼中束三角肌。",
    "muscle_image": "images/肩部/侧卧哑铃侧拉_muscle.jpg",
    "action_gif": "images/肩部/侧卧哑铃侧拉.gif"
  },
  ...
]
```

### 2. 按ID获取动作

获取特定ID的健身动作详细信息。

**请求:**
```
GET https://jeffrey-done.github.io/fitness-api/actions_by_id.json
```

然后从返回的JSON对象中查找特定ID，例如获取ID=3的动作"俯卧撑"：
```javascript
const actionData = data["3"];
```

**响应示例:**
```json
{
  "3": {
    "id": "3",
    "action_name": "俯卧撑",
    "fitness_areas": ["胸部"],
    "exercise_parts": "胸部",
    "equipment": "无器械",
    "desc": "俯卧撑是一种利用自身体重进行的锻炼方式，主要锻炼胸部肌肉。协同锻炼: 肱三头肌、前三角肌",
    "muscle_image": "images/胸部/俯卧撑_muscle.jpg",
    "action_gif": "images/胸部/俯卧撑.gif"
  }
}
```

### 3. 按肌肉群组获取动作

获取特定肌肉群组的所有动作。

**请求:**
```
GET https://jeffrey-done.github.io/fitness-api/actions_by_muscle.json
```

**响应示例:**
```json
{
  "胸部": ["3", "44", "45", "46", "47", "48", "49", "50", ...],
  "背部": ["2", "11", "12", "13", "17", "18", "19", ...],
  "腿部": ["234", "235", "236", "237", "238", ...],
  ...
}
```

### 4. 按器材类型获取动作

获取特定器材类型的所有动作。

**请求:**
```
GET https://jeffrey-done.github.io/fitness-api/actions_by_equipment.json
```

**响应示例:**
```json
{
  "哑铃": ["1", "5", "7", "8", "14", "15", ...],
  "杠铃": ["2", "4", "24", "25", "26", ...],
  "无器械": ["3", "282", "283", "285", "286", ...],
  ...
}
```

### 5. 获取图片资源

获取动作的肌肉示意图或动作演示GIF。

**请求:**
```
GET https://jeffrey-done.github.io/fitness-api/images/{肌肉群组}/{文件名}
```

**示例:**
```
// 获取俯卧撑的动作演示GIF
https://jeffrey-done.github.io/fitness-api/images/胸部/俯卧撑.gif

// 获取俯卧撑的肌肉示意图
https://jeffrey-done.github.io/fitness-api/images/胸部/俯卧撑_muscle.jpg
```

## 代码示例

### Python示例

```python
import requests
import json

# 基本URL
BASE_URL = "https://jeffrey-done.github.io/fitness-api"

# 获取所有动作
def get_all_actions():
    response = requests.get(f"{BASE_URL}/actions.json")
    return response.json()

# 根据ID获取动作
def get_action_by_id(action_id):
    response = requests.get(f"{BASE_URL}/actions_by_id.json")
    actions = response.json()
    return actions.get(str(action_id))

# 获取特定肌肉群组的动作ID列表
def get_actions_by_muscle(muscle_name):
    response = requests.get(f"{BASE_URL}/actions_by_muscle.json")
    muscle_map = response.json()
    return muscle_map.get(muscle_name, [])

# 获取特定器材类型的动作ID列表
def get_actions_by_equipment(equipment_name):
    response = requests.get(f"{BASE_URL}/actions_by_equipment.json")
    equipment_map = response.json()
    return equipment_map.get(equipment_name, [])

# 使用示例
if __name__ == "__main__":
    # 获取俯卧撑的详细信息
    pushup = get_action_by_id(3)
    print(f"动作名称: {pushup['action_name']}")
    print(f"锻炼部位: {pushup['exercise_parts']}")
    print(f"所需器材: {pushup['equipment']}")
    print(f"动作描述: {pushup['desc']}")
    print(f"动作GIF: {BASE_URL}/{pushup['action_gif']}")
    
    # 获取所有胸部动作的ID
    chest_actions = get_actions_by_muscle("胸部")
    print(f"胸部动作数量: {len(chest_actions)}")
    
    # 获取所有无器械动作的ID
    no_equipment_actions = get_actions_by_equipment("无器械")
    print(f"无器械动作数量: {len(no_equipment_actions)}")
```

### C#示例

```csharp
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace FitnessApiClient
{
    public class FitnessApiClient
    {
        private readonly HttpClient _client;
        private readonly string _baseUrl;

        public FitnessApiClient()
        {
            _client = new HttpClient();
            _baseUrl = "https://jeffrey-done.github.io/fitness-api";
        }

        // 获取所有动作
        public async Task<List<ActionInfo>> GetAllActionsAsync()
        {
            var response = await _client.GetStringAsync($"{_baseUrl}/actions.json");
            return JsonSerializer.Deserialize<List<ActionInfo>>(response);
        }

        // 根据ID获取动作
        public async Task<ActionInfo> GetActionByIdAsync(int id)
        {
            var response = await _client.GetStringAsync($"{_baseUrl}/actions_by_id.json");
            var actions = JsonSerializer.Deserialize<Dictionary<string, ActionInfo>>(response);
            
            if (actions.TryGetValue(id.ToString(), out var action))
                return action;
                
            return null;
        }

        // 获取特定肌肉群组的动作
        public async Task<List<string>> GetActionsByMuscleAsync(string muscleName)
        {
            var response = await _client.GetStringAsync($"{_baseUrl}/actions_by_muscle.json");
            var muscleMap = JsonSerializer.Deserialize<Dictionary<string, List<string>>>(response);
            
            if (muscleMap.TryGetValue(muscleName, out var actionIds))
                return actionIds;
                
            return new List<string>();
        }

        // 获取特定器材类型的动作
        public async Task<List<string>> GetActionsByEquipmentAsync(string equipmentName)
        {
            var response = await _client.GetStringAsync($"{_baseUrl}/actions_by_equipment.json");
            var equipmentMap = JsonSerializer.Deserialize<Dictionary<string, List<string>>>(response);
            
            if (equipmentMap.TryGetValue(equipmentName, out var actionIds))
                return actionIds;
                
            return new List<string>();
        }
    }

    public class ActionInfo
    {
        public string id { get; set; }
        public string action_name { get; set; }
        public List<string> fitness_areas { get; set; }
        public string exercise_parts { get; set; }
        public string equipment { get; set; }
        public string desc { get; set; }
        public string muscle_image { get; set; }
        public string action_gif { get; set; }
    }
}
```

## 部署自己的API

如果您想部署自己的健身动作API，请按照以下步骤操作：

1. Fork或克隆本仓库: `https://github.com/Jeffrey-done/fitness-api`
2. 修改数据文件（如需）
3. 推送代码到您自己的GitHub仓库
4. 启用GitHub Pages功能:
   - 在仓库设置中找到"Pages"选项
   - 选择部署源（通常是main或master分支）
   - 点击保存

完成上述步骤后，您将拥有自己的API，可以通过以下URL访问：
```
https://[您的GitHub用户名].github.io/fitness-api/
```

## 常见问题

### Q: API有使用限制吗？
A: 由于这是基于GitHub Pages的静态API，使用限制取决于GitHub Pages的服务条款，通常包括带宽和存储限制。对于大多数小型应用程序，这些限制应该足够。

### Q: 数据会更新吗？
A: 数据只有在仓库代码更新时才会更新。这是一个静态API，不会自动获取新的健身动作信息。

### Q: 能否在商业项目中使用这个API？
A: 这取决于数据的许可协议。请查看仓库中的LICENSE文件了解详情。

### Q: 如何在本地测试这个API？
A: 可以使用仓库中提供的`api_server_example.py`来启动本地API服务器：
```
python api_server_example.py --dir fitness-api
```

## 许可协议

本API数据源自公开网络，仅用于个人学习和研究目的。请参阅仓库中的LICENSE文件了解完整的许可信息。

---

如有任何问题或建议，请通过GitHub Issues联系我们。祝您使用愉快！ 