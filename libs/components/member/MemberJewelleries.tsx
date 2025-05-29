import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { JewelleryCard } from '../mypage/JewelleryCard';
import { Jewellery } from '../../types/jewellery/jewellery';
import { JewelleriesInquiry } from '../../types/jewellery/jewellery.input';
import { T } from '../../types/common';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_JEWELLERIES } from '../../../apollo/user/query';

const MyJewelleries: NextPage = ({ initialInput, ...props }: any) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const { memberId } = router.query;
  const [searchFilter, setSearchFilter] = useState<JewelleriesInquiry>({ ...initialInput });
  const [agentJewelleries, setAgentJewelleries] = useState<Jewellery[]>([]);
  const [total, setTotal] = useState<number>(0);

  /** APOLLO REQUESTS **/
  const {
    loading: getJewelleriesLoading,
    data: getJewelleriesData,
    error: getJewelleriesError,
    refetch: getJewelleriesRefetch,
  } = useQuery(GET_JEWELLERIES, {
    fetchPolicy: 'network-only',
    variables: { input: searchFilter },
    skip: !searchFilter?.search?.memberId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setAgentJewelleries(data?.getJewelleries?.list);
      setTotal(data?.getJewelleries?.metaCounter[0]?.total ?? 0);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    getJewelleriesRefetch().then();
  }, [searchFilter]);

  useEffect(() => {
    if (memberId)
      setSearchFilter({ ...initialInput, search: { ...initialInput.search, memberId: memberId as string } });
  }, [memberId]);

  /** HANDLERS **/
  const paginationHandler = (e: T, value: number) => {
    setSearchFilter({ ...searchFilter, page: value });
  };

  if (device === 'mobile') {
    return <div>SHOPPE JEWELLERIES MOBILE</div>;
  } else {
    return (
      <div id="member-properties-page">
        <Stack className="main-title-box">
          <Stack className="right-box">
            <Typography className="main-title">Jewelleries</Typography>
          </Stack>
        </Stack>
        <Stack className="properties-list-box">
          <Stack className="list-box">
            {agentJewelleries?.length > 0 && (
              <Stack className="listing-title-box">
                <Typography className="title-text">Listing title</Typography>
                <Typography className="title-text">Date Published</Typography>
                <Typography className="title-text">Status</Typography>
                <Typography className="title-text">View</Typography>
              </Stack>
            )}
            {agentJewelleries?.length === 0 && (
              <div className={'no-data'}>
                <img src="/img/icons/icoAlert.svg" alt="" />
                <p>No Jewellery found!</p>
              </div>
            )}
            {agentJewelleries?.map((jewellery: Jewellery) => {
              return <JewelleryCard jewellery={jewellery} memberPage={true} key={jewellery?._id} />;
            })}

            {agentJewelleries.length !== 0 && (
              <Stack className="pagination-config">
                <Stack className="pagination-box">
                  <Pagination
                    count={Math.ceil(total / searchFilter.limit)}
                    page={searchFilter.page}
                    shape="circular"
                    color="primary"
                    onChange={paginationHandler}
                  />
                </Stack>
                <Stack className="total-result">
                  <Typography>{total} jewelleries available</Typography>
                </Stack>
              </Stack>
            )}
          </Stack>
        </Stack>
      </div>
    );
  }
};

MyJewelleries.defaultProps = {
  initialInput: {
    page: 1,
    limit: 5,
    sort: 'createdAt',
    search: {
      memberId: '',
    },
  },
};

export default MyJewelleries;
