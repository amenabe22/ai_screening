import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Space, TimePicker, TimePickerProps, message } from 'antd';
import { PlusCircle, Trash2 } from 'lucide-react';
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import api from '../../lib/axios';

dayjs.extend(customParseFormat);

function QuestionList({ form }: { form: any }) {
    const [timeValue, setTimevalue] = useState({});
    const onChange = (time: Dayjs, timeString, key) => {
        console.log(time, timeString);
        setTimevalue({ ...timeValue, [key]: timeString });
        console.log('timeval: ', timeValue);

        form?.setFieldsValue({
            questions: form?.getFieldValue('questions')?.map((question, index) =>
                index === key ? { ...question, timer: timeString } : question
            ),
        });
    };
    // const queryClient = useQueryClient();
    const [questions, setQuestions] = useState([]);
    // const [error, setError] = useState(null);
    const jobTitle = form.getFieldValue('title')
    const jobDesc = form.getFieldValue('description')
    const questionQuestions = useMutation({
        mutationFn: async () => {
            return await api.post('/jobs/gen-q/', {
                "title": jobTitle,
                "id": "4",
                "description": jobDesc,
                "total_questions": "10"
            });
        },
        onSuccess: ({ data }) => {
            const data_keys = Object.keys(data)
            const questions = data[data_keys[0]]
            console.log("DATA: ", questions);
            message.success('Questions created successfully');
            // form.resetFields();
            // queryClient.invalidateQueries({ queryKey: ['jobs'] });
            // setQuestions(questions); // Assuming the API response is in this format

            form.setFieldsValue({
                questions: questions.map(({ question, type }) => ({
                    text: question,
                    type,
                    timer: '' // Initialize timer as empty
                }))
            });
            // setTimeout(() => {
            //     navigate('/jobs');
            // }, 2000);
        },
        onError: (err) => {
            console.log("ERR: ", err)
        }
    });
    useEffect(() => {
        questionQuestions.mutate()
    }, []); // Empty dependency array ensures the effect runs only once


    return (
        <Form.List name="questions">
            {(fields, { add, remove }) => (
                <div className="space-y-4 mb-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Interview Questions</h3>
                    </div>
                    <div className={'flex flex-col items-center gap-4'}>
                        {questions.map((e) => (
                            <div>
                                <h3>{e.question}</h3>
                                <h2>{e.type}</h2>
                            </div>
                        ))}
                        {fields.map(({ key, name, ...restField }) => (
                            <div className={'w-full space-y-2'}>
                                <p className={'flex items-center gap-2'}><span
                                    className={'text-red-500 font-normal text-2xl'}>*</span>
                                    <span>Question #{key + 1}</span></p>
                                <div className="flex w-full items-start gap-3">
                                    <div className={'flex-grow flex flex-col'}>
                                        <div className={'flex gap-3 items-center'}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'text']}
                                                rules={[{ required: true, message: 'Question is required' }]}
                                                className="flex-grow basis-full m-0"
                                            >
                                                <Input.TextArea
                                                    placeholder="Enter interview question"
                                                    rows={2}
                                                    className="w-full min-w-[600px] rounded-none min-h-20"
                                                />
                                            </Form.Item>

                                            <Form.Item

                                                {...restField}
                                                name={[name, 'timer']}
                                                hidden
                                                initialValue={timeValue[key] || ''}
                                            >
                                                <Input value={timeValue[key] || ''} />
                                            </Form.Item>

                                            <Form.Item
                                                {...restField}
                                                label={"Timer"}
                                                rules={[{ required: true, message: 'Timer is required' }]}
                                            >
                                                <TimePicker onChange={(time, timeString) => onChange(time, timeString, key)} name={'timer'} showNow={false} format={'mm:ss'} defaultOpenValue={dayjs('00:00', 'mm:ss')} />
                                            </Form.Item>
                                        </div>
                                        <span className={'self-end text-blue-600 border-b mt-2 font-semibold'}>
                                            Make it important
                                        </span>
                                    </div>
                                    <Button
                                        className={'flex items-center justify-center p-6 bg-gray-100 rounded-lg shadow-md'}
                                        type="text"
                                        icon={<Trash2 className="w-4 h-4 text-red-500" />}
                                        onClick={() => remove(name)}
                                    />
                                </div>
                            </div>
                        ))}
                        <Button
                            type="dashed"
                            onClick={() => add()}
                            icon={<PlusCircle className="w-4 h-4" />}
                        >
                            Add Question
                        </Button>
                    </div>
                </div>
            )}
        </Form.List>
    );
}

export default QuestionList;