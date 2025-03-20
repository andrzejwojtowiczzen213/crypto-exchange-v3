import { createBrowserRouter } from 'react-router-dom';
import Container from './components/Container';
import Checkout from './components/Checkout';
import Status from './components/Status';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Container />,
  },
  {
    path: '/checkout',
    element: <Checkout />,
  },
  {
    path: '/status',
    element: <Status />,
  },
]); 