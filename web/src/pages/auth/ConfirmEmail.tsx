import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {confirmEmail} from "../../apis";
import LoadingSpinner from "../../components/common/LoadingSpinner.tsx";
import {Alert, message} from "antd";
import {isAxiosError} from "../../utils/helpers.ts";
import {useEffect} from "react";


export const ConfirmEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    console.log("TOKEN: ", searchParams.get('token'));

    const {data, error, isSuccess, isLoading} = useQuery({
        queryKey: ['confirm-email', searchParams.get('token')],
        queryFn: () => confirmEmail(searchParams.get('token') || ''),
    });

    useEffect(() => {
        if(isSuccess === true) {
            console.log('data: ', data);
            message.success('Email confirmed successfully. Please login to continue.');

            setTimeout(() => {
                navigate('/login');
            }, 1500)
        }
    }, [isSuccess]);

    return (
        <div className={'bg-white p-20 h-full w-full flex items-center justify-center'}>
            {isLoading && <LoadingSpinner />}
            {error && <Alert message={isAxiosError(error) ? error?.response?.data.message : 'Failed to confirm email'} />}
        </div>
    )
}