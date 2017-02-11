//TODO Musicbot

// The message event handles all messages
bot.on("message", m => {
	// A message containing exactly `&init` will make the bot join the first
	// available voice channel
	if (m.content === prefix + "join") {
		// Iterate over all channels
		for (var channel of m.channel.server.channels) {
			// If the channel is a voice channel, ...
			if (channel instanceof Discord.VoiceChannel) {
				// ... reply with the channel name and the ID ...
				bot.reply(m, channel.name + " - " + channel.id);
				// ... and join the channel
				bot.joinVoiceChannel(channel).catch(error);
				// Afterwards, break the loop so the bot doesn't join any other voice
				// channels
				break;
			}
		}
	}
	// A message starting with `$$$ stop` will stop the current playback
	if (m.content.startsWith(prefix + "stop")) {
		// If the voice connection exists (i.e. the bot is connected to a voice
		// channel) ...
		if (bot.internal.voiceConnection) {
			// ... stop the current playback
			bot.internal.voiceConnection.stopPlaying();
		}
		// Return to prevent execution of further commands
		return;
	}
	// A message starting with `$$$ leave` will make the bot leave the voice
	// channel it is connected to
	if (m.content.startsWith(prefix + "leave")) {
		// Leave the voice channel
		bot.internal.leaveVoiceChannel();
		// Return to prevent further commands
		return;
	}
	// A message starting with `$$$` and containing a file name will load the
	// specified file inside the hardcoded directory (see line 13) and play it
	// back over voice
	if (m.content.startsWith(prefix + "file")) {
		// Split the message by spaces...
		var rest = m.content.split(" ");
		// ...remove the first element (i.e. `$$$`)...
		rest.splice(0, 1);
		// ...and join the rest together using spaces. This returns the message
		// with the `$$$` removed
		rest = rest.join(" ");

		// If the bot is connected to voice...
		if (bot.voiceConnection) {
			// ...tell the user that you will play the file...
			bot.reply(m, "ok, I'll play that for you");
			// ...get the voice connection that is currently active...
			var connection = bot.internal.voiceConnection;
			// ...get the path from which to load the file (the hardcoded directory
			// concatenated with the argument to the command)...
			var filePath = LOADDIR + rest
			// ...and play the file
			connection.playFile(filePath);
		}
	}
	// A message starting with `pipeit` and containing a URL will load the
	// specified URL and play it back over voice
	if (m.content.startsWith(prefix + "pipeit")) {
		// Get the argument (see above)
		var rest = m.content.split(" ");
		rest.splice(0, 1);
		rest = rest.join(" ");

		// Make sure the bot is connected to voice
		if (bot.internal.voiceConnection) {
			// Get the voice connection...
			var connection = bot.internal.voiceConnection;
			// ...get the request module which will be used to load the URL...
			var request = require("request");
			// ...get the stream from the URL...
			var stream = request(rest);
			// ...and play it back
			connection.playRawStream(stream).then(intent => {
				// If the playback has started successfully, reply with a "playing"
				// message...
				bot.reply(m, "playing!").then((msg) => {
					// and add an event handler that tells the user when the song has
					// finished
					intent.on("end", () => {
						// Edit the "playing" message to say that the song has finished
						bot.updateMessage(msg, "that song has finished now.");
					});
				});
			});
		}
	}
});
});
