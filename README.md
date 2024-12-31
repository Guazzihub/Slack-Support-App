# Slack Support App

Slack Support App is a Node.js application designed to assist with support and channel management within your Slack workspace. The app provides interactive options to handle support requests, channel modifications, and feedback submissions efficiently.

## Features

- **Interactive Buttons:** Users can interact with buttons to:
  - Submit feedback or suggestions.
  - Request support.
  - Add, update, or delete channels.
- **Modals for Input:** Opens modals for users to input their requests.
- **Support Channel Integration:** Routes all support tickets to a specified channel.
- **Simple Setup:** Easy to configure.

## Setup and Installation

### Prerequisites

1. **Node.js:** Ensure you have Node.js (version 14 or higher) installed.
2. **Slack App:** You can create the Slack app using the provided `manifest.json` file:
   - Go to your Slack workspace's app management page.
   - Select "Create New App" and choose the "From manifest" option.
   - Paste the contents of `manifest.json` to automatically configure the app.

### Managing Environment Variables

The app requires certain credentials and configurations to be set in `.env` file.

### Installation

1. Download the repository:

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Bot

Start the bot in Socket Mode:

```bash
node index.js
```

The bot will log "⚡️ App is running in socket mode!" when successfully started.

## Usage

1. **Mention the Bot in Slack:**
   - The bot responds with interactive buttons for feedback, support, or channel management.
2. **Interact with the Modals:**
   - Each action opens a modal for user input.
3. **Receive Tickets in the Support Channel:**
   - All tickets are routed to the channel specified in `SUPPORT_CHANNEL_ID`.

## Project Structure

```
app/
├── .env                 # Environment variables
├── index.js             # App logic
├── manifest.json        # Slack app configuration
├── package.json         # Dependencies and scripts
```

## Contribution

Contributions are welcome! Feel free to open issues or submit pull requests.
