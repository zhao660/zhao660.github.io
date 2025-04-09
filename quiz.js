document.addEventListener('DOMContentLoaded', () => {
    const questionElement = document.getElementById('question');
    const answerElement = document.getElementById('answer');
    const submitButton = document.getElementById('submit');
    const evaluationElement = document.getElementById('evaluation');
    const retryButton = document.getElementById('retry');

    let currentQuestion = '';

    function getNewQuestion() {
        answerElement.value = '';
        evaluationElement.textContent = '';

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
            currentQuestion = response.data.choices[0].message.content;
            questionElement.textContent = currentQuestion;
        })
       .catch(error => {
            console.error('获取题目失败:', error);
            questionElement.textContent = '获取题目失败，请稍后再试';
        });
    }

    getNewQuestion();

    submitButton.addEventListener('click', () => {
        const userAnswer = answerElement.value.trim();
        if (userAnswer === '') {
            alert('请输入答案！');
            return;
        }

        axios.post('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
            model: "glm-4",
            messages: [
                { "role": "user", "content": `题目：${currentQuestion}，答案：${userAnswer}，请评价这个答案` }
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

    retryButton.addEventListener('click', getNewQuestion);
});
