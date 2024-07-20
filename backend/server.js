const express = require('express');
const path = require('path');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;
const secretKey = '1111';
const correctPassword = '1234';
const expiresIn = '1h';

// Serve static files from the frontend app
app.use(express.static(path.join(__dirname, 'dist')));

app.use(bodyParser.json());

// 生成token 验证密码
app.post('/api/authenticate', (req, res) =>{
    const password = req.body.password;
    if (password === correctPassword){
        const token = jwt.sign({ authorized: true }, secretKey, { expiresIn });
        res.json({token: token})
    }else {
        res.status(404).json({message: '口令验证失败',req: req})
    }
});

// 身份验证中间件
function authenticateToken(req, res, next){
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: '未提供身份验证令牌' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: '身份验证令牌无效' });
        }
        req.user = user; // 将解码后的用户信息添加到请求对象中
        next();
    });
}

// 根据请求路径动态获取存储目录
const getDestination = (req, file, cb) => {
    let uploadDir;
    if (req.path.startsWith('/api/notes')){
        uploadDir = './notes';
    }else if (req.path.startsWith('/api/blogs')){
        uploadDir = './blogs';
    }else if (req.path.startsWith('/api/others')){
        uploadDir = './others';
    }else{
        uploadDir = './works'
    }
    cb(null,uploadDir);
};

// 配置multer存储引擎
const storage = multer.diskStorage({
    destination: getDestination,
    filename: (req,file,cb) => {
        const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8'); // 处理中文文件名
        cb(null, originalName);
    }
})
const upload = multer({
    storage: storage
}).single('file');

//定义上传文件接口
app.post('/api/*', authenticateToken, (req,res) => {
    upload(req, res, (err) => {
        if (err){
            return res.status(500).json({ message: '文件上传失败', error: err });
        }
        // 返回虚拟 URL
        res.status(200).json({
            message: '文件上传成功',
            filename: req.file.filename,
            url: `/api/${req.params[0]}/${req.file.filename}`,
            file: req.file
        });
    })
})

// 提供静态文件服务
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// 获取目录下所有文件
function getFiles(directory){
    const notesDirectory = path.resolve(__dirname, directory);
    const files = fs.readdirSync(notesDirectory);

    const notes = files
        .filter(file => file.endsWith('.md'))
        .map(file => {
            const filePath = path.join(notesDirectory, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const stats = fs.statSync(filePath);
            return {
                filename: file,
                content: content,
                createdTime: stats.birthtime,
                modifiedTime: stats.mtime
            };
        });
    return notes;
}

// API 路由
app.get('/api/notes', (req, res) => {
    const notes = getFiles('notes');
    res.json(notes);
});

app.get('/api/blogs', (req, res) => {
    const blogs = getFiles('blogs');
    res.json(blogs);
});

app.get('/api/others', (req, res) => {
    const others = getFiles('others');
    res.json(others);
});

app.get('/api/notes/:filename', (req, res) => {
    const notesDirectory = path.resolve(__dirname, 'notes');
    const filePath = path.join(notesDirectory, req.params.filename);

    if (fs.existsSync(filePath) && filePath.endsWith('.md')) {
        const content = fs.readFileSync(filePath, 'utf-8');
        res.json({ content });
    } else {
        res.status(404).json({ error: '文件未找到' });
    }
});

app.get('/api/blogs/:filename', (req, res) => {
    const notesDirectory = path.resolve(__dirname, 'blogs');
    const filePath = path.join(notesDirectory, req.params.filename);

    if (fs.existsSync(filePath) && filePath.endsWith('.md')) {
        const content = fs.readFileSync(filePath, 'utf-8');
        res.json({ content });
    } else {
        res.status(404).json({ error: '文件未找到' });
    }
});

app.get('/api/others/:filename', (req, res) => {
    const notesDirectory = path.resolve(__dirname, 'others');
    const filePath = path.join(notesDirectory, req.params.filename);

    if (fs.existsSync(filePath) && filePath.endsWith('.md')) {
        const content = fs.readFileSync(filePath, 'utf-8');
        res.json({ content });
    } else {
        res.status(404).json({ error: '文件未找到' });
    }
});



// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});