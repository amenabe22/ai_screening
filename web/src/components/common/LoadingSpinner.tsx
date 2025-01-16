import React from 'react';
import { Spin } from 'antd';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <Spin size="large" />
    </div>
  );
}

export default LoadingSpinner;