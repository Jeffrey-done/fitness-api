using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace FitJourney.Api
{
    /// <summary>
    /// 健身动作API客户端
    /// </summary>
    public class FitnessApiClient
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;

        /// <summary>
        /// 初始化健身API客户端
        /// </summary>
        /// <param name="baseUrl">API基础URL，默认为GitHub Pages URL</param>
        public FitnessApiClient(string baseUrl = null)
        {
            _httpClient = new HttpClient();
            // 如果未提供baseUrl，使用默认的GitHub Pages URL
            // 部署后需要修改为你的GitHub用户名
            _baseUrl = baseUrl ?? "https://[你的用户名].github.io/fitness-api";
        }

        /// <summary>
        /// 获取所有动作
        /// </summary>
        public async Task<List<ActionModel>> GetAllActionsAsync()
        {
            var url = $"{_baseUrl}/actions.json";
            var response = await _httpClient.GetStringAsync(url);
            return JsonConvert.DeserializeObject<List<ActionModel>>(response);
        }

        /// <summary>
        /// 获取特定ID的动作
        /// </summary>
        public async Task<ActionModel> GetActionByIdAsync(int actionId)
        {
            var url = $"{_baseUrl}/actions_by_id.json";
            var response = await _httpClient.GetStringAsync(url);
            var actions = JsonConvert.DeserializeObject<Dictionary<string, ActionModel>>(response);
            
            if (actions.TryGetValue(actionId.ToString(), out var action))
            {
                return action;
            }
            
            return null;
        }

        /// <summary>
        /// 获取特定肌肉群的动作ID列表
        /// </summary>
        public async Task<List<int>> GetActionsByMuscleAsync(string muscleName)
        {
            var url = $"{_baseUrl}/actions_by_muscle.json";
            var response = await _httpClient.GetStringAsync(url);
            var muscleMap = JsonConvert.DeserializeObject<Dictionary<string, List<int>>>(response);
            
            if (muscleMap.TryGetValue(muscleName, out var actionIds))
            {
                return actionIds;
            }
            
            return new List<int>();
        }

        /// <summary>
        /// 获取特定器材的动作ID列表
        /// </summary>
        public async Task<List<int>> GetActionsByEquipmentAsync(string equipmentName)
        {
            var url = $"{_baseUrl}/actions_by_equipment.json";
            var response = await _httpClient.GetStringAsync(url);
            var equipmentMap = JsonConvert.DeserializeObject<Dictionary<string, List<int>>>(response);
            
            if (equipmentMap.TryGetValue(equipmentName, out var actionIds))
            {
                return actionIds;
            }
            
            return new List<int>();
        }

        /// <summary>
        /// 获取所有肌肉群组
        /// </summary>
        public async Task<List<string>> GetMuscleGroupsAsync()
        {
            var url = $"{_baseUrl}/actions_by_muscle.json";
            var response = await _httpClient.GetStringAsync(url);
            var muscleMap = JsonConvert.DeserializeObject<Dictionary<string, List<int>>>(response);
            
            return new List<string>(muscleMap.Keys);
        }

        /// <summary>
        /// 获取所有器材类型
        /// </summary>
        public async Task<List<string>> GetEquipmentTypesAsync()
        {
            var url = $"{_baseUrl}/actions_by_equipment.json";
            var response = await _httpClient.GetStringAsync(url);
            var equipmentMap = JsonConvert.DeserializeObject<Dictionary<string, List<int>>>(response);
            
            return new List<string>(equipmentMap.Keys);
        }
    }

    /// <summary>
    /// 动作数据模型
    /// </summary>
    public class ActionModel
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("action_name")]
        public string Name { get; set; }

        [JsonProperty("fitness_areas")]
        public List<string> FitnessAreas { get; set; }

        [JsonProperty("exercise_parts")]
        public string ExerciseParts { get; set; }

        [JsonProperty("equipment")]
        public string Equipment { get; set; }

        [JsonProperty("desc")]
        public string Description { get; set; }

        [JsonProperty("muscle_images_urls")]
        public List<string> MuscleImagesUrls { get; set; }

        [JsonProperty("action_gifs_urls")]
        public List<string> ActionGifsUrls { get; set; }
    }
}
