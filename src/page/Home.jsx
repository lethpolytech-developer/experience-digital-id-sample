import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Card, Typography } from '@ellucian/react-design-system/core';
import Barcode from 'react-barcode';
import { usePageControl, useExtensionInfo } from "@ellucian/experience-extension-utils";
import { DataQueryProvider, userTokenDataConnectQuery, useDataQuery } from '@ellucian/experience-extension-extras';
import "bootstrap/dist/css/bootstrap.css";
import "../digital-id.css"
import LethPolytechLogo from "../images/Lethbridge_Polytechnic_logo_colour.png"
import BeReadyLogo from "../images/be-ready-tm.png"

const cacheKey = 'digital-id-ethos';
const photoApiUrl = "{your_custom_api_url_here}" // Enter your custom API URL for retreiving photo data with JWT authentication

// For more information about creating your custom API for Experience, please see: https://resources.elluciancloud.com/bundle/ellucian_experience/page/c_extension_get_data_custom_api.html
// Our solution began by following the ASP.NET example here: https://resources.elluciancloud.com/bundle/ellucian_experience/page/c_server_side_example_asp_net.html

// --- Additional Resources ---
// Please the "Additional Resources" folder at the root of the repository for these code samples:
//
// "Custom ASP.NET API - Sample.cs": A simple demonstration of the server-side processing of a request from Experience in a custom ASP.NET API.
// "Data-Connect-Pipeline_person-details.json": A Data Connect Pipeline configuration for retrieving Colleague Person information via Ethos.

const HomePageWithProviders = (props) => {
    const {
        pageControl,
        data,
        cache
    } = props;
    const { configuration: { pipelineApi } = {} } = useExtensionInfo();

    const options = {
        queryFunction: userTokenDataConnectQuery,
        resource: pipelineApi,
        enabled: false
    };

    return (
        <DataQueryProvider options={options}>
            <HomePage pageControl={pageControl} data={data} cache={cache} />
        </DataQueryProvider>
    );
};

HomePageWithProviders.propTypes = {
    data: PropTypes.object.isRequired,
    pageControl: PropTypes.object.isRequired,
    cache: PropTypes.object.isRequired
};

const HomePage = (props) => {
    const { setPageTitle } = usePageControl();

    setPageTitle("My Digital ID");

    const {
        pageControl: {
            loadingStatus,
            setLoadingStatus
        },
        data: { getExtensionJwt },
        cache: { getItem, storeItem }
    } = props;

    const { configuration: { pipelineApi } = {} } = useExtensionInfo();
    const { data, isLoading, isRefreshing, setEnabled } = useDataQuery(pipelineApi);

    useEffect(() => {
        if (data) {
            setFirstNameString(data.firstName);
            setLastNameString(data.lastName);
            setIdNumberString(data.id);
            setStudentEmailString(data.email);

            storeItem({ key: cacheKey, data: data });
        }

        setLoadingStatus(isRefreshing || isLoading || isPhotoLoading);
    }, [data, isLoading, isRefreshing, setLoadingStatus, isPhotoLoading]);

    useEffect(() => {
        async function getPhoto(jwt) {
            const response = await fetch(`${photoApiUrl}/PhotoId/GetPhotoData`, {
                method: "GET",
                mode: 'cors',
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            });

            return response;
        }

        async function getStatus(jwt) {
            const response = await fetch(`${photoApiUrl}/PhotoId/GetPhotoStatus`, {
                method: "GET",
                mode: 'cors',
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            });

            return response;
        }

        (async () => {
            const jwt = await getExtensionJwt();

            const photoDataResponse = await getPhoto(jwt);
            const photoDataJson = await photoDataResponse.json();
            setPhotoData(photoDataJson.data);

            const photoStatusResponse = await getStatus(jwt);
            const photoStatusJson = await photoStatusResponse.json();
            setPhotoStatus(photoStatusJson.status);
            setIsPhotoLoading(false);

            const { data: cachedData, expired: cachedDataExpired = true } = await getItem({ key: cacheKey });
            if (cachedData) {
                setLoadingStatus(false);
                setFirstNameString(cachedData.firstName);
                setLastNameString(cachedData.lastName);
                setIdNumberString(cachedData.id);
                setStudentEmailString(cachedData.email);
            }
            if (cachedDataExpired || cachedData === undefined) {
                setEnabled(true);
            }
        })();
    }, []);

    const [isPhotoLoading, setIsPhotoLoading] = useState(true);
    const [photoData, setPhotoData] = useState("");
    const [photoStatus, setPhotoStatus] = useState("Checking");
    const [firstNameString, setFirstNameString] = useState("");
    const [lastNameString, setLastNameString] = useState("");
    const [idNumberString, setIdNumberString] = useState("");
    const [studentEmailString, setStudentEmailString] = useState("");

    return (
        <div className='page'>
            {!loadingStatus && photoData !== "" &&
                <Card className='card-margin'>
                    <div className='d-flex flex-column card-column'>
                        <div className='card-layout'>
                            <div className='d-flex flex-column align-items-center'>
                                <img alt="Student ID" src={`data:image/png;base64,${photoData}`} className='id-photo' />
                            </div>
                            <div className='d-flex flex-column card-info'>
                                <div className='d-flex flex-row align-items-center name-row'>
                                    <Typography className='name-text me-3'>
                                        <strong>{firstNameString} {lastNameString}</strong>
                                    </Typography>
                                    {photoStatus && <div className={`${photoStatus.toLowerCase()}-status ms-auto`}>{`Status: ${photoStatus}`}</div>}
                                </div>
                                <div className='d-flex flex-row'>
                                    <div className='d-flex flex-column'>
                                        <Typography className='label-text'>
                                            <strong>ID#</strong>
                                        </Typography>
                                        <Typography className='label-text'>
                                            <strong>Email</strong>
                                        </Typography>
                                    </div>
                                    <div className='d-flex flex-column ms-3'>
                                        <Typography className='detail-text'>
                                            {idNumberString ? `s${idNumberString}` : ''}
                                        </Typography>
                                        <Typography className='detail-text'>
                                            {studentEmailString}
                                        </Typography>
                                    </div>
                                </div>
                                <div className='d-flex flex-row justify-content-center barcode-container'>
                                    <Barcode value={idNumberString === "" ? "0000000" : idNumberString} format='codabar' displayValue={false} width={3} height={50} />
                                </div>
                            </div>
                        </div>
                        <div className='d-flex flex-row'>
                            <div className='d-block mt-auto'>
                                <img alt="Lethbridge Polytechnic" src={LethPolytechLogo} className='lethpolytech-logo' />
                            </div>
                            <div className='d-block ms-auto mt-auto'>
                                <img alt="Be Ready" src={BeReadyLogo} className='be-ready-logo' />
                            </div>
                        </div>
                    </div>
                </Card>
            }
        </div>
    );
};

HomePage.propTypes = {
    data: PropTypes.object.isRequired,
    pageControl: PropTypes.object.isRequired,
    cache: PropTypes.object.isRequired
};

export default HomePageWithProviders;