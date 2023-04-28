document.addEventListener("DOMContentLoaded", function () {
    const openSettingsButton = document.getElementById("open-settings");
    const toggleDebugButton = document.getElementById("toggle-debug");
    const legendForm = document.getElementById("legend-form");
    const startStopButton = document.getElementById("start-stop-button");
    const settingsModal = new bootstrap.Modal(document.getElementById("settingsModal"));

    openSettingsButton.addEventListener("click", () => {
        settingsModal.show();
    });

    toggleDebugButton.addEventListener("click", () => {
        toggleDebug();
    });

    legendForm.addEventListener("submit", (event) => {
        event.preventDefault();
        toggleConversation();
    });

    let conversationInterval;
    let isRunning = false;

    function toggleConversation() {
        const startStopButton = document.querySelector('#start-stop-button');
        isRunning ? stopConversation() : startConversation();
        isRunning = !isRunning;
    }

    function startConversation() {
        const legend1 = document.querySelector('#legend1').value.trim();
        const legend2 = document.querySelector('#legend2').value.trim();
        const topic = document.querySelector('#topic').value.trim();

        if (legend1 === '' || legend2 === '' || topic === '') return;
        clearChat();
        displayMessage('assistant', 'TextLegends', `Initiated a Conversation between "${legend1}" and "${legend2}" discussing the topic "${topic}"`);
        initiateDialogue(legend1, legend2, topic);
        document.querySelector('#start-stop-button').textContent = 'Stop Conversation';
    }

    function stopConversation() {
        clearInterval(conversationInterval);
        document.querySelector('#start-stop-button').textContent = 'Start Conversation';
    }

    function clearChat() {
        document.querySelector('#chat-container').innerHTML = '';
    }

    // Improved initiateDialogue function
    async function initiateDialogue(legend1, legend2, topic) {
        // Helper function to delay execution for a specified amount of time
        async function delay(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }

        // Helper function to get a response from the API
        async function getResponse(legend, message1, message2) {
            return sendApiRequest(legend, message1, message2);
        }

        try {
            // Delay for 5.5 seconds
            await delay(5500);

            // Get the first response and display it
            const response1 = await getResponse(legend1, `You are ${legend1}. Discuss the topic "${topic}" with ${legend2}.`);
            displayMessage('assistant', legend1, response1);

            // Delay for 13.75 seconds
            await delay(13750);

            // Get the second response and display it
            const response2 = await getResponse(legend2, `You are ${legend2}. Respond with 1-3 sentences to ${legend1} regarding the topic "${topic} using the style of ${legend2}". ${response1}`, `${legend1}: Let's talk about ${topic}`);
            displayMessage('assistant', legend2, response2);

            let counter = 2;

            // Continue the conversation using setInterval
            const conversationInterval = setInterval(async () => {
                const currentLegend = counter % 2 === 0 ? legend1 : legend2;
                const oppositeLegend = counter % 2 === 0 ? legend2 : legend1;
                const previousResponse = getLastAssistantResponse();

                // Delay for 3.3 seconds
                await delay(3300);

                // Get the next response and display it
                const response = await getResponse(
                    currentLegend,
                    `You are ${currentLegend}. Continue discussing the topic "${topic}" using succinct responses with ${oppositeLegend}. ${previousResponse}`,
                    `${oppositeLegend}: ${previousResponse}`
                );

                displayMessage('assistant', currentLegend, response);

                counter++;

                // Stop the conversation after 10 iterations
                if (counter > 10) {
                    clearInterval(conversationInterval);
                }
            }, 16500); // Delay between conversation turns: 16.5 seconds

        } catch (error) {
            console.error('Error in initiateDialogue:', error);
        }
    }

    function getLastAssistantResponse() {
        const previousResponses = document.getElementsByClassName('assistant');
        return previousResponses[previousResponses.length - 1].textContent;
    }

    async function sendApiRequest(legend, message1, message2 = message1) {
        const apiKey = document.querySelector('#api-key').value;
        try {
            const response = await axios.get('textlegends.php', {
                params: {
                    legend: legend,
                    message1: message1,
                    message2: message2,
                    api_key: apiKey
                },
                timeout: 11111
            });

            displayDebugInfo(legend, `${message1}:${message2}`, response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching chatbot response:', error);
        }
    }

    function displayMessage(role, name, message) {
        displayDebugInfo(name, name, message);
        const chatContainer = document.querySelector('#chat-container');
        const messageLine = document.createElement('div');
        messageLine.classList.add('message-line');
        const nameElement = document.createElement('div');
        nameElement.classList.add('name');
        nameElement.textContent = name + ':';
        messageLine.appendChild(nameElement);
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', role);
        messageElement.textContent = message;
        messageLine.appendChild(messageElement);
        chatContainer.append(messageLine);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function displayDebugInfo(legend, message, response) {
        const debugContainer = document.querySelector('#debug-container');
        const debugInfo = document.createElement('pre');
        debugInfo.textContent = `Legend: ${legend}\nMessage: ${message}\nResponse: ${response}\n---\n`;
        debugContainer.append(debugInfo);
        debugContainer.scrollTop = debugContainer.scrollHeight;
    }
    function toggleDebug() {
        const debugContainer = document.getElementById('debug-container');
        const toggleDebugButton = document.getElementById('toggle-debug');

        if (debugContainer.style.display === 'none') {
            debugContainer.style.display = 'block';
            toggleDebugButton.textContent = 'Hide Debug';
        } else {
            debugContainer.style.display = 'none';
            toggleDebugButton.textContent = 'Show Debug';
        }
    }
});
