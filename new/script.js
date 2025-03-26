document.addEventListener('DOMContentLoaded', function() {
    const BASE_URL = 'https://jeffrey-done.github.io/fitness-api';
    let currentQueryType = 'all';
    let lastQueryData = null;
    let currentPage = 1;
    let resultsPerPage = 10; // 默认每页显示10个结果
    
    // 选择UI元素
    const queryBtns = document.querySelectorAll('.query-btn');
    const queryBtn = document.getElementById('queryBtn');
    const muscleParams = document.getElementById('muscleParams');
    const equipmentParams = document.getElementById('equipmentParams');
    const muscleGroupSelect = document.getElementById('muscle-group');
    const equipmentTypeSelect = document.getElementById('equipment-type');
    const apiUrlDiv = document.getElementById('apiUrl');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    
    // 创建图片预览模态框
    const imageModal = document.createElement('div');
    imageModal.className = 'image-modal';
    imageModal.innerHTML = `
        <span class="close-modal">&times;</span>
        <div class="modal-content">
            <img src="" alt="预览图片">
        </div>
    `;
    document.body.appendChild(imageModal);
    
    // 关闭模态框
    const closeModal = document.querySelector('.close-modal');
    closeModal.addEventListener('click', () => {
        imageModal.classList.remove('active');
    });
    
    // 点击模态框外部关闭
    imageModal.addEventListener('click', function(e) {
        if (e.target === this) {
            imageModal.classList.remove('active');
        }
    });
    
    // 设置查询类型按钮事件
    queryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有按钮的active类
            queryBtns.forEach(b => b.classList.remove('active'));
            // 为当前按钮添加active类
            this.classList.add('active');
            
            // 更新当前查询类型
            currentQueryType = this.dataset.type;
            
            // 添加过渡效果
            const allParams = [muscleParams, equipmentParams];
            allParams.forEach(param => {
                param.style.display = 'none';
                param.style.opacity = 0;
            });
            
            // 根据选择显示相应的输入字段
            setTimeout(() => {
                if (currentQueryType === 'muscle') {
                    muscleParams.style.display = 'block';
                    setTimeout(() => { muscleParams.style.opacity = 1; }, 50);
                } else if (currentQueryType === 'equipment') {
                    equipmentParams.style.display = 'block';
                    setTimeout(() => { equipmentParams.style.opacity = 1; }, 50);
                }
            }, 300);
        });
    });
    
    // 设置查询按钮事件
    queryBtn.addEventListener('click', performQuery);
    
    // 页面加载时自动获取所有动作
    fetchAllActions();
    
    // 自动获取所有动作
    function fetchAllActions() {
        loadingDiv.style.display = 'block';
        
        // 显示加载动画
        resultsDiv.innerHTML = '<div class="loading-animation">加载所有动作，请稍候...</div>';
        
        const apiUrl = `${BASE_URL}/actions.json`;
        apiUrlDiv.textContent = apiUrl;
        
        // 发送API请求
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络响应错误');
                }
                return response.json();
            })
            .then(data => {
                console.log('API响应数据:', data);
                lastQueryData = data;
                loadingDiv.style.display = 'none';
                displayResults(data, {});
            })
            .catch(error => {
                console.error('API请求错误:', error);
                loadingDiv.style.display = 'none';
                showError(`请求失败: ${error.message}`);
            });
    }
    
    // 执行查询
    function performQuery() {
        // 重置页码
        currentPage = 1;
        
        // 清空结果
        resultsDiv.innerHTML = '';
        
        // 构建API URL
        let apiUrl = '';
        let queryParams = {};
        
        switch (currentQueryType) {
            case 'all':
                apiUrl = `${BASE_URL}/actions.json`;
                break;
            case 'muscle':
                apiUrl = `${BASE_URL}/actions_by_muscle.json`;
                queryParams.muscle = muscleGroupSelect.value;
                if (!queryParams.muscle) {
                    showError('请选择肌肉群组');
                    return;
                }
                break;
            case 'equipment':
                apiUrl = `${BASE_URL}/actions_by_equipment.json`;
                queryParams.equipment = equipmentTypeSelect.value;
                if (!queryParams.equipment) {
                    showError('请选择器材类型');
                    return;
                }
                break;
        }
        
        apiUrlDiv.textContent = apiUrl;
        loadingDiv.style.display = 'block';
        
        // 显示加载动画
        resultsDiv.innerHTML = '<div class="loading-animation">查询中，请稍候...</div>';
        
        // 发送API请求
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络响应错误');
                }
                return response.json();
            })
            .then(data => {
                console.log('API响应数据:', data);
                lastQueryData = data;
                loadingDiv.style.display = 'none';
                displayResults(data, queryParams);
            })
            .catch(error => {
                console.error('API请求错误:', error);
                loadingDiv.style.display = 'none';
                showError(`请求失败: ${error.message}`);
            });
    }
    
    // 显示错误信息
    function showError(message) {
        resultsDiv.innerHTML = `<div class="error"><i class="error-icon">!</i>${message}</div>`;
    }
    
    // 显示结果
    function displayResults(data, queryParams) {
        if (!data || Object.keys(data).length === 0) {
            resultsDiv.innerHTML = '<div class="no-results">没有找到结果</div>';
            return;
        }
        
        let resultsHTML = '';
        
        switch (currentQueryType) {
            case 'all':
                // 显示所有动作
                resultsHTML = `
                    <div class="results-options">
                        <div class="results-summary">共找到 ${data.length} 个动作</div>
                        <div class="results-count-selector">
                            <label for="results-per-page">每页显示:</label>
                            <select id="results-per-page">
                                <option value="10" ${resultsPerPage === 10 ? 'selected' : ''}>10个</option>
                                <option value="20" ${resultsPerPage === 20 ? 'selected' : ''}>20个</option>
                                <option value="50" ${resultsPerPage === 50 ? 'selected' : ''}>50个</option>
                                <option value="100" ${resultsPerPage === 100 ? 'selected' : ''}>100个</option>
                            </select>
                        </div>
                    </div>
                `;
                
                // 计算分页
                const startIndex = (currentPage - 1) * resultsPerPage;
                const endIndex = Math.min(startIndex + resultsPerPage, data.length);
                
                // 添加当前页的动作卡片
                data.slice(startIndex, endIndex).forEach(action => {
                    resultsHTML += createActionCard(action);
                });
                
                // 添加分页控件
                if (data.length > resultsPerPage) {
                    resultsHTML += createPagination(data.length, resultsPerPage, currentPage);
                }
                break;
                
            case 'muscle':
                // 按肌肉群组查询
                if (queryParams.muscle && data[queryParams.muscle]) {
                    const muscleActions = data[queryParams.muscle];
                    resultsHTML = `
                        <div class="results-options">
                            <div class="results-summary">在"${queryParams.muscle}"分类下找到 ${muscleActions.length} 个动作</div>
                            <div class="results-count-selector">
                                <label for="results-per-page">每页显示:</label>
                                <select id="results-per-page">
                                    <option value="10" ${resultsPerPage === 10 ? 'selected' : ''}>10个</option>
                                    <option value="20" ${resultsPerPage === 20 ? 'selected' : ''}>20个</option>
                                    <option value="50" ${resultsPerPage === 50 ? 'selected' : ''}>50个</option>
                                    <option value="100" ${resultsPerPage === 100 ? 'selected' : ''}>100个</option>
                                </select>
                            </div>
                        </div>
                        <div id="muscle-results" class="dynamic-results"></div>
                    `;
                    
                    // 计算分页
                    const startIdx = (currentPage - 1) * resultsPerPage;
                    const endIdx = Math.min(startIdx + resultsPerPage, muscleActions.length);
                    
                    // 加载当前页的动作
                    loadActionDetails(muscleActions.slice(startIdx, endIdx), 'muscle-results');
                    
                    // 添加分页控件
                    if (muscleActions.length > resultsPerPage) {
                        resultsHTML += createPagination(muscleActions.length, resultsPerPage, currentPage);
                    }
                } else {
                    resultsHTML = '<div class="no-results">未找到该肌肉群组的动作</div>';
                }
                break;
                
            case 'equipment':
                // 按器材查询
                if (queryParams.equipment && data[queryParams.equipment]) {
                    const equipmentActions = data[queryParams.equipment];
                    resultsHTML = `
                        <div class="results-options">
                            <div class="results-summary">在"${queryParams.equipment}"分类下找到 ${equipmentActions.length} 个动作</div>
                            <div class="results-count-selector">
                                <label for="results-per-page">每页显示:</label>
                                <select id="results-per-page">
                                    <option value="10" ${resultsPerPage === 10 ? 'selected' : ''}>10个</option>
                                    <option value="20" ${resultsPerPage === 20 ? 'selected' : ''}>20个</option>
                                    <option value="50" ${resultsPerPage === 50 ? 'selected' : ''}>50个</option>
                                    <option value="100" ${resultsPerPage === 100 ? 'selected' : ''}>100个</option>
                                </select>
                            </div>
                        </div>
                        <div id="equipment-results" class="dynamic-results"></div>
                    `;
                    
                    // 计算分页
                    const startIdx = (currentPage - 1) * resultsPerPage;
                    const endIdx = Math.min(startIdx + resultsPerPage, equipmentActions.length);
                    
                    // 加载当前页的动作
                    loadActionDetails(equipmentActions.slice(startIdx, endIdx), 'equipment-results');
                    
                    // 添加分页控件
                    if (equipmentActions.length > resultsPerPage) {
                        resultsHTML += createPagination(equipmentActions.length, resultsPerPage, currentPage);
                    }
                } else {
                    resultsHTML = '<div class="no-results">未找到该器材类型的动作</div>';
                }
                break;
        }
        
        resultsDiv.innerHTML = resultsHTML;
        
        // 绑定分页事件
        document.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.dataset.page) {
                    currentPage = parseInt(this.dataset.page);
                    displayResults(lastQueryData, queryParams);
                    // 滚动到顶部
                    window.scrollTo({
                        top: document.querySelector('.results-section').offsetTop - 20,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // 绑定每页结果数选择事件
        const resultsPerPageSelect = document.getElementById('results-per-page');
        if (resultsPerPageSelect) {
            resultsPerPageSelect.addEventListener('change', function() {
                resultsPerPage = parseInt(this.value);
                currentPage = 1; // 重置到第一页
                displayResults(lastQueryData, queryParams);
            });
        }
        
        // 添加淡入效果
        setTimeout(() => {
            document.querySelectorAll('.action-card').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 50); // 减少延迟，加快动画速度
            });
        }, 100);
        
        // 绑定图片预览事件
        setTimeout(() => {
            document.querySelectorAll('.image-preview').forEach(img => {
                img.addEventListener('click', function() {
                    const modalImg = document.querySelector('.modal-content img');
                    modalImg.src = this.src;
                    modalImg.alt = this.alt;
                    imageModal.classList.add('active');
                });
            });
        }, 500);
    }
    
    // 创建分页控件
    function createPagination(totalItems, itemsPerPage, currentPage) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        let paginationHTML = '<div class="pagination-controls">';
        
        // 上一页按钮
        if (currentPage > 1) {
            paginationHTML += `<button class="pagination-btn" data-page="${currentPage - 1}">上一页</button>`;
        }
        
        // 页码按钮
        const maxVisiblePages = 5; // 最多显示5个页码
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // 调整起始页，确保显示足够的页码
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // 第一页按钮
        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" data-page="1">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }
        
        // 页码按钮
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        
        // 最后一页按钮
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
            paginationHTML += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
        }
        
        // 下一页按钮
        if (currentPage < totalPages) {
            paginationHTML += `<button class="pagination-btn" data-page="${currentPage + 1}">下一页</button>`;
        }
        
        paginationHTML += '</div>';
        return paginationHTML;
    }
    
    // 加载动作详情
    function loadActionDetails(actionIds, targetElementId) {
        fetch(`${BASE_URL}/actions_by_id.json`)
            .then(resp => resp.json())
            .then(actionData => {
                let cardsHTML = '';
                actionIds.forEach((actionId, index) => {
                    if (actionData[actionId]) {
                        const actionCard = createActionCard(actionData[actionId]);
                        cardsHTML += actionCard;
                    }
                });
                
                const targetElement = document.getElementById(targetElementId);
                if (targetElement) {
                    targetElement.innerHTML = cardsHTML;
                    
                    // 添加淡入效果
                    setTimeout(() => {
                        targetElement.querySelectorAll('.action-card').forEach((card, index) => {
                            setTimeout(() => {
                                card.classList.add('visible');
                            }, index * 50); // 减少延迟，加快动画速度
                        });
                    }, 100);
                    
                    // 绑定图片预览事件
                    setTimeout(() => {
                        targetElement.querySelectorAll('.image-preview').forEach(img => {
                            img.addEventListener('click', function() {
                                const modalImg = document.querySelector('.modal-content img');
                                modalImg.src = this.src;
                                modalImg.alt = this.alt;
                                imageModal.classList.add('active');
                            });
                        });
                    }, 500);
                }
            })
            .catch(error => {
                console.error('加载动作详情出错:', error);
                const targetElement = document.getElementById(targetElementId);
                if (targetElement) {
                    targetElement.innerHTML = '<div class="error">加载动作详情失败</div>';
                }
            });
    }
    
    // 创建动作卡片HTML
    function createActionCard(action) {
        if (!action) return '';
        
        console.log('动作数据:', action);
        
        // 获取动作ID
        const actionId = action.id;
        
        // 根据正确规则构建图片路径
        const gifPath = actionId ? `${BASE_URL}/images/actions/${actionId}/action_1.gif` : '';
        const musclePath = actionId ? `${BASE_URL}/images/muscles/${actionId}/muscle_1.jpg` : '';
        
        return `
            <div class="action-card">
                <div class="action-header">
                    <h3>${action.action_name || '未命名动作'}</h3>
                    <div>ID: ${actionId || 'N/A'}</div>
                </div>
                <div class="action-details">
                    <div class="action-info">
                        <p><strong>锻炼部位:</strong> ${action.exercise_parts || action.fitness_areas?.join(', ') || '未指定'}</p>
                        <p><strong>器材:</strong> ${action.equipment || '未指定'}</p>
                        <p><strong>难度:</strong> ${action.difficulty || '未指定'}</p>
                        <p><strong>动作说明:</strong> ${action.desc || '无说明'}</p>
                    </div>
                    <div class="action-media">
                        ${gifPath ? `
                            <div class="image-container">
                                <img src="${gifPath}" class="image-preview" alt="${action.action_name}动作演示" 
                                     title="点击放大查看" onerror="this.onerror=null;this.alt='图片加载失败';this.parentNode.classList.add('image-error');">
                                <div class="loading-overlay">加载中...</div>
                            </div>
                        ` : ''}
                        ${musclePath ? `
                            <div class="image-container">
                                <img src="${musclePath}" class="image-preview" alt="${action.action_name}肌肉示意图" 
                                     title="点击放大查看" onerror="this.onerror=null;this.alt='图片加载失败';this.parentNode.classList.add('image-error');">
                                <div class="loading-overlay">加载中...</div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }
}); 