const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const md5 = require('md5');
const pty = require('node-pty');
const query = require('./db');
var mysql = require('mysql');
const router = express.Router();
const app = express();
const expressWs = require('express-ws')(app);


app.use(session({
	secret: '344c378a9db7f8d16b29618ce7f7d8c4',
	saveUninitialized: true,
	resave: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

var sess; // global session, NOT recommended
const filter = (raw) => {
    const reg = /\s/
    if(raw.match(reg)){
        return true;
    }
    return false;
}

expressWs.app.ws('/shell', (ws, req) => {
	// Spawn the shell
	// Compliments of http://krasimirtsonev.com/blog/article/meet-evala-your-terminal-in-the-browser-extension
	let ptyProcess = pty.spawn('bash', [], {
		name: 'xterm-color',
		cwd: '/tmp',
		env: {},
        uid: 65534,
        gid: 65534
	});

	// For all shell data send it to the websocket
	ptyProcess.on('data', data => {
		console.log(data);
		ws.send(data);
	});
	// For all websocket data send it to the shell
	ws.on('message', (msg) => {
		ptyProcess.write(msg);
	});
});


router.get('/', (req, res) => {
	sess = req.session;
	if (sess.islogin) {
		return res.sendFile(__dirname + '/dist/index.html');
	}
	res.redirect('/login');
});

router.get('/login', (req, res) => {
	return res.sendFile(__dirname + '/dist/login.html');
});

router.post('/login', async (req, res) => {
    if(filter(req.body.username)){
        res.json({
            message: "space is very quiet",
		    result: -1
        })
    }
	let sql = `select username,password from user where username='${req.body.username}' and password='${md5(req.body.password)}';`;

	let r = await query(sql).catch(err => {
		res.json({
			message: "db error",
			result: -1
		});
	});
	console.log(r);
	if (Array.isArray(r) && r.length === 1) {
		sess = req.session;
		sess.islogin = true;
		res.json({
			message: "ok",
			result: 1
		})
	} else {
		res.json({
			message: "something wrong",
			result: -1
		});
	}
});

router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			return console.log(err);
		}
		res.redirect('/');
	});

});

app.use('/', router);
app.use(express.static(__dirname + '/dist'));

app.listen(8000);
