#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
健身动作API客户端
用于访问GitHub上的健身动作数据
"""

import requests
import json

class FitnessApiClient:
    """健身动作API客户端"""
    
    def __init__(self, base_url=None):
        """初始化客户端"""
        # 如果未提供base_url，使用默认的GitHub Pages URL
        # 部署后需要修改为你的GitHub用户名
        self.base_url = base_url or "https://[你的用户名].github.io/fitness-api"
    
    def get_all_actions(self):
        """获取所有动作"""
        url = f"{self.base_url}/actions.json"
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"API请求失败，状态码: {response.status_code}")
    
    def get_action_by_id(self, action_id):
        """获取特定ID的动作"""
        url = f"{self.base_url}/actions_by_id.json"
        response = requests.get(url)
        if response.status_code == 200:
            actions = response.json()
            return actions.get(str(action_id))
        else:
            raise Exception(f"API请求失败，状态码: {response.status_code}")
    
    def get_actions_by_muscle(self, muscle_name):
        """获取特定肌肉群的动作ID列表"""
        url = f"{self.base_url}/actions_by_muscle.json"
        response = requests.get(url)
        if response.status_code == 200:
            muscle_map = response.json()
            return muscle_map.get(muscle_name, [])
        else:
            raise Exception(f"API请求失败，状态码: {response.status_code}")
    
    def get_actions_by_equipment(self, equipment_name):
        """获取特定器材的动作ID列表"""
        url = f"{self.base_url}/actions_by_equipment.json"
        response = requests.get(url)
        if response.status_code == 200:
            equipment_map = response.json()
            return equipment_map.get(equipment_name, [])
        else:
            raise Exception(f"API请求失败，状态码: {response.status_code}")
    
    def get_muscle_groups(self):
        """获取所有肌肉群组"""
        url = f"{self.base_url}/actions_by_muscle.json"
        response = requests.get(url)
        if response.status_code == 200:
            muscle_map = response.json()
            return list(muscle_map.keys())
        else:
            raise Exception(f"API请求失败，状态码: {response.status_code}")
    
    def get_equipment_types(self):
        """获取所有器材类型"""
        url = f"{self.base_url}/actions_by_equipment.json"
        response = requests.get(url)
        if response.status_code == 200:
            equipment_map = response.json()
            return list(equipment_map.keys())
        else:
            raise Exception(f"API请求失败，状态码: {response.status_code}")

# 使用示例
if __name__ == "__main__":
    # 创建客户端
    client = FitnessApiClient()
    
    try:
        # 获取所有动作
        actions = client.get_all_actions()
        print(f"共获取到 {len(actions)} 个动作")
        
        # 获取ID为1的动作
        action = client.get_action_by_id(1)
        if action:
            print(f"ID=1的动作: {action['action_name']}")
        
        # 获取胸部动作
        chest_actions = client.get_actions_by_muscle("胸部")
        print(f"胸部动作数量: {len(chest_actions)}")
        
        # 获取哑铃动作
        dumbbell_actions = client.get_actions_by_equipment("哑铃")
        print(f"哑铃动作数量: {len(dumbbell_actions)}")
        
        # 获取所有肌肉群组
        muscle_groups = client.get_muscle_groups()
        print(f"肌肉群组: {', '.join(muscle_groups)}")
        
        # 获取所有器材类型
        equipment_types = client.get_equipment_types()
        print(f"器材类型: {', '.join(equipment_types)}")
        
    except Exception as e:
        print(f"错误: {str(e)}")
