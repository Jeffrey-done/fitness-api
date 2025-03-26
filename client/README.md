# 健身动作API客户端

这个目录包含用于访问健身动作API的客户端示例。

## Python客户端

使用方法：

```python
from fitness_api_client import FitnessApiClient

# 创建客户端
client = FitnessApiClient()

# 获取所有动作
actions = client.get_all_actions()

# 获取ID为1的动作
action = client.get_action_by_id(1)
```

## C#客户端

使用方法：

```csharp
// 创建客户端
var client = new FitnessApiClient();

// 获取所有动作
var actions = await client.GetAllActionsAsync();

// 获取ID为1的动作
var action = await client.GetActionByIdAsync(1);
```

