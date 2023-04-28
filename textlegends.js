$(document).ready(() => {
    const openSettingsButton = $("#open-settings");
    const toggleDebugButton = $("#toggle-debug");
    const legendForm = $("#legend-form");
    const settingsModal = new bootstrap.Modal($("#settingsModal")[0]);

    let conversationInterval;
    let isRunning = false;

    displayMessage('assistant', 'TextLegends Creator', `Welcome to TextLegends, please pick two legends and a topic in settings and start the conversation. This should be interesting... Let me know if you have any feedback. Thanks!`);

    setTimeout(function() {
        $('#settingsModal').modal('show');
      }, 5000);

    openSettingsButton.on("click", () => {
        if (!settingsModal.is(":visible")) {
            settingsModal.show();
        }
    });

    toggleDebugButton.on("click", () => {
        toggleDebug();
    });

    legendForm.on("submit", (event) => {
        event.preventDefault();
        toggleConversation();
    });

    function toggleConversation() {
        isRunning ? stopConversation() : startConversation();
        isRunning = !isRunning;
    }

    function startConversation() {
        const legend1 = $('#legend1').val().trim();
        const legend2 = $('#legend2').val().trim();
        const topic = $('#topic').val().trim();

        if (legend1 === '' || legend2 === '' || topic === '') return;
        clearChat();
        displayMessage('assistant', 'TextLegends', `Initiated a Conversation between "${legend1}" and "${legend2}" discussing the topic "${topic}"`);
        initiateDialogue(legend1, legend2, topic);
        $('#start-stop-button').text('Stop Conversation');
    }

    function stopConversation() {
        clearInterval(conversationInterval);
        $('#start-stop-button').text('Start Conversation');
    }

    function clearChat() {
        $('#chat-container').html('');
    }

    // Improved initiateDialogue function
    async function initiateDialogue(legend1, legend2, topic) {
        async function delay(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }

        async function getResponse(legend, message1, message2) {
            return sendApiRequest(legend, message1, message2);
        }
        async function getSummary(chatHistoryLog) {
            return sendApiSummary(chatHistoryLog);
        }

        try {
            await delay(4500);
            const response1 = await getResponse(legend1, `You are ${legend1}. Discuss the topic "${topic}" with ${legend2}.`);
            displayMessage('assistant', legend1, response1);
            await delay(12250);
            const response2 = await getResponse(legend2, `You are ${legend2}. Respond with 1-3 sentences to ${legend1} regarding the topic "${topic} using the style of ${legend2}". ${response1}`, `${legend1}: Let's talk about ${topic}`);
            displayMessage('assistant', legend2, response2);

            let counter = 2;

            conversationInterval = setInterval(async () => {
                const currentLegend = counter % 2 === 0 ? legend1 : legend2;
                const oppositeLegend = counter % 2 === 0 ? legend2 : legend1;
                const previousResponse = getLastAssistantResponse();

                await delay(3300);

                const response = await getResponse(
                    currentLegend,
                    `You are ${currentLegend}. Continue discussing the topic "${topic}" using succinct responses with ${oppositeLegend}. ${previousResponse}`,
                    `${oppositeLegend}: ${previousResponse}`
                );

                displayMessage('assistant', currentLegend, response);

                counter++;

                if (counter > 5) {

                    const chatHistory = $('#chat-container').text();
                    var thisSummary = getSummary(chatHistory);
                    displayMessage('assistant', 'TextLegends', `Ended the Conversation between "${legend1}" and "${legend2}" discussing the topic "${topic}. Here is a summary: ${thisSummary} "`);
                    console.log("The 10 iterations have completed");
                    clearInterval(conversationInterval);
                }
            }, 12250);
        } catch (error) {
            console.error('Error in initiateDialogue:', error);
        }
    }

    function getLastAssistantResponse() {
        const previousResponses = $('.assistant');
        return previousResponses[previousResponses.length - 1].textContent;
    }
    async function sendApiRequest(legend, message1, message2 = message1) {
        const apiKey = $('#api-key').val();
        try {
            const response = await axios.get('textlegends.php', {
                params: {
                    legend: legend,
                    message1: message1,
                    message2: message2,
                    api_key: apiKey
                },
                timeout: 12250
            });

            displayDebugInfo(legend, `${message1}:${message2}`, response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching chatbot response:', error);
        }
    }
    async function sendApiSummary(chatLog) {
        try {
            const response = await axios.get('summarize.php', {
                params: {
                    conversation: chatLog
                },
                timeout: 22250
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching summary response:', error);
        }
    }
    $("#toggle-debug").click(function() {
        toggleDebug();
      });
    
      $("#copy-button").click(function() {
        copyChat();
      });

      async function copyChat() {
        const chatText = $('#chat-container').text();
      
        try {
          await navigator.clipboard.writeText(chatText);
          alert('Chat text copied to clipboard!');
        } catch (err) {
          console.error('Failed to copy text: ', err);
        }
      }
      

    function displayMessage(role, name, message) {
        displayDebugInfo(name, name, message);
        const chatContainer = $('#chat-container');
        const messageLine = $('<div>').addClass('message-line');
        const nameElement = $('<div>').addClass('name').text(name + ':');
        messageLine.append(nameElement);
        const messageElement = $('<div>').addClass('message').addClass(role).text(message);
        messageLine.append(messageElement);
        chatContainer.append(messageLine);
        chatContainer.scrollTop(chatContainer[0].scrollHeight);
    }

    function displayDebugInfo(legend, message, response) {
        const debugContainer = $('#debug-container');
        const debugInfo = $('<pre>').text(`Legend: ${legend}\nMessage: ${message}\nResponse: ${response}\n---\n`);
        debugContainer.append(debugInfo);
        debugContainer.scrollTop(debugContainer[0].scrollHeight);
    }

    function toggleDebug() {
        const debugContainer = $('#debug-container');
        const toggleDebugButton = $('#toggle-debug');

        if (debugContainer.css('display') === 'none') {
            debugContainer.css('display', 'block');
            toggleDebugButton.text('Hide Debug');
        } else {
            debugContainer.css('display', 'none');
            toggleDebugButton.text('Show Debug');
        }
    }
});
