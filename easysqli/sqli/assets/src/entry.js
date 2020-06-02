import {
	Terminal
} from 'xterm';
import {
	FitAddon
} from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import {
	AttachAddon
} from 'xterm-addon-attach';

const fitAddon = new FitAddon();
// The terminal
const term = new Terminal();
// This kinda makes sense
const container = document.getElementById('terminal');
term.open(container);
// Open the websocket connection to the backend
const protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
const port = location.port ? `:${location.port}` : '';
const socketUrl = `${protocol}${location.hostname}${port}/shell`;
const socket = new WebSocket(socketUrl);
// Attach the socket to the terminal
const attachAddon = new AttachAddon(socket);
term.loadAddon(attachAddon);
term.loadAddon(fitAddon);
socket.onopen = _ => {socket.send("head /welcome.dat\n")};
fitAddon.fit();
