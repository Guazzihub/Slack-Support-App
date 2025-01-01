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

- **Node.js:** Ensure you have Node.js (version 14 or higher) installed.
- **Slack App:** You can create the Slack app using the provided `manifest.json` file:
   - Go to your Slack workspace's app management page.
   - Select "Create New App" and choose the "From manifest" option.
   - Paste the contents of `manifest.json` to automatically configure the app.

The app requires certain credentials and configurations to be set in a `.env` file. Create a `.env` file in the root directory with the following structure:

```env
# Slack credentials
SLACK_BOT_TOKEN=xoxb-...         # Your Slack bot token
SLACK_APP_TOKEN=xapp-...         # Your Slack app token
SLACK_SIGNING_SECRET=...         # Your Slack signing secret

# Support channel configuration
SUPPORT_CHANNEL_ID=...           # The ID of the channel where tickets will be routed
```

### Installation

1. Download the repository.

2. Install dependencies:
```bash
npm install
````

### Running the app

Start the app in Socket Mode:

```bash
node index.js
```

Invite the app to a Slack channel and mention it to trigger the app:

```bash
@your-app-name
```

The App will log "⚡️ App is running in socket mode!" when successfully started.

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
