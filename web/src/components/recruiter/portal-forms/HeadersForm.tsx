import {Checkbox, Form, Input, Select} from "antd";
import TextArea from "antd/es/input/TextArea";


export const HeadersForm = () => {
    return (
        <div>
            <Form.Item
                name="name"
                label="Your Company Name"
                rules={[{required: true, message: 'Please enter name'}]}
            >
                <Input placeholder=""/>
            </Form.Item>

            <Form.Item name="header" label="Headline">
                <Input placeholder=""/>
            </Form.Item>

            <Form.Item
                name="description"
                label="Subheadline"
                rules={[{required: true, message: 'Please enter job description'}]}
            >
                <TextArea className={'rounded-none'} rows={6} placeholder="Enter detailed job description..."/>
            </Form.Item>
        </div>
    )
}