// 应用入口文件：挂载 React、注入全局样式与路由。
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter 负责为全局提供路由上下文 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
