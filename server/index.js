const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// 使用CORS中间件
app.use(cors());

// 解析JSON请求体
app.use(express.json());

// 路由
const userRouter = require('./routes/user');
const medicalDataRouter = require('./routes/medicalData'); // 确保导入了medicalData路由
const policyRouter = require('./routes/policy');
const accessControlRouter = require('./routes/accessControl');

app.use('/api/user', userRouter);
app.use('/api/medicalData', medicalDataRouter); // 确保正确使用了路由
app.use('/api/policy', policyRouter);
app.use('/api/accessControl', accessControlRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
