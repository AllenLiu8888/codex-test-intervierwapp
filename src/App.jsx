// 应用根组件，仅负责挂载路由配置，保持结构简单明了。
import AppRoutes from './routes/AppRoutes.jsx';

export default function App() {
  // 将所有页面交给 React Router 统一管理。
  return <AppRoutes />;
}
