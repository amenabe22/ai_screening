import React from 'react';
import { Card, Form, Input, Button, message, Spin, Divider, Checkbox } from 'antd';
import { useMutation } from '@tanstack/react-query';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import featuredIcon from '../../assets/images/Featured icon.png'
import successIcon from '../../assets/images/success-icon.png'
import { ArrowLeft } from 'lucide-react';
import {resetPassword} from "../../apis";

function SetupPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    console.log("TOKEN: ", searchParams.get('token'));

    const [form] = Form.useForm();
    const [resetSuccess, setResetSuccess] = React.useState(false);

    const mutateResetPassword = useMutation({
        mutationKey: ['reset-password'],
        mutationFn: resetPassword,
        onSuccess: (data) => {
            console.log(data);
            message.success("Password has been reset successfully. You can now log in using your new password.");
            setResetSuccess(true);
        },
        onError: (err) => {
            console.log(err);
            message.error("Something went wrong. Please try again.");
        }
    });

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        await form.validateFields();

        if(form.getFieldValue('password') !== form.getFieldValue('newPassword')) {
            message.error("Both passwords must be the same.");
            return;
        }

        mutateResetPassword.mutate({
            token: searchParams.get('token'),
            newPassword: form.getFieldValue('newPassword')
        });
    }

    if(resetSuccess) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
            <div className="w-full max-w-md p-6 bg-white rounded-lg">
                <div className='forgot-header flex flex-col text-center gap-2 mb-6'>
                    <img
                        src={successIcon}
                        alt="Status"
                        className="h-20 self-center w-fit mb-4"
                    />
                    <h1 className="text-3xl font-bold">
                        Password Reset
                    </h1>
                    <h2 className='text-sm font-light mb-4'>Your password has been successfully reset. Click below to log in magically.</h2>
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
                            onClick={() => {
                                navigate('/login');
                            }}
                        >
                            Continue
                        </Button>
                    </Form.Item>
                </Form>

                <div className="text-center mt-8 flex items-center justify-center gap-3">
                    <ArrowLeft onClick={() => navigate('/login')} className='cursor-pointer hover:text-slate-400 transition-all duration-300 text-black rounded-full' />
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
                    <img
                        src={featuredIcon}
                        alt="Spotteo Logo"
                        className="h-20 self-center w-fit mb-4"
                    />
                    <h1 className="text-3xl font-bold">
                        Set New Password
                    </h1>
                    <h2 className='text-sm font-light mb-4'>Your new password must be different to previously used passwords.</h2>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onSubmitCapture={handleResetPassword}
                >
                    <Form.Item
                        name="password"
                        label="New Password"
                        rules={[
                            { required: true, message: 'Enter new password' },
                        ]}
                    >
                        <Input.Password minLength={8} size="large" placeholder="Enter your password" />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="Confirm Password"
                        rules={[
                            { required: true, message: 'Confirm your password' },
                        ]}
                    >
                        <Input.Password minLength={8} size="large" placeholder="Enter your password" />
                    </Form.Item>

                    <Form.Item>
                        <Button
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
                    <ArrowLeft onClick={() => navigate('/login')} className='cursor-pointer hover:text-slate-400 transition-all duration-300 text-black rounded-full' />
                    <p>
                        Back to login
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SetupPassword;
