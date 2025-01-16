import React from 'react';
import { Alert } from 'antd';

interface ErrorMessageProps {
  message: string;
}

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <Alert
      message="Error"
      description={message}
      type="error"
      showIcon
      className="mb-4"
    />
  );
}

export default ErrorMessage;