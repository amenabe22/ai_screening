import React from 'react';
import { Card, Form, Input, Button, message, Spin, Divider, Checkbox } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { AuthWrapper } from './AuthWrapper';
import { FcGoogle } from 'react-icons/fc'
import { login, signupWithFirebase } from "../../apis";
import { isAxiosError } from "../../utils/helpers.ts";
import { LoginDTO } from "../../types";
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { firebaseAuth } from "../../helpers/firebase.ts";

function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const loginWithGoogle = useGoogleLogin({
    onSuccess: tokenResponse => console.log("TOKEN: ", tokenResponse),
  });

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider(); // Google Auth provider instance

    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      console.log('Firebase ID Token:', idToken);

      firebaseAuthMutation.mutate({ token: idToken });
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      message.error('Google Sign-In failed. Please try again.');
    }
  };

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data: LoginDTO) => {
      message.success('Login successful');
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/dashboard');
    },
    onError: () => {
      message.error('Invalid email or password');
    },
  });

  const firebaseAuthMutation = useMutation({
    mutationKey: ['firebase-auth'],
    mutationFn: signupWithFirebase,
    onSuccess: (data) => {
      console.log("DATA: ", data);
      message.success('Sign in with Google successful!');
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/dashboard');
    },
    onError: (error) => {
      console.log("ERROR: ", error);
      message.error('Sign in with Google failed. Please try again.');
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await form.validateFields();

    loginMutation.mutate({
      email: form.getFieldValue('email'),
      password: form.getFieldValue('password'),
    })
  };

  return (
    <AuthWrapper>
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="w-full max-w-md p-6 bg-white rounded-lg">
          <div className='signup-header space-y-5 mb-6'>
            <h2>AI Screening Platform</h2>
            <h1 className="mb-4 text-5xl font-bold">
              Welcome Back!
            </h1>
            <h2 className='text-sm font-light mb-4'>Welcome Back! Please enter your details</h2>
          </div>

          <Form
            form={form}
            layout="vertical"
            onSubmitCapture={handleSubmit}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input size="large" placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password size="large" placeholder="Enter your password" />
            </Form.Item>

            {!loginMutation?.isPending && loginMutation?.error && (
              <Form.Item>
                <p className="text-red-500 text-sm">{isAxiosError(loginMutation.error) ? loginMutation?.error?.response?.data?.message : loginMutation?.error?.message}</p>
              </Form.Item>
            )}

            {loginMutation?.isPending && (
              <div className="flex justify-center mb-4">
                <Spin size="large" />
              </div>
            )}

            <div className='flex justify-between items-center my-4'>
              <Checkbox>Remember me</Checkbox>
              <Link to="/forgot-password" className="text-blue-600 font-medium">Forgot Password?</Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loginMutation.isPending}
              >
                Sign In
              </Button>
              <Button onClick={() => handleGoogleSignIn()} className='mt-4' type="default" icon={<FcGoogle fontSize={20} />} block>
                Sign in with Google
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-8">
            <p>
              Don't have an account? <Link to="/signup" className="text-blue-600 font-medium">Sign up</Link>
            </p>
            {/*<p>*/}
            {/*  Looking for a job? <Link to="/candidate" className="text-blue-600 font-medium">Click here</Link>*/}
            {/*</p>*/}
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}

export default Login;
