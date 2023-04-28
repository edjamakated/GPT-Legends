<?PHP
function getGPT4Response($legend, $message1, $message2, $api_key = null)
{
    if ($api_key === null) {
        $api_key = "sk-putYourKeyHere";
    }
    $api_url = 'https://api.openai.com/v1/chat/completions';

    $headers = [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $api_key,
    ];

    $data = [
        'model' => 'gpt-4',
        'messages' => [
            ['role' => 'system', 'content' => "You are a conversational chat bot that acts like the famous person $legend. Use a lot of their common expressions, phrases, lyrics, and style. Keep it succinct, preferably no more than 3 sentences."],
            ['role' => 'assistant', 'content' => $message1],
            ['role' => 'user', 'content' => $message2],
        ],
        'temperature' => 0.5,
        'max_tokens' => 1550,
        'top_p' => 1,
        'frequency_penalty' => 0,
        'presence_penalty' => 0,
    ];

    $ch = curl_init($api_url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    $response = curl_exec($ch);

    if ($response === false) {
        throw new Exception('Error retrieving response from GPT-4: ' . curl_error($ch));
    }

    curl_close($ch);

    $response_data = json_decode($response, true);

    if (isset($response_data['choices'][0]['message']['content'])) {
        return $response_data['choices'][0]['message']['content'];
    } else {
        throw new Exception('Error: No response from GPT-4');
    }
}

if (isset($_GET['message1']) && isset($_GET['message2']) && isset($_GET['legend'])) {
    try {
        $user_message = htmlspecialchars($_GET['message1']);
        $second_message = htmlspecialchars($_GET['message2']);
        $legend = htmlspecialchars($_GET['legend']);

        $gpt4_response = getGPT4Response($legend, $user_message, $second_message);
        echo $gpt4_response;
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage();
    }
} else {
    echo "Error: Missing input parameters.";
}
?>
