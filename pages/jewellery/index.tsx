import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import JewelleryCard from '../../libs/components/jewellery/JewelleryCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter from '../../libs/components/jewellery/Filter';
import { useRouter } from 'next/router';
import { JewelleriesInquiry } from '../../libs/types/jewellery/jewellery.input';
import { Jewellery } from '../../libs/types/jewellery/jewellery';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Direction, Message } from '../../libs/enums/common.enum';
import { GET_JEWELLERIES } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_JEWELLERY } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

const JewelleryList: NextPage = ({ initialInput, ...props }: any) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const [searchFilter, setSearchFilter] = useState<JewelleriesInquiry>(
    router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
  );
  const [jewelleries, setJewelleries] = useState<Jewellery[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sortingOpen, setSortingOpen] = useState(false);
  const [filterSortName, setFilterSortName] = useState('New');

  /** APOLLO REQUESTS **/
  const [likeTargetJewellery] = useMutation(LIKE_TARGET_JEWELLERY);

  const {
    loading: getJewelleriesLoading,
    data: getJewelleriesData,
    error: getJewelleriesError,
    refetch: getJewelleriesRefetch,
  } = useQuery(GET_JEWELLERIES, {
    fetchPolicy: 'network-only',
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setJewelleries(data?.getJewelleries?.list);
      setTotal(data?.getJewelleries?.metaCounter[0]?.total);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    if (router.query.input) {
      const inputObj = JSON.parse(router?.query?.input as string);
      setSearchFilter(inputObj);
    }

    setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
  }, [router]);

  useEffect(() => {
    console.log('searchFilter):', searchFilter);
    getJewelleriesRefetch({ input: searchFilter }).then();
  }, [searchFilter]);

  /** HANDLERS **/

  const likeJewelleryHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      //execute likeJewelleryHandler
      await likeTargetJewellery({ variables: { input: id } });

      // execute getJewelleriesRefetch
      await getJewelleriesRefetch({ input: initialInput });

      await sweetTopSmallSuccessAlert('success', 800);
    } catch (err: any) {
      console.log('ERROR, likeJewelleryHandler:', err.message);
      sweetMixinErrorAlert(err.message).then();
    }
  };

  const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
    searchFilter.page = value;
    await router.push(
      `/jewellery?input=${JSON.stringify(searchFilter)}`,
      `/jewellery?input=${JSON.stringify(searchFilter)}`,
      {
        scroll: false,
      },
    );
    setCurrentPage(value);
  };

  const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    setSortingOpen(true);
  };

  const sortingCloseHandler = () => {
    setSortingOpen(false);
    setAnchorEl(null);
  };

  const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
    switch (e.currentTarget.id) {
      case 'new':
        setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.ASC });
        setFilterSortName('New');
        break;
      case 'lowest':
        setSearchFilter({ ...searchFilter, sort: 'jewelleryPrice', direction: Direction.ASC });
        setFilterSortName('Lowest Price');
        break;
      case 'highest':
        setSearchFilter({ ...searchFilter, sort: 'jewelleryPrice', direction: Direction.DESC });
        setFilterSortName('Highest Price');
    }
    setSortingOpen(false);
    setAnchorEl(null);
  };

  if (device === 'mobile') {
    return <h1>JEWELLERIES MOBILE</h1>;
  } else {
    return (
      <div id="property-list-page" style={{ position: 'relative' }}>
        <div className="container">
          <Box component={'div'} className={'right'}>
            <span>Sort by</span>
            <div>
              <Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
                {filterSortName}
              </Button>
              <Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
                <MenuItem
                  onClick={sortingHandler}
                  id={'new'}
                  disableRipple
                  sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
                >
                  New
                </MenuItem>
                <MenuItem
                  onClick={sortingHandler}
                  id={'lowest'}
                  disableRipple
                  sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
                >
                  Lowest Price
                </MenuItem>
                <MenuItem
                  onClick={sortingHandler}
                  id={'highest'}
                  disableRipple
                  sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
                >
                  Highest Price
                </MenuItem>
              </Menu>
            </div>
          </Box>
          <Stack className={'property-page'}>
            <Stack className={'filter-config'}>
              {/* @ts-ignore */}
              <Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
            </Stack>
            <Stack className="main-config" mb={'76px'}>
              <Stack className={'list-config'}>
                {jewelleries?.length === 0 ? (
                  <div className={'no-data'}>
                    <img src="/img/icons/icoAlert.svg" alt="" />
                    <p>No Data found!</p>
                  </div>
                ) : (
                  jewelleries.map((jewellery: Jewellery) => {
                    return (
                      <JewelleryCard
                        jewellery={jewellery}
                        likeJewelleryHandler={likeJewelleryHandler}
                        key={jewellery?._id}
                      />
                    );
                  })
                )}
              </Stack>
              <Stack className="pagination-config">
                {jewelleries.length !== 0 && (
                  <Stack className="pagination-box">
                    <Pagination
                      page={currentPage}
                      count={Math.ceil(total / searchFilter.limit)}
                      onChange={handlePaginationChange}
                      shape="circular"
                      color="primary"
                    />
                  </Stack>
                )}

                {jewelleries.length !== 0 && (
                  <Stack className="total-result">
                    <Typography>
                      Total {total} jeweller{total > 1 ? 'ies' : 'y'} available
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Stack>
        </div>
      </div>
    );
  }
};

JewelleryList.defaultProps = {
  initialInput: {
    page: 1,
    limit: 9,
    sort: 'createdAt',
    direction: 'DESC',
    search: {
      squaresRange: {
        start: 0,
        end: 500,
      },
      pricesRange: {
        start: 0,
        end: 10000,
      },
    },
  },
};

export default withLayoutBasic(JewelleryList);
