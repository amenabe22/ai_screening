import React, {useEffect, useRef, useState} from 'react';
import {Form, Input, Button, Spin, Select, Upload} from 'antd';
import {useUser} from "@clerk/clerk-react";
import {useQuery} from "@tanstack/react-query";
import {getAllBrands} from "../../apis";
import {PlusIcon} from "lucide-react";
import {UploadOutlined} from "@ant-design/icons";
import type {RadioChangeEvent} from 'antd';
import {Radio} from 'antd';

const DataForm: React.FC = ({hideStep, showStep}: { hideStep: () => void, showStep: () => void }) => {
    const {user} = useUser();
    const [brandVisible, setBrandVisible] = useState(true);
    const [value, setValue] = useState(1);
    const ref = useRef<any>(null);

    const onChange = (e: RadioChangeEvent) => {
        setValue(e.target.value);
    };

    const {data: brands, error: brandError, isLoading: brandLoading} = useQuery({
        queryKey: ['brands'],
        queryFn: () => getAllBrands(user?.primaryEmailAddress?.emailAddress || '')
    });

    // useEffect(() => {
    //     if(ref.current) {
    //         ref.current.setValue('');
    //     }
    // }, [value]);

    return (
        <div className={'space-y-4 mt-4'}>
            <div className="mb-4 text-lg pb-2 border-b">Setup Your Brand</div>
            <div>
                <Button onClick={() => {
                    setBrandVisible(!brandVisible);

                    if (brandVisible) {
                        showStep();
                    } else {
                        hideStep();
                    }
                }} icon={<PlusIcon/>} className={''}
                    type={"primary"}>Create Brand</Button>
                    </div>
                {brandLoading && <div className={'flex items-center'}><Spin/></div>
            }
            {((brands && brands.length < 1 || brandError) || !brandVisible) && <>
                <div className="bg-white">
                    <Form.Item
                        name="templateName"
                        label="Template Name"
                        rules={[{required: true, message: 'Please enter the template name'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        name="brandName"
                        label="Brand Name"
                        rules={[{required: true, message: 'Please enter the brand name'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        name="brandLogoUrl"
                        label="Brand Logo URL"
                        rules={[{required: true, message: 'Please enter the brand logo URL'}]}
                    >
                        <Upload
                            name='logoFile'
                            maxCount={1}
                            beforeUpload={() => false}
                            accept=".png, .jpg, .svg, .jpeg, .pdf"
                        >
                            <Button icon={<UploadOutlined/>}>Upload Logo</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="primaryColor"
                        label="Primary Color"
                        rules={[{required: true, message: 'Please enter the primary color'}]}
                    >
                        <Input type="color" className="w-full h-10"/>
                    </Form.Item>

                    <Form.Item
                        name="secondaryColor"
                        label="Secondary Color"
                        rules={[{required: true, message: 'Please enter the secondary color'}]}
                    >
                        <Input type="color" className="w-full h-10"/>
                    </Form.Item>

                    <Form.Item
                        name="hrRepresentativeName"
                        label="HR Representative Name"
                        rules={[{required: true, message: 'Please enter the HR representative name'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        name="hrRepresentativePosition"
                        label="HR Representative Position"
                        rules={[{required: true, message: 'Please enter the HR representative position'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        name="representativeImageFile"
                        label="Representative Image"
                        rules={[{required: true, message: 'Please enter the representative image'}]}
                    >
                        <Upload
                            name='hrFile'
                            maxCount={1}
                            beforeUpload={() => false}
                            accept=".png, .jpg, .jpeg, .svg, .pdf"
                        >
                            <Button icon={<UploadOutlined/>}>Upload Representative Image</Button>
                        </Upload>
                    </Form.Item>

                    {/*<Form.Item*/}
                    {/*    className={'mb-0 space-y-0'}*/}
                    {/*    name="welcomeVideoUrl"*/}
                    {/*    label="Welcome Video URL"*/}
                    {/*    rules={[{required: false, message: 'Please enter the welcome video URL'}]}*/}
                    {/*>*/}
                    {/*    {value === 1 && <Input ref={ref} placeholder={"Video URL"}/>}*/}
                    {/*    {value === 2 && <Upload*/}
                    {/*        name='welcomeVideo'*/}
                    {/*        maxCount={1}*/}
                    {/*        beforeUpload={() => false}*/}
                    {/*    >*/}
                    {/*        <Button icon={<UploadOutlined/>}>Upload Welcome Video</Button>*/}
                    {/*    </Upload>}*/}
                    {/*</Form.Item>*/}

                    {/*<Radio.Group name={'welcomeVideoUrlType'} className={'mb-3 mt-1'} onChange={onChange} value={value}>*/}
                    {/*    <Radio value={1}>Youtube</Radio>*/}
                    {/*    <Radio value={2}>Video File</Radio>*/}
                    {/*</Radio.Group>*/}

                    <Form.Item
                        name="email"
                        label="Email"
                        initialValue={user?.primaryEmailAddress?.emailAddress}
                        rules={[
                            {required: true, message: 'Please enter the email'},
                            {type: 'email', message: 'Please enter a valid email'}
                        ]}
                    >
                        <Input disabled={true} value={user?.primaryEmailAddress?.emailAddress}/>
                    </Form.Item>
                </div>
            </>}
            {(brands && brands.length > 0 && brandVisible) && <>
                <Form.Item name={"brandId"} label={"Select Your Brand"}>
                    <Select value={!brandVisible && null}> {brands.map((item) => {
                        return <Select.Option value={item?.id}>{item?.brandName}</Select.Option>;
                    })}
                    </Select>
                </Form.Item>
            </>}
        </div>
    );
};

export default DataForm;