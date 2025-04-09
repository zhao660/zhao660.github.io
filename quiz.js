document.addEventListener('DOMContentLoaded', () => {
    const questionElement = document.getElementById('question');
    const answerElement = document.getElementById('answer');
    const submitButton = document.getElementById('submit');
    const evaluationElement = document.getElementById('evaluation');
    const retryButton = document.getElementById('retry'); // 获取重新出题按钮

    // 重新出题函数
    function getNewQuestion() {
        // 清空答案和评价
        answerElement.value = '';
        evaluationElement.textContent = '';

        // 从智谱AI获取问题
        axios.post('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
            model: "glm-4",
            messages: [
                { "role": "user", "content": "请出一道关于毛泽东思想的题目" }
            ]
        }, {
            headers: {
                'Authorization': '48c37ffaf6ba5850b6515eb2212693b3.dMa1Gap3Qs2VoiO4'
            }
        })
       .then(response => {
            const question = response.data.choices[0].message.content;
            questionElement.textContent = question;
        })
       .catch(error => {
            console.error('获取题目失败:', error);
            questionElement.textContent = '获取题目失败，请稍后再试';
        });
    }

    // 初始加载时获取问题
    getNewQuestion();

    submitButton.addEventListener('click', () => {
        const userAnswer = answerElement.value.trim();
        if (userAnswer === '') {
            alert('请输入答案！');
            return;
        }

        // 从智谱AI获取评价
        axios.post('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
            model: "glm-4",
            messages: [
                { "role": "user", "content": `请评价以下关于毛泽东思想的答案：${userAnswer}` }
            ]
        }, {
            headers: {
                'Authorization': '48c37ffaf6ba5850b6515eb2212693b3.dMa1Gap3Qs2VoiO4'
            }
        })
       .then(response => {
            const evaluation = response.data.choices[0].message.content;
            evaluationElement.textContent = evaluation;
        })
       .catch(error => {
            console.error('获取评价失败:', error);
            evaluationElement.textContent = '获取评价失败，请稍后再试';
        });
    });

    // 重新出题按钮点击事件
    retryButton.addEventListener('click', getNewQuestion);
});