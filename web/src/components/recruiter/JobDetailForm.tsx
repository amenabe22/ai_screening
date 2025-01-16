import {Checkbox, Form, Input, Select} from "antd";
import TextArea from "antd/es/input/TextArea";


export const JobDetailForm = () => {
    return (
        <div>
            <Form.Item
                name="title"
                label="Job Title As Seen By Candidates"
                rules={[{required: true, message: 'Please enter job title'}]}
            >
                <Input placeholder="e.g. Senior Software Engineer"/>
            </Form.Item>

            <Form.Item
                name="description"
                label="Job Detail To Be Read By Applicants"
                rules={[{required: true, message: 'Please enter job description'}]}
            >
                <TextArea rows={6} placeholder="Enter detailed job description..."/>
            </Form.Item>

            <Form.Item
                name="header"
                label="Job Header"
                rules={[{required: true, message: 'Please enter job header'}]}
            >
                <Input placeholder=""/>
            </Form.Item>

            <Form.Item
                name="jobType"
                label="Job Type"
                rules={[{required: true, message: 'Please enter job title'}]}
            >
                <Select mode={"multiple"}>
                    <Select.Option value={"Remote"}>Remote</Select.Option>
                    <Select.Option value={"On Site"}>On Site</Select.Option>
                    <Select.Option value={"Hybrid"}>Hybrid</Select.Option>
                </Select>
            </Form.Item>
        </div>
    )
}