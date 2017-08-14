<?php
require_once __DIR__.'/vendor/autoload.php';
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

if (empty($_GET['repo']) || empty($_GET['name'])
	|| empty($_GET['port']) || empty($_GET['action'])
	|| empty($_GET['type']))
{
	die("Not enough parameters.</br></br>Usage: /?action=[deploy|remove]&repo=[git repo]&name=[container name]&port=[portnumber]&type=[tcp|udp]");
}

$connection = new AMQPStreamConnection('messenger', 5672, 'user', 'pass');
$channel = $connection->channel();

$channel->queue_declare('git_deploy', false, false, false, false);

$msg = new AMQPMessage(json_encode([
	"action" => $_GET['action'],
	"repository" => $_GET['repo'],
	"name" => $_GET['name'],
	"port" => intval($_GET['port']),
	"port_type" => $_GET['type']
]));

$channel->basic_publish($msg, '', 'git_deploy');

echo "Sent the command to deploy your container!  Check the console!";

?>
