import { lazy } from 'react';
import Loader from '../components/common/Loader';

const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Product = lazy(() => import('../pages/Product'));
const Signup = lazy(() => import('../pages/Signup'));
const Blogs = lazy(() => import('../pages/Blogs'));
const PreCheckout = lazy(() => import('../pages/PreCheckout'));
const BlogPost = lazy(() => import('../pages/BlogPost'));
const NotFound = lazy(() => import('../pages/404'));

export const publicRoutes = [
 { path: '/', element: <Home /> },
 { path: '/login', element: <Login /> },
 { path: '/register', element: <Signup /> },
 { path: '/product/:id/:variation', element: <Product /> },
 { path: '/blogs', element: <Blogs /> },
 { path: '/blogs/:id', element: <BlogPost /> },
 { path: '/loader', element: <Loader /> },
 { path: '/*', element: <NotFound /> },
];

export const authRoutes = [{ path: '/checkout', element: <PreCheckout /> }];
