import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import {ReactQueryDevtools} from 'react-query/devtools';
import Dashboard from '../../views/dashboard';
import { useAuth } from '../../context/AuthProvider';

const App = () => {
  const navigate = useNavigate();
  const queryClient = new QueryClient();
  const { user, setUser } = useAuth();

  useEffect(() => {
    if(user == undefined){
      navigate('/login');
    }
  }, [navigate]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {user && <Dashboard />}
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right"/>
      </QueryClientProvider>
    </>
  );
};

export default App;
