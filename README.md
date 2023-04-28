# Text Legends (aka GPT-Legends)

Text Legends is a web application that allows you to simulate a conversation between two legendary figures or about a topic using a GPT-based AI chat model.

Use GPT api to conduct conversations with legendary figures on a specific topic using their style.

![Text Legends Preview](preview.png)

## Features

- Conversations between legendary figures
- Simulated discussions about various topics
- Real-time conversation simulation using GPT chat model
- Debug mode to display API requests and responses

## High-Level Overview
This project, named "Text Legends", is a web application that simulates conversations between famous historical figures using an AI language model (GPT). The user can select two legends and a topic for them to discuss, then the AI will generate a conversation based on those inputs.

The application consists of an HTML interface with some Bootstrap styling and two main components: the front-end JavaScript code and the back-end PHP code that interacts with the AI model.

The interface allows users to input two historical figures, a topic, and their API key (optional). The JavaScript code manages the conversation by sending requests to the AI model and displaying the responses in the chat container.

## Installation

1. Clone the repository:
https://github.com/edjamakated/GPT-Legends/

2. Set up your API Key and GPT chat model endpoint in `textlegends.php`.

3. Run the application using your preferred web server.

## Usage

1. Open the application in your browser.
2. Enter the names of two legendary figures and a topic for discussion.
3. Optionally, enter your API Key.
4. Click "Start Conversation" to simulate the conversation between the two figures.
5. Click "Show Debug" to display API requests and responses.

## Code Overview

1. The `getGPT4Response` function takes `legend`, `message1`, `message2`, and an optional `api_key` as arguments. If no `api_key` is provided, it uses the default key.
2. The function constructs the API request headers and data.
3. It initializes a cURL session to send a POST request to the API with the specified headers and data.
4. It processes the API response, returning the content or throwing an exception if an error occurs.
5. The main script checks for the required GET parameters and calls the `getGPT4Response` function.
6. It handles exceptions and outputs the result or an error message.

## Requirements

* PHP 7.0 or higher
* cURL extension enabled
* 
## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)
