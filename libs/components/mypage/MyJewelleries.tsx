import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { JewelleryCard } from './JewelleryCard';
import { Jewellery } from '../../types/jewellery/jewellery';
import { AgentJewelleriesInquiry } from '../../types/jewellery/jewellery.input';
import { T } from '../../types/common';
import { JewelleryStatus } from '../../enums/jewellery.enum';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { UPDATE_JEWELLERY } from '../../../apollo/user/mutation';
import { GET_AGENT_JEWELLERIES } from '../../../apollo/user/query';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';

const MyJewelleries: NextPage = ({ initialInput, ...props }: any) => {
  const device = useDeviceDetect();
  const [searchFilter, setSearchFilter] = useState<AgentJewelleriesInquiry>(initialInput);
  const [agentJewelleries, setAgentJewelleries] = useState<Jewellery[]>([]);
  const [total, setTotal] = useState<number>(0);
  const user = useReactiveVar(userVar);
  const router = useRouter();

  /** APOLLO REQUESTS **/
  const [updateJewellery] = useMutation(UPDATE_JEWELLERY);

  const {
    loading: getAgentJewelleriesLoading,
    data: getAgentJewelleriesData,
    error: getAgentJewelleriesError,
    refetch: getAgentJewelleriesRefetch,
  } = useQuery(GET_AGENT_JEWELLERIES, {
    fetchPolicy: 'network-only',
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setAgentJewelleries(data?.getAgentJewelleries?.list);
      setTotal(data?.getAgentJewelleries?.metaCounter[0]?.total ?? 0);
    },
  });

  /** HANDLERS **/
  const paginationHandler = (e: T, value: number) => {
    setSearchFilter({ ...searchFilter, page: value });
  };

  const changeStatusHandler = (value: JewelleryStatus) => {
    setSearchFilter({ ...searchFilter, search: { jewelleryStatus: value } });
  };

  const deleteJewelleryHandler = async (id: string) => {
    try {
      if (await sweetConfirmAlert('Are you sure to delete this jewellery?')) {
        await updateJewellery({
          variables: {
            input: {
              _id: id,
              JewelleryStatus: 'OUT_OF_STOCK',
            },
          },
        });

        await getAgentJewelleriesRefetch({ input: searchFilter });
      }
    } catch (err: any) {
      await sweetErrorHandling(err);
    }
  };

  const updateJewelleryHandler = async (status: string, id: string) => {
    try {
      if (await sweetConfirmAlert(`Are you sure change to ${status} status?`)) {
        await updateJewellery({
          variables: {
            input: {
              _id: id,
              jewelleryStatus: status,
            },
          },
        });

        await getAgentJewelleriesRefetch({ input: searchFilter });
      }
    } catch (err: any) {
      await sweetErrorHandling(err);
    }
  };

  if (user?.memberType !== 'AGENT') {
    router.back();
  }

  if (device === 'mobile') {
    return <div>NESTAR JEWELLERIES MOBILE</div>;
  } else {
    return (
      <div id="my-property-page">
        <Stack className="main-title-box">
          <Stack className="right-box">
            <Typography className="main-title">My Jewelleries</Typography>
            <Typography className="sub-title">We are glad to see you again!</Typography>
          </Stack>
        </Stack>
        <Stack className="property-list-box">
          <Stack className="tab-name-box">
            <Typography
              onClick={() => changeStatusHandler(JewelleryStatus.AVAILABLE)}
              className={searchFilter.search.jewelleryStatus === 'AVAILABLE' ? 'active-tab-name' : 'tab-name'}
            >
              On Sale
            </Typography>
            <Typography
              onClick={() => changeStatusHandler(JewelleryStatus.RESERVED)}
              className={searchFilter.search.jewelleryStatus === 'RESERVED' ? 'active-tab-name' : 'tab-name'}
            >
              On Reserved
            </Typography>
          </Stack>
          <Stack className="list-box">
            <Stack className="listing-title-box">
              <Typography className="title-text">Listing title</Typography>
              <Typography className="title-text">Date Published</Typography>
              <Typography className="title-text">Status</Typography>
              <Typography className="title-text">View</Typography>
              {searchFilter.search.jewelleryStatus === 'AVAILABLE' && (
                <Typography className="title-text">Action</Typography>
              )}
            </Stack>

            {agentJewelleries?.length === 0 ? (
              <div className={'no-data'}>
                <img src="/img/icons/icoAlert.svg" alt="" />
                <p>No Jewellery found!</p>
              </div>
            ) : (
              agentJewelleries.map((jewellery: Jewellery) => {
                return (
                  <JewelleryCard
                    jewellery={jewellery}
                    deleteJewelleryHandler={deleteJewelleryHandler}
                    updateJewelleryHandler={updateJewelleryHandler}
                  />
                );
              })
            )}

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
                  <Typography>{total} jewellery available</Typography>
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
      JewelleryStatus: 'AVAILABLE',
    },
  },
};

export default MyJewelleries;
