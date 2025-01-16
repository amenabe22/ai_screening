import * as React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Form, Input, Button, Typography, message} from 'antd';
import {useMutation} from '@tanstack/react-query';
import api from '../../lib/axios';
import {AuthWrapper} from "./AuthWrapper.tsx";
import spotteoLogo from '../../assets/images/spotteo-logo.png'
import {FcGoogle} from 'react-icons/fc'
import {signupRecruiter, signupWithFirebase} from "../../apis";
import emailIcon from "../../assets/images/email-icon.png";
import {ArrowLeft} from "lucide-react";
import {isAxiosError} from "../../utils/helpers.ts";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {firebaseAuth} from "../../helpers/firebase.ts";

export default function Signup() {
    const [name, setName] = React.useState('');
    const [emailAddress, setEmailAddress] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [verifying, setVerifying] = React.useState(false);
    const [code, setCode] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();

    const {Title} = Typography;

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider(); // Google Auth provider instance

        try {
            const result = await signInWithPopup(firebaseAuth, provider);
            const user = result.user;
            const idToken = await user.getIdToken();

            console.log('Firebase ID Token:', idToken);

            firebaseAuthMutation.mutate({token: idToken});
        } catch (error) {
            console.error('Error during Google Sign-In:', error);
            message.error('Google Sign-In failed. Please try again.');
        }
    };

    const mutateRecruiterCreate = useMutation({
        mutationFn: signupRecruiter,
        onSuccess: () => {
            message.success('Account created successfully. Please check your email to verify your account.');
            setVerifying(true);
        },
        onError: () => {
            message.error('Failed to create recruiter');
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

    const handleSubmit = async () => {
        mutateRecruiterCreate.mutate({
            name,
            email: emailAddress,
            password,
        });
    };

    if (verifying) {
        return (
            <AuthWrapper>
                <div className="min-h-screen w-full flex items-center justify-center">
                    <div className="w-full max-w-md p-6 bg-white rounded-lg">
                        <div className='forgot-header flex flex-col text-center gap-2 mb-6'>
                            <img
                                src={emailIcon}
                                alt="Spotteo Logo"
                                className="h-20 self-center w-fit mb-4"
                            />
                            <h1 className="text-3xl font-bold">
                                Check your email
                            </h1>
                            <h2 className='text-sm font-light mb-4'>We have send a confirmation link to your email.</h2>
                        </div>

                        {/*<Form*/}
                        {/*    form={form}*/}
                        {/*    layout="vertical"*/}
                        {/*>*/}
                        {/*    <Form.Item>*/}
                        {/*        <Button*/}
                        {/*            type="primary"*/}
                        {/*            htmlType="submit"*/}
                        {/*            size="large"*/}
                        {/*            block*/}
                        {/*            onClick={() => {*/}
                        {/*                navigate('/setup-password');*/}
                        {/*            }}*/}
                        {/*        >*/}
                        {/*            Open Email App*/}
                        {/*        </Button>*/}
                        {/*    </Form.Item>*/}
                        {/*</Form>*/}

                        <div className="text-center mt-8 flex items-center justify-center gap-3">
                            <ArrowLeft onClick={() => navigate('/login')}
                                       className='cursor-pointer hover:text-slate-400 transition-all duration-300 text-black rounded-full'/>
                            <p>
                                Back to login
                            </p>
                        </div>
                    </div>
                </div>
            </AuthWrapper>
        );
    }

    return (
        <AuthWrapper>
            <div className="min-h-screen w-full flex items-center justify-center">
                <div className="w-full max-w-md p-6 bg-white rounded-lg">
                    <div className='signup-header space-y-5 mb-6'>
                        <img
                            src={spotteoLogo}
                            alt="Spotteo Logo"
                            className="mx-auto h-12 w-fit mb-4"
                        />
                        <h1 className="mb-4 text-5xl font-bold">
                            Signup
                        </h1>
                        <h2 className='text-sm font-light mb-4'>Start your 30 day free trial</h2>
                    </div>
                    <Form onFinish={handleSubmit} layout="vertical">
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {required: true, message: 'Please enter your name!'},
                            ]}
                        >
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Email Address"
                            name="email"
                            rules={[
                                {required: true, message: 'Please enter your email address!'},
                                {type: 'email', message: 'Please enter a valid email address!'},
                            ]}
                        >
                            <Input
                                value={emailAddress}
                                onChange={(e) => setEmailAddress(e.target.value)}
                                placeholder="Enter email address"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Create Password"
                            name="password"
                            rules={[{required: true, message: 'Please enter your password!'}]}
                        >
                            <Input.Password
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                            />
                        </Form.Item>
                        {mutateRecruiterCreate.isError && <div className='text-red-500 mb-4'>{isAxiosError(mutateRecruiterCreate.error) ? mutateRecruiterCreate?.error.response?.data.message : mutateRecruiterCreate?.error?.message}</div>}

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={mutateRecruiterCreate.isPending}>
                                Create Account
                            </Button>
                            <Button onClick={handleGoogleSignIn} className='mt-4' type="default" icon={<FcGoogle fontSize={20}/>} block
                                    loading={loading}>
                                Signup with Google
                            </Button>
                        </Form.Item>
                        {/*<div>*/}
                        {/*  <p>*/}
                        {/*    Looking for a job?{' '}*/}
                        {/*    <Link to="/candidate" className="text-blue-600 font-semibold">*/}
                        {/*      Click here*/}
                        {/*    </Link>*/}
                        {/*  </p>*/}
                        {/*</div>*/}
                        <div className="mt-2">
                            <p className={'text-center'}>
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-600 font-semibold">
                                    Log In
                                </Link>
                            </p>
                        </div>
                    </Form>
                </div>
            </div>
        </AuthWrapper>
    );
}
