import React from 'react';
import { Card, Form, Input, Button, message, Spin, Divider, Checkbox } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useSignIn } from '@clerk/clerk-react';
import { AuthWrapper } from './AuthWrapper';
import { FcGoogle } from 'react-icons/fc'
import emailIcon from '../../assets/images/email-icon.png'
import featuredIcon from '../../assets/images/Featured icon.png'
import { ArrowLeft } from 'lucide-react';
import { forgotPassword } from "../../apis";
import LoadingSpinner from "../../components/common/LoadingSpinner.tsx";

function ForgotPassword() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [emailSend, setEmailSend] = React.useState(false);

    const mutateForgotPassword = useMutation({
        mutationKey: ['forgot-password'],
        mutationFn: forgotPassword,
        onSuccess: (data) => {
            console.log(data);
            message.success("Password reset link sent successfully to your email");
            setEmailSend(true);
        },
        onError: (err) => {
            console.log(err);
            message.error("Failed to send password reset link to your email");
        }
    })

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        await form.validateFields();

        sendEmail();
    }

    const sendEmail = () => {
        mutateForgotPassword.mutate({
            email: form.getFieldValue('email')
        })
    }

    if (emailSend) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <div className="w-full max-w-md p-6 bg-white rounded-lg">
                    <div className='forgot-header flex flex-col text-center gap-2 mb-6'>
                        <h2>AI Screening Platform</h2>
                        <h1 className="text-3xl font-bold">
                            Check your email
                        </h1>
                        <h2 className='text-sm font-light mb-4'>We sent a password reset link to {form.getFieldValue('email')}</h2>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                    >


                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                block

                            >
                                Open Email App
                            </Button>
                        </Form.Item>

                        <div className={'flex items-center justify-center'}>
                            {mutateForgotPassword.isPending && <Spin className={'mb-4'} />}
                        </div>
                    </Form>

                    <div className="text-center mt-8 flex items-center justify-center gap-3">
                        <p>
                            Didn't receive the email? <span><span onClick={sendEmail} className='text-blue-600 cursor-pointer'>Click to Resend</span></span>
                        </p>
                    </div>

                    <div className="text-center mt-8 flex items-center justify-center gap-3">
                        <ArrowLeft onClick={() => navigate('/login')}
                            className='cursor-pointer hover:text-slate-400 transition-all duration-300 text-black rounded-full' />
                        <p>
                            Back to login
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center">
            <div className="w-full max-w-md p-6 bg-white rounded-lg">
                <div className='forgot-header flex flex-col text-center gap-2 mb-6'>
                    <h2>AI Screening Platform</h2>
                    <h1 className="text-3xl font-bold">
                        Forgot Password?
                    </h1>
                    <h2 className='text-sm font-light mb-4'>No worries, we'll send you reset instructions</h2>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onSubmitCapture={handleResetPassword}
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

                    <div className={'flex items-center justify-center'}>
                        {mutateForgotPassword.isPending && <Spin className={'mb-4'} />}
                    </div>

                    <Form.Item>
                        <Button
                            disabled={mutateForgotPassword.isPending}
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                        >
                            Reset Password
                        </Button>
                    </Form.Item>
                </Form>

                <div className="text-center mt-8 flex items-center justify-center gap-3">
                    <ArrowLeft onClick={() => navigate('/login')}
                        className='cursor-pointer hover:text-slate-400 transition-all duration-300 text-black rounded-full' />
                    <p>
                        Back to login
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
