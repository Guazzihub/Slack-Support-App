require('dotenv').config();
const { App } = require('@slack/bolt');

// Initialize the Slack app in Socket mode
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true
});

// Respond to a mention with interactive buttons
app.event('app_mention', async ({ event, client }) => {
  try {
    await client.chat.postMessage({
      channel: event.channel,
      text: 'Hello! How can I assist you? Choose one of the options below:',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Hello! How can I assist you? Choose one of the options below:'
          }
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Feedback/Suggestions'
              },
              action_id: 'feedback_suggestion_action'
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Need help'
              },
              action_id: 'support_action'
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Add Channel'
              },
              action_id: 'add_channel_action'
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Update Channel'
              },
              action_id: 'update_channel_action'
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Delete Channel'
              },
              action_id: 'delete_channel_action'
            }
          ]
        }
      ]
    });
  } catch (error) {
    console.error('Error responding to mention:', error);
  }
});

// Action handlers for buttons
app.action('feedback_suggestion_action', async ({ ack, body, client }) => {
  await ack();
  openModal(client, body.trigger_id, 'Feedback/Suggestions', body.channel.id);
});

app.action('support_action', async ({ ack, body, client }) => {
  await ack();
  openModal(client, body.trigger_id, 'Support', body.channel.id);
});

app.action('add_channel_action', async ({ ack, body, client }) => {
  await ack();
  openModal(client, body.trigger_id, 'Add Channel', body.channel.id);
});

app.action('update_channel_action', async ({ ack, body, client }) => {
  await ack();
  openModal(client, body.trigger_id, 'Update Channel', body.channel.id);
});

app.action('delete_channel_action', async ({ ack, body, client }) => {
  await ack();
  openModal(client, body.trigger_id, 'Delete Channel', body.channel.id);
});

// Function to open a modal
async function openModal(client, trigger_id, title, channelId) {
  try {
    await client.views.open({
      trigger_id: trigger_id,
      view: {
        type: 'modal',
        callback_id: 'submit_modal',
        private_metadata: JSON.stringify({ title, channelId }),
        title: {
          type: 'plain_text',
          text: title
        },
        blocks: [
          {
            type: 'input',
            block_id: 'input_block',
            element: {
              type: 'plain_text_input',
              action_id: 'input_action'
            },
            label: {
              type: 'plain_text',
              text: 'Enter your message:'
            }
          }
        ],
        submit: {
          type: 'plain_text',
          text: 'Send'
        }
      }
    });
  } catch (error) {
    console.error('Error opening modal:', error);
  }
}

// Handler for modal submission
app.view('submit_modal', async ({ ack, body, view, client }) => {
  await ack();

  const message = view.state.values.input_block.input_action.value;
  const metadata = JSON.parse(view.private_metadata);
  const requestType = metadata.title;
  const sourceChannelId = metadata.channelId;
  const userId = body.user.id;
  const userName = body.user.name;
  const supportChannel = process.env.SUPPORT_CHANNEL_ID;


  try {
    // Send the message to the support channel
    await client.chat.postMessage({
      channel: supportChannel,
      text: `<!here> *${requestType}:* ${message} - *${userName}* (Source channel: <#${sourceChannelId}>)`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `<!here> *${requestType}:* ${message} - *${userName}* (Source channel: <#${sourceChannelId}>)`
          }
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Reply to User'
              },
              action_id: 'respond_person_action',
              value: userId // Requester user ID
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Reply in Channel'
              },
              action_id: 'respond_channel_action',
              value: sourceChannelId // source channel ID
            }
          ]
        }
      ]
    });

    // Send a confirmation message to the requester
    await client.chat.postMessage({
      channel: userId,
      text: `Hello, *${userName}*! Your *${requestType}* request has been received and will be addressed soon. Thank you for reaching out!`
    });
  } catch (error) {
    console.error('Error sending confirmation or message to support channel:', error);
  }
});

// Handler for "Reply to User" button
app.action('respond_person_action', async ({ ack, body, client }) => {
  await ack();

  const userId = body.actions[0].value;

  try {
    await client.views.open({
      trigger_id: body.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'response_person_modal',
        private_metadata: userId,
        title: {
          type: 'plain_text',
          text: 'Reply to Requester'
        },
        blocks: [
          {
            type: 'input',
            block_id: 'response_block',
            element: {
              type: 'plain_text_input',
              action_id: 'response_input'
            },
            label: {
              type: 'plain_text',
              text: 'Enter your reply:'
            }
          }
        ],
        submit: {
          type: 'plain_text',
          text: 'Send Reply'
        }
      }
    });
  } catch (error) {
    console.error('Error opening reply modal:', error);
  }
});

// Handler for "Reply in Channel" button
app.action('respond_channel_action', async ({ ack, body, client }) => {
  await ack();

  const channelId = body.actions[0].value;

  try {
    await client.views.open({
      trigger_id: body.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'response_channel_modal',
        private_metadata: channelId,
        title: {
          type: 'plain_text',
          text: 'Reply in Channel'
        },
        blocks: [
          {
            type: 'input',
            block_id: 'response_block',
            element: {
              type: 'plain_text_input',
              action_id: 'response_input'
            },
            label: {
              type: 'plain_text',
              text: 'Enter your reply:'
            }
          }
        ],
        submit: {
          type: 'plain_text',
          text: 'Send Reply'
        }
      }
    });
  } catch (error) {
    console.error('Error opening channel reply modal:', error);
  }
});

// Handler for reply submission
app.view('response_person_modal', async ({ ack, body, view, client }) => {
  await ack();

  const responseMessage = view.state.values.response_block.response_input.value;
  const userId = view.private_metadata;

  try {
    await client.chat.postMessage({
      channel: userId,
      text: `You received a reply: ${responseMessage}`
    });
  } catch (error) {
    console.error('Error sending reply to requester:', error);
  }
});

app.view('response_channel_modal', async ({ ack, body, view, client }) => {
  await ack();

  const responseMessage = view.state.values.response_block.response_input.value;
  const channelId = view.private_metadata;

  try {
    await client.chat.postMessage({
      channel: channelId,
      text: `Support response: ${responseMessage}`
    });
  } catch (error) {
    console.error('Error sending reply to channel:', error);
  }
});

// Start the app in Socket mode
(async () => {
  await app.start();
  console.log('⚡️ App is running in socket mode!');
})();
