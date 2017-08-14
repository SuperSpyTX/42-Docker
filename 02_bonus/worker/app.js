var amqp = require('amqplib/callback_api');
var Docker = require("dockerode");
var docker = new Docker({socketPath: '/var/run/docker.sock'});
var exec = require('child-process-promise').exec;

// stderr is sent to stdout of parent process
// you can set options.stdio if you want it to go elsewhere

amqp.connect('amqp://user:pass@messenger', function(err, conn) {
	console.log(err);
	conn.createChannel(function(err, ch) {
		var q = 'git_deploy';

		ch.assertQueue(q, {durable: false});

		console.log("Waiting for messages in %s. To exit press CTRL+C", q);
		ch.consume(q, async function(msg) {
			var obj = JSON.parse(msg.content.toString());
			var action = obj.action;
			var repo_url = obj.repository;
			var port_type = obj.port_type;
			var name = obj.name;
			var port = obj.port;

			// FYI: Stopping the image gracefully before removing it is a better option.
			// But for the purposes of this demonstration, that won't be happening (no persistent data needed to save).
			console.log("Received message from the queue.. Container: " + name);
			if (action.match(/remove/) || action.match(/deploy/)) {
				try { await docker.getContainer('container-' + name).remove({'force': true}); console.log("Removed container"); } catch (error) { console.log("No removal of container necessary"); }
				try { await docker.getImage('git-' + name).remove({}); console.log("Removed image"); } catch (error) { console.log("No removal of image necessary"); }
			}
			if (action.match(/deploy/)) {
				console.log("Deploying container");
				await exec('git clone ' + repo_url + ' /tmp/' + name);
				var path = '/tmp/' + name;
				await exec('tar -C ' + path + ' -zcf /usr/src/worker/' + name + '.tar.gz .');
				var image = await docker.buildImage(name + '.tar.gz', {t: "git-" + name, "forcerm": true});
				console.log("Building image git-" + name + "...");
				docker.modem.followProgress(image, async function(err, output) {
					await exec('rm -rf ' + path + " && rm -f " + name + ".tar.gz");
					if (err) {
						console.log("Error while building image: " + error);
						return;
					}
					var po = port + "/" + port_type;
					var options = {
						Image: "git-" + name,
						name: "container-" + name,
						ExposedPorts: {},
						HostConfig: {
							PortBindings: {}
						}
					};
					options.ExposedPorts[po] = {};
					options.HostConfig.PortBindings[po] = [ { "HostPort": port.toString() } ];
					try {
						var container = await docker.createContainer(options);
					} catch (error)
					{
						console.log("Error Building Container: " + error);
					}
					try {
						await container.start(function (err, data) {
							console.log("Container " + name + " has started successfully!");
						});
					} catch (error){}
				});
			}
			//console.log(" [x] Using repository %s", JSON.parse(msg.content.toString()).repository);
		}, {noAck: true});
	});
});
